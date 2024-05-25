import React from 'react';
import '../Catalog.css'

const BookItem = ({key, bookItem}) => {
    const {itemID, photo, bookID} = bookItem;

    return (
        <div className="bookItemCard">
            <a href={`http://localhost:3000/catalog/${itemID}`}>
                <div className="imageWrapper">
                    <img src={`http://localhost:8000/${photo}`} alt={bookID.name} className="card-img-top"/>
                </div>
                <div className="card-body">
                    <h5 className="card-title">{bookID.name}</h5>
                    <p className="card-text">Author: {bookID.author}</p>
                    <p className="card-text">Genre: {bookID.genre}</p>
                    <p className="card-text">Language: {bookID.language}</p>
                </div>
            </a>
        </div>
    )
}

export default BookItem