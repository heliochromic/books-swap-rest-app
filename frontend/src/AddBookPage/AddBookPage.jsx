import {useEffect, useState} from "react";
import "./AddBookPage.css";
import axios from "axios";

const AddBookPage = () => {
    const [isbn, setIsbn] = useState('');
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        name: '',
        author: '',
        genre: '',
        language: '',
        pages: '',
        year: '',
        description: ''
    });

    const checkISBN = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');

            const config = {
                headers: {
                    'Authorization': `Token ${token}`
                }
            };

            const response = await axios.post('http://localhost:8000/api/isbn/', {
                'isbn': isbn
            }, config);
            setBook(response.data);
            setFormValues({
                name: response.data.name,
                author: response.data.author,
                genre: response.data.genre,
                language: response.data.language,
                pages: response.data.pages,
                year: response.data.year,
                description: response.data.description
            });
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div id="addBook">
            <form onSubmit={checkISBN}>
                <div className="mb-3">
                    <h2>Add new book</h2>
                    <label htmlFor="isbn" className="form-label">ISBN</label>
                    <div className="input-group mb-3">
                        <input
                            id="isbn"
                            type="text"
                            className="form-control"
                            placeholder="ISBN"
                            aria-label="ISBN"
                            aria-describedby="basic-addon2"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                        />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="submit">Check ISBN</button>
                        </div>
                    </div>
                </div>
            </form>
            <div className="book-details">
                <form>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text"
                               className="form-control"
                               placeholder="ISBN"
                               id="name"
                               name="name"
                               value={formValues.name}
                               onChange={handleInputChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="author" className="form-label">Author</label>
                        <input type="text"
                               className="form-control"
                               id="author"
                               name="author"
                               value={formValues.author}
                               onChange={handleInputChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="genre" className="form-label">Genre</label>
                        <input type="text"
                               className="form-control"
                               id="genre"
                               name="genre"
                               value={formValues.genre}
                               onChange={handleInputChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="language" className="form-label">Language</label>
                        <input type="text"
                               className="form-control"
                               id="language"
                               name="language"
                               value={formValues.language}
                               onChange={handleInputChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pages" className="form-label">Pages</label>
                        <input type="number"
                               className="form-control"
                               id="pages" name="pages"
                               value={formValues.pages}
                               onChange={handleInputChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="year" className="form-label">Year</label>
                        <input type="text"
                               className="form-control"
                               id="year"
                               name="year"
                               value={formValues.year}
                               onChange={handleInputChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea className="form-control"
                                  id="description"
                                  name="description"
                                  rows="3"
                                  value={formValues.description}
                                  onChange={handleInputChange}></textarea>
                    </div>
                </form>
            </div>
            {error && <p>Error: {error.message}</p>}
            {loading && <p>Loading...</p>}
        </div>
    );
}

export default AddBookPage;
