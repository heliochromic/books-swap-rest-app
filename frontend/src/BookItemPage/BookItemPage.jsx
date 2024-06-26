import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import RequestModal from "./RequestModal/RequestModal"
import {errorMessage, getConfig, successMessage} from "../utils";
import {LoadingScreen} from "../Header/LoadingScreen";
import ErrorPage from "../Errors/ErrorPage";

const BookItemPage = () => {
    const {id} = useParams();
    const [book, setBook] = useState(null);
    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alreadyRequested, setAlreadyRequested] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const me = await axios.get(`http://localhost:8000/api/user/`, getConfig());
                setMe(me.data);
                const response = await axios.get(`http://localhost:8000/api/catalog/${+id}`, getConfig());
                if (response.data && (response.data.deletion_time !== null || response.data.exchange_time !== null)) {
                    setAlreadyRequested(true);
                }
                setBook(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id, alreadyRequested]);

    const handleBookDeletion = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/catalog/${+id}`, getConfig());
            navigate('/profile');
            successMessage("You successfully deleted the book")
        } catch (err) {
            errorMessage('Error deleting book:');
        }
    }

    if (loading) return <LoadingScreen></LoadingScreen>;
    if (error) return <ErrorPage error={error}></ErrorPage>;

    return (
        <section>
            <div className="container py-4 my-5">
                <div className="row gx-4 gx-lg-5 align-items-center">
                    <div className="col-md-12">
                        <div id="carouselExampleAutoplaying" className="carousel slide carousel-dark mb-5 mx-auto"
                             data-bs-ride="carousel ">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="0"
                                        className="active" aria-current="true" aria-label="Slide 1">
                                </button>
                                {book.photo2 && <button type="button" data-bs-target="#carouselExampleAutoplaying"
                                                        data-bs-slide-to="1"
                                                        aria-label="Slide 2"></button>}
                                {book.photo3 && <button type="button" data-bs-target="#carouselExampleAutoplaying"
                                                        data-bs-slide-to="2"
                                                        aria-label="Slide 3"></button>}
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active imageDetail">
                                    <span className="imageDetailCrop"
                                          style={{
                                              backgroundImage: `url(http://localhost:8000${book.photo})`,
                                          }}>
                                    </span>
                                </div>
                                {book.photo2 && <div className="carousel-item imageDetail">
                                    <span className="imageDetailCrop"
                                          style={{
                                              backgroundImage: `url(http://localhost:8000${book.photo2})`,
                                          }}>
                                    </span>
                                </div>}
                                {book.photo3 && <div className="carousel-item imageDetail">
                                    <span className="imageDetailCrop"
                                          style={{
                                              backgroundImage: `url(http://localhost:8000${book.photo3})`,
                                          }}>
                                    </span>
                                </div>}
                            </div>
                            {book.photo2 && (
                                <>
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
                                </>
                            )
                            }
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
                        <RequestModal alreadyRequested={alreadyRequested} setAlreadyRequested={setAlreadyRequested}/>
                        {book.userID === me.userID &&
                            <button className="delete-book-button" onClick={handleBookDeletion}>Delete</button>}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookItemPage;
