import React, {useEffect, useState, useCallback} from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import BookItemTiny from "./BookItemTiny/BookItemTiny";
import {errorMessage, getConfig, successMessage} from "../../utils";

const RequestModal = ({alreadyRequested, setAlreadyRequested}) => {
    const {id} = useParams();
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasBooks, setHasBooks] = useState(false);
    const [isMineBook, setIsMineBook] = useState(false);
    const [selectedItemId, setSelectedBookId] = useState(null);

    const fetchMyBooks = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/catalog/my/", getConfig());
            const books = response.data;
            console.log(alreadyRequested)
            setMyBooks(books);
            setHasBooks(books.length > 0);
            const isMine = books.some(book => +book.itemID === +id);
            setIsMineBook(isMine);
        } catch (err) {
            setError(err.message);
        }
    }, [id]);

    const checkIfAlreadyRequested = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/requests/my_requests/", getConfig());
            const requests = response.data;
            const isRequested = requests.some(request => request.receiver_book_id === +id && request.status !== "A");
            setAlreadyRequested(isRequested);
        } catch (err) {
            setError(err.message);
        }
    }, [id]);

    const requestBook = async () => {
        try {
            await axios.post(`http://localhost:8000/api/catalog/${+selectedItemId}`, {
                receiver_book_id: +id,
            }, getConfig());
            setAlreadyRequested(true);
            successMessage('Book requested successfully!');
            await fetchMyBooks();
        } catch (err) {
            setError(err.message);
            errorMessage("Error requesting the book")
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (!alreadyRequested) {
                await checkIfAlreadyRequested();
            }
            await fetchMyBooks();
            setLoading(false);
        };

        fetchData().then(r => console.log(r));
    }, [id, fetchMyBooks, checkIfAlreadyRequested]);

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !hasBooks && (
                <p>Please <Link to="/catalog/add">add</Link> at least one book to exchange with other users</p>
            )}
            {!loading && hasBooks && (
                <>
                    {alreadyRequested ? (
                        <></>
                    ) : (
                        <>
                            {isMineBook ? (
                                <p>You cannot request your own book.</p>
                            ) : (
                                <>
                                    {!alreadyRequested && (
                                        <button
                                            className="exchange-button"
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModal"
                                            type="button"
                                        >
                                            Exchange books
                                        </button>
                                    )}
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
                                                                onClick={() => setSelectedBookId(book.itemID)}
                                                            />
                                                        ))}
                                                        <div className="modal-footer">
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary"
                                                                data-bs-dismiss="modal"
                                                                style={{
                                                                    borderRadius: '25px',
                                                                    backgroundColor: 'red',
                                                                    border: '0'
                                                                }}
                                                            >
                                                                Close
                                                            </button>
                                                            <button type="submit" className="btn btn-primary"
                                                                    data-bs-dismiss="modal" style={{
                                                                borderRadius: '25px',
                                                                backgroundColor: 'dodgerblue',
                                                                border: '0'
                                                            }}>
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
