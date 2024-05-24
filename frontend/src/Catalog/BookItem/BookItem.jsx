import React from 'react';
import '../Catalog.css'

const BookItem = ({bookItem}) => {
    const { photo, bookID } = bookItem;

    console.log(photo)

    return (
        <div className="bookItemCard">
            <img src={`http://localhost:8000/${photo}`} alt={bookID.name} className="card-img-top"/>
            <div className="card-body">
                <h5 className="card-title">{bookID.name}</h5>
                <p className="card-text">Author: {bookID.author}</p>
                <p className="card-text">Genre: {bookID.genre}</p>
                <p className="card-text">Language: {bookID.language}</p>
            </div>
        </div>
    )
}

export default BookItem