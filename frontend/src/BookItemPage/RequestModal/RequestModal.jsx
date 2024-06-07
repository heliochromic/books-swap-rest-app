import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import BookItemTiny from "./BookItemTiny/BookItemTiny";
import {getConfig} from "../../utils";

const RequestModal = () => {
    const {id} = useParams();
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasBooks, setHasBooks] = useState(false);
    const [isMineBook, setIsMineBook] = useState(false);
    const [selectedItemId, setSelectedBookId] = useState(null);
    const [alreadyRequested, setAlreadyRequested] = useState(false);

    const fetchMyBooks = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/catalog/my/", getConfig());
            console.log("fetchMyBooks")
            const books = response.data;
            setMyBooks(books);
            setHasBooks(books.length > 0);
            const isMine = books.some(book => +book.itemID === +id);
            setIsMineBook(isMine);
        } catch (err) {
            setError(err.message);
        }
    };

    const checkIfAlreadyRequested = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/requests/my_requests/", getConfig())
            console.log("checkIfAlreadyRequested")
            const requests = response.data;
            const isRequested = requests.some(request => request.receiver_book_id === +id);
            setAlreadyRequested(isRequested);
        } catch (err) {
            setError(err.message);
        }
    };

    const requestBook = async () => {
        try {
            await axios.post(`http://localhost:8000/api/catalog/${+selectedItemId}`, {
                receiver_book_id: +id,
            }, getConfig());
            console.log("requestBook")
            setAlreadyRequested(true);
            alert('Book requested successfully!');
            await fetchMyBooks();
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchMyBooks();
            await checkIfAlreadyRequested();
            setLoading(false);
        };

        fetchData();
    }, [id]);

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
                                        className="btn btn-outline-dark btn-md col-12"
                                        data-bs-toggle="modal"
                                        data-bs-target="#requestModal"
                                        type="button"
                                        style={{borderRadius: '25px'}}
                                    >
                                        Exchange books
                                    </button>
                                    <div
                                        className="modal fade"
                                        id="requestModal"
                                        tabIndex="-1"
                                        aria-labelledby="requestModalLabel"
                                        aria-hidden="true"
                                    >
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="requestModalLabel">
                                                        Select a Book to Exchange
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
                                                                onClick={() => setSelectedBookId(book.itemID)}
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
                                                            <button type="submit" className="btn btn-primary">
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
