import React from "react";

const BookItemTiny = ({ book, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="option-container">
      <input
        type="radio"
        className="btn-check"
        name="options-base"
        id={`option${book.itemID}`}
        autoComplete="off"
        value={book.itemID}
        onChange={() => onClick(book.itemID)}
      />
      <label className="btn" htmlFor={`option${book.itemID}`}>
        <div className="itemTiny">
          <div className="imageContainer">
            <img
              src={`http://localhost:8000/${book.photo}`}
              className="itemTinyImg"
              alt="..."
            />
          </div>
          <div className="textContainer mx-3">
            <p className="h4">{book.bookID.name}</p>
            <p className="small">Publish time: {formatDate(book.publish_time)}</p>
          </div>
        </div>
      </label>
    </div>
  );
};

export default BookItemTiny;
