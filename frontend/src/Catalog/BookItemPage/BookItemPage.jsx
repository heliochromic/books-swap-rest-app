import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import RequestModal from "./RequestModal/RequestModal"

const BookItemPage = () => {
    const {id} = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const token = sessionStorage.getItem('token')

                const config = {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }

                const response = await axios.get(`http://localhost:8000/api/catalog/${id}`, config);
                setBook(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    if (loading) return <div className="text-center py-5">Loading...</div>;
    if (error) return <div className="alert alert-danger text-center">Error: {error}</div>;

    return (
        <section>
            <div className="container py-4 my-5">
                <div className="row gx-4 gx-lg-5 align-items-center">
                    <div className="col-md-12">
                        <div id="carouselExampleAutoplaying" className="carousel slide carousel-dark mx-auto"
                             data-bs-ride="carousel ">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="0"
                                        className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="1"
                                        aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="2"
                                        aria-label="Slide 3"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active imageDetail">
                                    <img src={`http://localhost:8000/${book.photo}`} className="d-block w-100"
                                         alt="..."/>
                                </div>
                                <div className="carousel-item imageDetail">
                                    <img src={`http://localhost:8000/${book.photo2}`} className="d-block w-100"
                                         alt="..."/>
                                </div>
                                <div className="carousel-item imageDetail">
                                    <img src={`http://localhost:8000/${book.photo3}`} className="d-block w-100"
                                         alt="..."/>
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button"
                                    data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button"
                                    data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="small mb-1">ISBN: {book.ISBN}</div>
                        <h1 className="display-5 fw-bolder">{book.title}</h1>
                        <div className="fs-5 mb-3">
                            <span>{book.author}</span>
                        </div>
                        <div className="fs-5">
                            <span className="badge mx-1 text-bg-primary">{book.genre}</span>
                            <span className="badge mx-1 text-bg-primary">{book.language}</span>
                        </div>
                        <p className="mt-3">
                            <span>Year: {book.year}</span>
                        </p>
                        <div>
                            <p className="lead">{book.description}</p>
                        </div>
                        <RequestModal/>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookItemPage;