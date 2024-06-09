import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import BookItem from '../Catalog/BookItem/BookItem';
import './userProfile.css';
import {errorMessage, getConfig, successMessage} from '../utils';
import {LoadingScreen} from "../Header/LoadingScreen";
import ErrorPage from "../Errors/ErrorPage";

const UserProfile = () => {
    const {id} = useParams();
    const [profileData, setProfileData] = useState(null);
    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/profile/${id}`, getConfig());
                const me = await axios.get(`http://localhost:8000/api/user/`, getConfig());
                setProfileData(response.data);
                setMe(me.data);
                setItems(response.data.book_items);
                setRating(response.data.rating)
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    useEffect(() => {
        if (profileData && me) {
            setIsAdmin(me.djuser.is_superuser && profileData.djuser && profileData.djuser.is_staff);
        }
    }, [profileData, me]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/profile/${profileData.userID}`, getConfig());
            navigate('/catalog');
            successMessage("You deleted " + profileData.first_name + " " + profileData.last_name)
        } catch (err) {
            errorMessage('Error deleting ' + profileData.first_name + " " + profileData.last_name + "'s profile");
        }
    };

    const handleMakeAdmin = async () => {
        try {
            const data = {targetID: profileData.userID};
            await axios.post(`http://localhost:8000/api/admin/make-admin/`, data, getConfig());
            setIsAdmin(true);
            successMessage(profileData.first_name + " " + profileData.last_name + " is admin now!")
        } catch (err) {
            errorMessage('Error giving admin to ' + profileData.first_name + " " + profileData.last_name);
        }
    };

    const handleDeleteAdmin = async () => {
        try {
            const data = {targetID: profileData.userID};
            await axios.post(`http://localhost:8000/api/admin/remove-admin/`, data, getConfig());
            setIsAdmin(false);
            successMessage("You removed admin from " + profileData.first_name + " " + profileData.last_name)
        } catch (err) {
            errorMessage("Error removing admin from" + profileData.first_name + " " + profileData.last_name)
        }
    };

    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {score: rating};
            await axios.put(`http://localhost:8000/api/profile/${id}/rate/`, data, getConfig());
            const response = await axios.get(`http://localhost:8000/api/profile/${id}`, getConfig());
            setProfileData({...profileData,
                                rating: response.data.rating}
            );
            successMessage("Rating submitted successfully!");
        } catch (err) {
            errorMessage("Error submitting rating");
        }
    };

    if (loading) {
        return <LoadingScreen></LoadingScreen>;
    }

    if (error) {
        return <ErrorPage error={error}></ErrorPage>;
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center mt-5">
            {me.djuser.is_staff && (
                <button className="user-delete-button" onClick={handleDelete}>Delete</button>
            )}
            {(me.djuser.is_superuser && isAdmin) &&
                <button className="user-status-lower" onClick={handleDeleteAdmin}>Remove Admin</button>}
            {(me.djuser.is_superuser && !isAdmin) &&
                <button className="user-status-raise" onClick={handleMakeAdmin}>Give Admin</button>
            }
            <img
                src={`http://localhost:8000${profileData.image}`}
                alt="Profile Image"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'http://localhost:8000/media/images/users/default.png';
                }}
                className="profile-image"
            />
            <h2 className="first-last">{profileData.first_name} {profileData.last_name}</h2>
            {profileData.djuser && <p className="username">@{profileData.djuser.username}</p>}
            <div className="user-rating">
                <img src="http://localhost:8000/media/images/utils/star.png" alt="User Rating"/>
                <span>{profileData.rating}</span>
            </div>
            <div className="profile-details">
                {(me.djuser.is_staff && profileData.djuser) && <p>Email: {profileData.djuser.email}</p>}
                {(me.djuser.is_staff && profileData.djuser) && <p>Phone number: {profileData.phone_number}</p>}
                <p>Date of birth: {profileData.date_of_birth}</p>
                <p>Number of books: {items.length}</p>
                {profileData.has_exchanged && (
            <form onSubmit={handleRatingSubmit}>
                    <select value={rating} onChange={(e) => setRating(e.target.value)} required>
                        <option value="">Select Rating</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                <button type="submit">Rate</button>
            </form>
        )}
            </div>
            <div className="catalogContainer">
                {items.map(item => (
                    <BookItem key={item.id} bookItem={item}/>
                ))}
            </div>
        </div>
    );
};

export default UserProfile;
