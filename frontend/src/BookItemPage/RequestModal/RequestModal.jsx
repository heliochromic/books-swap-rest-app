import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import BookItemTiny from "./BookItemTiny/BookItemTiny";


const RequestModal = () => {
    const {id} = useParams();
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasBooks, setHasBooks] = useState(false);
    const [isMineBook, setIsMineBook] = useState(false);
    const [selectedItemId, setSelectedBookId] = useState(null);
    const [alreadyRequested, setAlreadyRequested] = useState(false);

    const handleRequestMyBooks = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Token ${token}`,
                },
            };

            const response = await axios.get(
                "http://localhost:8000/api/catalog/my/",
                config
            );


            const requests = response.data;
            console.log(requests.userID)
            const isMine = requests.some(request => +request.itemID === +id);

            setIsMineBook(isMine);
            setMyBooks(response.data);
            setHasBooks(response.data.length > 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const checkIfAlreadyRequested = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Token ${token}`,
                },
            };
            const response = await axios.get(
                "http://localhost:8000/api/requests/",
                config
            );

            const requests = response.data;
            const isRequested = requests.some(request => request.sender_book === parseInt(id, 10));
            setAlreadyRequested(isRequested);
        } catch (err) {
            setError(err.message);
        }
    };

    const requestBook = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Token ${token}`,
                },
            };

            const response = await axios.post(`http://localhost:8000/api/catalog/${+id}`, {
                receiver_book_id: +selectedItemId,
            }, config);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        alert('Book requested successfully!');

    };
    useEffect(() => {
        handleRequestMyBooks();
        checkIfAlreadyRequested();
    }, []);

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !hasBooks && (
                <p>Please add at least one book to exchange with other users</p>
            )}
            {!loading && hasBooks && (
                <>
                    {alreadyRequested ? (
                        <p>You have already requested this book.</p>
                    ) : (
                        <>
                            {isMineBook ? (
                                <p>You cannot request your own book.</p>
                            ) : (
                                <>
                                    <button
                                        onClick={handleRequestMyBooks}
                                        className="btn btn-outline-dark btn-md col-12"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        type="button"
                                    >
                                        Exchange books
                                    </button>
                                    <div
                                        className="modal fade"
                                        id="exampleModal"
                                        tabIndex="-1"
                                        aria-labelledby="exampleModalLabel"
                                        aria-hidden="true"
                                    >
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                                                        Modal title
                                                    </h1>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        data-bs-dismiss="modal"
                                                        aria-label="Close"
                                                    ></button>
                                                </div>
                                                <div className="modal-body">
                                                    <form
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            requestBook();
                                                        }}
                                                    >
                                                        {myBooks.map((book) => (
                                                            <BookItemTiny
                                                                key={book.itemID}
                                                                book={book}
                                                                onClick={(bookId) => setSelectedBookId(bookId)}
                                                            />
                                                        ))}
                                                        <div className="modal-footer">
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary"
                                                                data-bs-dismiss="modal"
                                                            >
                                                                Close
                                                            </button>
                                                            <button type="submit" className="btn btn-primary"
                                                                    data-bs-dismiss="modal">
                                                                Request
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default RequestModal;