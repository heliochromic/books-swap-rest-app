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
