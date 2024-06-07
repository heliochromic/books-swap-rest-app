import axios from "axios";
import {Bounce, toast} from "react-toastify";

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

export const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const cleanIsbn = (isbn) => {
    return isbn.replace(/\D/g, '');
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

export const successMessage = (text) => {
    toast.success(text, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
}

export const errorMessage = (text) => {
    toast.error(text, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
}