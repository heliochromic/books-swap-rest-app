import React from 'react';
import PropTypes from 'prop-types';
import './AddBookPage.css';

const ImagePreview = ({ preview, index, onDelete }) => {
    return (
        <div className="image-crop" key={index}>
            <span
                className="image-preview"
                style={{
                    backgroundImage: `url(${preview})`,
                }}
            />
            <button className="delete-button" onClick={() => onDelete(index)}>×</button>
        </div>
    );
};

ImagePreview.propTypes = {
    preview: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default ImagePreview;
