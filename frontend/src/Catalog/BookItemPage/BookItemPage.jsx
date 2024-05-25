import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookItemPage = () => {
    const { id } = useParams();
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


    console.log(book)
    if (loading) return <div className="text-center py-5">Loading...</div>;
    if (error) return <div className="alert alert-danger text-center">Error: {error}</div>;

    return (
        <section>
            <div className="container py-4 my-5">
                <div className="row gx-4 gx-lg-5 align-items-center">
                    <div className="col-md-6">
                        <div className="carousel slide" id="carouselExample" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img src={`http://localhost:8000/${book.photo}`} className="card-img-top mb-5 mb-md-0 imageDetail" alt={book.name}/>
                                </div>
                                <div className="carousel-item">
                                    <img src={`http://localhost:8000/${book.photo2}`} className="card-img-top mb-5 mb-md-0 imageDetail" alt={book.name}/>
                                </div>
                                <div className="carousel-item">
                                    <img src={`http://localhost:8000/${book.photo3}`} className="card-img-top mb-5 mb-md-0 imageDetail" alt={book.name}/>
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="small mb-1">SKU: BST-498</div>
                        <h1 className="display-5 fw-bolder">Shop item template</h1>
                        <div className="fs-5 mb-5">
                            <span className="text-decoration-line-through">$45.00</span>
                            <span>$40.00</span>
                        </div>
                        <p className="lead">Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium at
                            dolorem quidem modi. Nam sequi consequatur obcaecati excepturi alias magni, accusamus eius
                            blanditiis delectus ipsam minima ea iste laborum vero?</p>
                        <div className="d-flex">
                            <button className="btn btn-outline-dark flex-shrink-0" type="button">
                                <i className="bi bi-cart-fill me-1"></i>
                                Add to cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookItemPage;
