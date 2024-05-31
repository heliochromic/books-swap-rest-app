import axios from "axios";

export const getCookie = (name) => {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
};

export const getConfig = () => {
    const token = sessionStorage.getItem('token');
    const csrftoken = getCookie('csrftoken');
    return {
        headers: {
            'X-CSRFToken': csrftoken,
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    };
}

export const truncateDescription = (description, maxLength) => {
    if (description.length <= maxLength) {
        return description;
    }
    return description.substring(0, maxLength) + '...';
};


export const cleanIsbn = (isbn) => {
    return isbn.replace(/\D/g, '');
}

export const isValidIsbn = (isbn) => {
    const cleanedIsbn = cleanIsbn(isbn);
    const isbnPattern = /^(?:\d{10}|\d{13})$/;
    return isbnPattern.test(cleanedIsbn);
}

export const fetchBook = async (isbn) => {
    const url = "https://www.googleapis.com/books/v1/volumes";
    const params = {
        q: `isbn:${isbn}`
    };

    try {
        const response = await axios.get(url, {params});
        if (response.status === 200) {
            const data = response.data;
            const items = data.items;
            if (items) {
                return items[0].volumeInfo;
            }
            return items;
        }
    } catch (error) {
        console.error('Error fetching book:', error);
    }

    return null;
}