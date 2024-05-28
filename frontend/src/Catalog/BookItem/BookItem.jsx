import React from 'react';
import '../Catalog.css'

const BookItem = ({bookItem}) => {
    const {itemID, photo, bookID} = bookItem;

    return (
        <div className="bookItemCard">
            <a href={`http://localhost:3000/catalog/${itemID}`}>
                <div className="imageWrapper">
                    <img src={`http://localhost:8000/${photo}`} alt={bookItem.title} className="card-img-top"/>
                </div>
                <div className="card-body">
                    <h5 className="card-title">{bookItem.title}</h5>
                    <p className="card-text">Author: {bookItem.author}</p>
                    <p className="card-text">Genre: {bookItem.genre}</p>
                    <p className="card-text">Language: {bookItem.language}</p>
                </div>
            </a>
        </div>
    )
}

export default BookItem