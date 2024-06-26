import React, {useEffect, useState} from 'react';
import axios from 'axios';
import BookItem from "./BookItem/BookItem";
import AddBookBadge from "./AddBookBadge/AddBookBadge";
import "./Catalog.css";
import {LoadingScreen} from "../Header/LoadingScreen";
import {getConfig} from "../utils";
import ErrorPage from "../Errors/ErrorPage";

const Catalog = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('titleAsc');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/catalog/', getConfig());
                setItems(response.data);
                console.log(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const filteredItems = items
        .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(item => statusFilter === 'all' || item.status === statusFilter)
        .sort((a, b) => {
            if (sortOrder === 'titleAsc') {
                return a.title.localeCompare(b.title);
            } else if (sortOrder === 'titleDesc') {
                return b.title.localeCompare(a.title);
            } else if (sortOrder === 'dateAsc') {
                return new Date(a.date) - new Date(b.date);
            } else if (sortOrder === 'dateDesc') {
                return new Date(b.date) - new Date(a.date);
            } else if (sortOrder === 'distanceAsc') {
                return a.distance - b.distance;
            } else if (sortOrder === 'distanceDesc') {
                return b.distance - a.distance;
            }
            return 0;
        });

    if (loading) return <LoadingScreen/>;
    if (error) return <ErrorPage error={error}/>;

    return (
        <div id="catalog">
            <h2>Catalog</h2>
            <div id="controls">
                <form className="row g-3" id="catalogConfigs">
                    <div className="col-md-8">
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            id="catalogSearch"
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-2">
                        <select value={sortOrder} onChange={handleSortChange} id="catalogSort" className="form-control">
                            <option value="titleAsc">From A to Z</option>
                            <option value="titleDesc">From Z to A</option>
                            <option value="dateAsc">From Newest to Oldest</option>
                            <option value="dateDesc">From Oldest to Newest</option>
                            <option value="distanceAsc">From Nearest to Furthest</option>
                            <option value="distanceDesc">From Furthest to Nearest</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <select value={statusFilter} onChange={handleStatusFilterChange} id="catalogStatusFilter"
                                className="form-control">
                            <option value="all">All Statuses</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                        </select>
                    </div>
                </form>

                <div id="catalogContainer">
                    {filteredItems.map(item => (
                        <BookItem key={+item.itemID} bookItem={item}/>
                    ))}
                </div>
            </div>
            <AddBookBadge/>
        </div>
    );
};

export default Catalog;
