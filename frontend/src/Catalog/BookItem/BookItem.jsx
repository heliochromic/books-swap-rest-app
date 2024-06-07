import React from 'react';
import '../Catalog.css';
import {Link} from "react-router-dom";

const BookItem = ({bookItem}) => {
    const {itemID, photo, genre, language, author, title} = bookItem;

    return (
        <div className="bookItemCard">
            <Link to={`http://localhost:3000/catalog/${itemID}`}>
                <div className="card rounded-5">
                    <div className="card-img-top p-3">
                        <span className="card-img-fit"
                              style={{
                                  backgroundImage: `url(http://localhost:8000/${photo})`,
                              }}/>
                    </div>
                    <div className="card-body d-flex flex-wrap flex-column justify-content-between">
                        <div>
                            <h5 className="card-title">{title}</h5>
                            <h6 className="card-subtitle author mb-2">{author}</h6>
                        </div>
                        <div>
                            <span className="badge mx-1 text-bg-primary ms-0 rounded-5">{genre}</span>
                            <span className="badge mx-1 text-bg-primary rounded-5">{language}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default BookItem;
