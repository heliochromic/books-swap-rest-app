import React, {useEffect, useState, useRef} from "react";
import axios from "axios";
import "./AddBookPage.css";
import ImagePreview from './ImagePreview';
import {fetchBook} from "../utils";

const AddBookPage = () => {
    const [isbn, setIsbn] = useState('');
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        title: '',
        author: '',
        genre: '',
        language: '',
        pages: '',
        year: '',
        description: '',
        status: ''
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isbn.length === 10 || isbn.length === 13) {
            checkISBN().then(r => console.log(r));
        }
    }, [isbn]);

    const checkISBN = async () => {
        setLoading(true);
        try {
            const response = await fetchBook(isbn);
            if (response) {
                setBook(response);
                setFormValues({
                    title: response.title,
                    author: response.authors ? response.authors.join(', ') : '',
                    genre: response.categories ? response.categories.join(', ') : '',
                    language: response.language,
                    pages: response.pageCount,
                    year: response.publishedDate ? response.publishedDate.split('-')[0] : '',
                    description: response.description,
                    status: ''
                });
            } else {
                alert("Unable to fetch book data, please fill in the data manually");
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleIsbnChange = (e) => {
        const filteredIsbn = e.target.value.replace(/\D/g, '');
        setIsbn(filteredIsbn);
    };

    const handleInputChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            alert('You can only upload a maximum of 3 files');
            return;
        }
        const filesWithPreviews = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setSelectedFiles(filesWithPreviews);
    };

    const handleDeleteFile = (index) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('isbn', isbn);
        formData.append('title', formValues.title);
        formData.append('author', formValues.author);
        formData.append('genre', formValues.genre);
        formData.append('language', formValues.language);
        formData.append('pages', formValues.pages);
        formData.append('year', formValues.year);
        formData.append('description', formValues.description);
        formData.append('status', formValues.status)

        selectedFiles.forEach((selectedFile, index) => {
            formData.append(`file${index + 1}`, selectedFile.file);
        });

        try {
            const token = sessionStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            const response = await axios.post('http://localhost:8000/api/catalog/', formData, config);

            alert('Book added successfully!');
            console.log(response.data)
            window.location.href = `/catalog/${response.data.itemID}`;
        } catch (err) {
            setError(err);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div id="addBook">
            <form onSubmit={handleSubmit}>
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
                            onChange={handleIsbnChange}
                        />
                    </div>
                </div>
                <div className="book-details mb-4">
                    <div className="row g-3">
                        <div className="mb-3 col-md-6">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input required
                                   type="text"
                                   className="form-control"
                                   placeholder="Title"
                                   id="title"
                                   name="title"
                                   value={formValues.title}
                                   onChange={handleInputChange}/>
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="author" className="form-label">Author</label>
                            <input required
                                   type="text"
                                   className="form-control"
                                   placeholder="Author"
                                   id="author"
                                   name="author"
                                   value={formValues.author}
                                   onChange={handleInputChange}/>
                        </div>
                        <div className="mb-3 col-md-3">
                            <label htmlFor="genre" className="form-label">Genre</label>
                            <input required
                                   type="text"
                                   className="form-control"
                                   placeholder="Genre"
                                   id="genre"
                                   name="genre"
                                   value={formValues.genre}
                                   onChange={handleInputChange}/>
                        </div>
                        <div className="mb-3 col-md-3">
                            <label htmlFor="language" className="form-label">Language</label>
                            <input required
                                   type="text"
                                   className="form-control"
                                   placeholder="Language"
                                   id="language"
                                   name="language"
                                   value={formValues.language}
                                   onChange={handleInputChange}/>
                        </div>
                        <div className="mb-3 col-md-3">
                            <label htmlFor="pages" className="form-label">Pages</label>
                            <input required
                                   type="number"
                                   className="form-control"
                                   placeholder="Pages"
                                   id="pages"
                                   name="pages"
                                   value={formValues.pages}
                                   onChange={handleInputChange}/>
                        </div>
                        <div className="mb-3 col-md-3">
                            <label htmlFor="year" className="form-label">Year</label>
                            <input required
                                   type="text"
                                   className="form-control"
                                   placeholder="Year"
                                   id="year"
                                   name="year"
                                   value={formValues.year}
                                   onChange={handleInputChange}/>
                        </div>
                        <div className="mb-3 col-md-6">
                            <label className="form-label">
                                Upload Files <small>(1-3 needed)</small>
                            </label>
                            <button type="button" className="btn btn-secondary uploadButton" onClick={triggerFileInput}>
                                Choose Files
                            </button>
                            <input
                                required
                                type="file"
                                className="form-control d-none"
                                ref={fileInputRef}
                                multiple
                                onChange={handleFileChange}
                                accept=".jpg,.jpeg,.png"
                            />
                        </div>
                        <div className="mb-3 col-md-6">
                            <div className="mb-3 col-md-6">
                                <select
                                    className="form-select"
                                    id="status"
                                    name="status"
                                    value={formValues.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Condition: A (Best) - E (Worst)
                                    </option>
                                    <option value="A">A - Best</option>
                                    <option value="B">B - Good</option>
                                    <option value="C">C - Fair</option>
                                    <option value="D">D - Poor</option>
                                    <option value="E">E - Worst</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-3 col-md-12">
                            {selectedFiles.length > 0 && (
                                <div className="mt-2">
                                    {selectedFiles.map((selectedFile, index) => (
                                        <ImagePreview
                                            key={index}
                                            preview={selectedFile.preview}
                                            index={index}
                                            onDelete={handleDeleteFile}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mb-3 col-md-12">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                className="form-control no-resize"
                                id="description"
                                name="description"
                                placeholder="Description"
                                rows="8"
                                maxLength="500"
                                value={formValues.description}
                                onChange={handleInputChange}
                                required></textarea>
                        </div>
                        <div className="mb-4 col-md-6">
                            <button type="submit" className="btn btn-primary">Add Book</button>
                        </div>
                    </div>
                </div>
            </form>
            {error && <p className="mt-3 text-danger">Error: {error.message}</p>}
            {loading && <p className="mt-3 text-info">Loading...</p>}
        </div>
    );
}

export default AddBookPage;
