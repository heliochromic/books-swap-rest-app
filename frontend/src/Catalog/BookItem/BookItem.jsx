import React from 'react';
import '../Catalog.css';
import {truncateDescription} from '../../utils'

const BookItem = ({bookItem}) => {
    const {itemID, photo, bookID, language} = bookItem;

    return (
        <div className="bookItemCard">
            <a href={`http://localhost:3000/catalog/${itemID}`}>
                <div className="card rounded-5">
                    <div className="card-img-top p-3">
                        <span className="card-img-fit"
                              style={{
                                  backgroundImage: `url(http://localhost:8000/${photo})`,
                              }}/>
                    </div>
                    <div className="card-body d-flex flex-wrap flex-column justify-content-between">
                        <div>
                            <h5 className="card-title">{bookItem.title}</h5>
                            <h6 className="card-subtitle author mb-2">{bookItem.author}</h6>
                        </div>
                        <div>
                            <span className="badge mx-1 text-bg-primary ms-0 rounded-5">{bookItem.genre}</span>
                            <span className="badge mx-1 text-bg-primary rounded-5">{bookItem.language}</span>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    );
}

export default BookItem;
