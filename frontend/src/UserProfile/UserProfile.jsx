import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import L from 'leaflet';
import BookItem from "../Catalog/BookItem/BookItem";
import './userProfile.css';
import {getConfig} from "../utils";

const UserProfile = () => {
    const {id} = useParams();
    const [profileData, setProfileData] = useState(null);
    const [me, setMe] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]);
    const navigate = useNavigate()


    useEffect(() => {
        const fetchProfile = async () => {
            try {

                const config = getConfig();
                const response = await axios.get(`http://localhost:8000/api/profile/${id}`, config);
                const me = await axios.get(`http://localhost:8000/api/user/`, getConfig())

                setProfileData(response.data);
                setMe(me.data)

                setItems(response.data.book_items);
                setLoading(false);

            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/profile/${profileData.userID}`, getConfig());

            navigate('/catalog')
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching profile</div>;
    }

    return (
        <div className="profile-container">
            {me.djuser.is_staff && (
                <button className="delete-button" onClick={handleDelete}>Delete</button>
            )}
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
            <p className="username">@{profileData.djuser.username}</p>
            <div className="profile-details">
                <p>Email: {profileData.djuser.email}</p>
                <p>Phone number: {profileData.phone_number}</p>
                <p>Age: {profileData.age}</p>
            </div>
            <div className="bookContainer" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                {items.map(item => (
                    <BookItem key={item.id} bookItem={item}/>
                ))}
            </div>
        </div>

    );
};
export default UserProfile;
