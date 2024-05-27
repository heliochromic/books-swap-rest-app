import {useEffect} from "react";
import "./AddBookPage.css"

const AddBookPage = () => {
    const addBook = async (e) => {
        e.preventDefault()


    }

    const checkISBN = async (e) => {

    }

    useEffect(() => {

    }, []);

    return (
        <div id="addBook">
            <form>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Username" aria-label="Username"
                           aria-describedby="basic-addon1"/>
                </div>
            </form>
        </div>
    )
}

export default AddBookPage;