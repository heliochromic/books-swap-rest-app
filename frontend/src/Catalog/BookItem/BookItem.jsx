import React from 'react';
import '../Catalog.css';
import {truncateDescription} from '../../utils'

const BookItem = ({bookItem}) => {
    const {itemID, photo, bookID} = bookItem;
    const truncatedDescription = truncateDescription(bookItem.description, 80); // Truncate to 100 characters

    return (
        <div className="bookItemCard">
            <a href={`http://localhost:3000/catalog/${itemID}`}>
                <div className="card">
                    <div className="card-img-top">
                        <span className="card-img-fit"
                              style={{
                                  backgroundImage: `url(http://localhost:8000/${photo})`,
                              }}/>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">{bookItem.title}</h5>
                        <h6 className="card-subtitle">{bookItem.author}</h6>
                        <p className="card-text mt-2">{bookItem.genre}</p>
                        <blockquote className="mb-0">
                            - {truncatedDescription}
                        </blockquote>
                    </div>
                </div>
            </a>
        </div>
    );
}

export default BookItem;
