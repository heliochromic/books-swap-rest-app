import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css'

const SignUpPage = ({setIsAuthenticated}) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const mapRef = useRef(null); // Create a ref for the map
    const markerRef = useRef(new L.Marker([51.505, -0.09]));
    const username_ref = useRef(null);
    const password_ref = useRef();// Create a ref for the marker
    const first_name_ref = useRef(null)
    const last_name_ref = useRef(null)
    const age_ref = useRef(null)
    const phone_number_ref = useRef(null)
    const mail_ref = useRef(null)
    const image_ref = useRef(null)
    let [imagePresent, setImagePresent] = useState(false)
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setUserProfile({
                    "username": "",
                    "password": "",
                    "first_name": "",
                    "last_name": "",
                    "age": 0,
                    "mail": "",
                    "phone_number": "",
                    "latitude": "",
                    "longitude": "",
                    "image": ""
                });
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchUserProfile()
    }, []);

    useEffect(() => {
        if (userProfile && !mapRef.current) {
            document.getElementById('profile-image').src = 'http://localhost:8000/media/images/users/default.png'
            const newLatLng = L.latLng(50.46446973182625, 30.51927042844712);
            const newIcon = L.icon({
                iconUrl: `http://localhost:8000/media/location-pointer_68545.png`,
                iconSize: [30, 30],
                iconAnchor: [19, 38],
                popupAnchor: [0, -38]
            });

            markerRef.current.setIcon(newIcon);

            const mapElement = document.getElementById('mapid'); // Get the map container element
            const newMap = L.map(mapElement).setView([50.46446973182625, 30.51927042844712], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(newMap);
            newMap.on('click', handleMapClick)
            markerRef.current.addTo(newMap);
            mapRef.current = newMap; // Store map instance in ref
            markerRef.current.setLatLng(newLatLng);
        }

    }, [userProfile]);

    const handleMapClick = (e) => {
        const {lat, lng} = e.latlng;
        markerRef.current.setLatLng([lat, lng]);
        setUserProfile(prevState => ({
            ...prevState,
            latitude: lat,
            longitude: lng
        }));
    };

    const handleInputChange = (e) => {
        if (e.target.name === 'image') {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const previewImage = document.getElementById('profile-image');
                previewImage.src = e.target.result;
                setImagePresent(true)
            };
            reader.readAsDataURL(file);
        } else {
            setUserProfile({
                ...userProfile,
                [e.target.name]: e.target.value
            });
        }
        console.log(JSON.stringify(userProfile))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            const formData = new FormData();
            formData.append('username', userProfile.username);
            formData.append('password', userProfile.password);
            formData.append('first_name', userProfile.first_name);
            formData.append('last_name', userProfile.last_name);
            formData.append('age', userProfile.age);
            formData.append('mail', userProfile.mail);
            formData.append('phone_number', userProfile.phone_number);
            formData.append('latitude', userProfile.latitude);
            formData.append('longitude', userProfile.longitude);

            if (image_ref.current && image_ref.current.files && image_ref.current.files[0]) {
                console.log(image_ref.current.files[0])
                formData.append('image', image_ref.current.files[0]);
            }
            const response = await axios.post('http://localhost:8000/api/signup/', formData, config);
            const authToken = response.data.token;
            sessionStorage.setItem('token', authToken);
            setIsAuthenticated(true); // Update authentication state
            navigate('/catalog');
            alert('Profile created successfully!');
            setIsEditing(false);

        } catch (error) {
            alert('Failed to create profile. Please try again.');
            console.error('Error creating profile:', error);
        }

        setIsEditing(!isEditing)
    };

    const handleDeleteImage = async (e) => {
        document.getElementById('profile-image').src = 'http://localhost:8000/media/images/users/default.png'
        setImagePresent(false)
        if (image_ref.current) {
            image_ref.current.value = null;
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            {userProfile && (
                <form className="profile-form" onSubmit={handleSubmit}>
                    <div>
                        <img id="profile-image" src="" alt="Profile Image"/>
                        {(imagePresent) &&
                            <button type="button" id='image-delete' onClick={handleDeleteImage}>Delete Image</button>}
                        <input
                            type="file"
                            id="image"
                            name="image"
                            ref={image_ref}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            ref={username_ref}
                            value={userProfile.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            ref={password_ref}
                            value={userProfile.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="first_name">First Name:</label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            ref={first_name_ref}
                            value={userProfile.first_name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="last_name">Last Name:</label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={userProfile.last_name}
                            ref={last_name_ref}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="age">Age:</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            ref={age_ref}
                            value={userProfile.age}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="mail">Email:</label>
                        <input
                            type="email"
                            id="mail"
                            name="mail"
                            ref={mail_ref}
                            value={userProfile.mail}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="phone_number">Phone Number:</label>
                        <input
                            type="text"
                            id="phone_number"
                            name="phone_number"
                            ref={phone_number_ref}
                            value={userProfile.phone_number}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div id="mapid" style={{height: '200px', width: '100%'}}></div>
                    <div className="button-container">
                        <button type="submit">Sign Up</button>
                    </div>
                </form>
            )}
        </div>
    );
};

const getCookie = (name) => {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
};

export default SignUpPage;
