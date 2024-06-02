import React, {useEffect, useState} from 'react';
import axios from 'axios';
import BookItem from "./BookItem/BookItem";
import AddBookBadge from "./AddBookBadge/AddBookBadge";
import "./Catalog.css"


const Catalog = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');

                const config = {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                };

                const response = await axios.get('http://localhost:8000/api/catalog/', config);
                setItems(response.data);
                console.log(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData().then(r => console.log(r));
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;


    return (
        <div id="catalog">
            <div id="catalogContainer">
                {items.map(item => (
                    <BookItem key={+item.id} bookItem={item}/>
                ))}
            </div>
            <AddBookBadge/>
        </div>
    );
};

export default Catalog;