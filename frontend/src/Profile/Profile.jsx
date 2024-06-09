import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './profile.css';
import {Link, useNavigate} from "react-router-dom";
import {calculateAge, errorMessage, getConfig, successMessage} from "../utils";
import BookItem from "../Catalog/BookItem/BookItem";
import {LoadingScreen} from "../Header/LoadingScreen";
import ErrorPage from "../Errors/ErrorPage";

const Profile = ({ setIsAuthenticated }) => {
  const [userProfile, setUserProfile] = useState(null);
  const initialProfileRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});
  const mapRef = useRef(null);
  const markerRef = useRef(new L.Marker([51.505, -0.09]));
  const first_name_ref = useRef(null);
  const last_name_ref = useRef(null);
  const date_of_birth_ref = useRef(null);
  const phone_number_ref = useRef(null);
  const mail_ref = useRef(null);
  const image_ref = useRef(null);
  let [imagePresent, setImagePresent] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/', getConfig());
        setUserProfile(response.data);
        setLoading(false);
        if (!initialProfileRef.current) {
          initialProfileRef.current = response.data;
        }
        const books = await axios.get(`http://localhost:8000/api/profile/${response.data.userID}`, getConfig());
        setItems(books.data.book_items);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile && !mapRef.current) {
      document.getElementById('profile-image').src = 'http://localhost:8000' + userProfile.image;
      if (userProfile.image === "/media/images/users/default.png") {
        setImagePresent(false);
      }
      const newLatLng = L.latLng(userProfile.latitude, userProfile.longitude);
      const newIcon = L.icon({
        iconUrl: `http://localhost:8000/media/location-pointer_68545.png`,
        iconSize: [30, 30],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      });

      markerRef.current.setIcon(newIcon);

      const mapElement = document.getElementById('profile-mapid');
      const newMap = L.map(mapElement).setView([userProfile.latitude, userProfile.longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(newMap);

      markerRef.current.addTo(newMap);
      mapRef.current = newMap;
      markerRef.current.setLatLng(newLatLng);
    } else if (userProfile) {
      const newLatLng = L.latLng(userProfile.latitude, userProfile.longitude);
      markerRef.current.setLatLng(newLatLng);
    }
  }, [userProfile]);

  useEffect(() => {
    if (mapRef.current) {
      if (isEditing) {
        mapRef.current.on('click', handleMapClick);
      } else {
        mapRef.current.off('click', handleMapClick);
      }
    }
  }, [isEditing]);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
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
        setImagePresent(true);
      };
      reader.readAsDataURL(file);
    } else {
      console.log(userProfile)
      setUserProfile({
        ...userProfile,
        [e.target.name]: e.target.value
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!userProfile.first_name) {
      newErrors.first_name = 'First name is required';
    }

    if(userProfile.first_name.trim().length > 50){
      newErrors.first_name = 'First name has to be smaller than 50 characters';
    }

    if (!userProfile.last_name) {
      newErrors.last_name = 'Last name is required';
    }

    if(userProfile.last_name.trim().length > 50){
      newErrors.last_name = 'Last name has to be smaller than 50 characters';
    }

    const age = calculateAge(userProfile.date_of_birth);
    if (!userProfile.date_of_birth || isNaN(age) || age <= 12 || age > 120) {
      newErrors.date_of_birth = 'Please enter a valid age between 12 and 120';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userProfile.mail || !emailRegex.test(userProfile.mail)) {
      newErrors.mail = 'Please enter a valid email address';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!userProfile.phone_number || !phoneRegex.test(userProfile.phone_number)) {
      newErrors.phone_number = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('first_name', userProfile.first_name);
      formData.append('last_name', userProfile.last_name);
      formData.append('age', userProfile.age);
      formData.append('mail', userProfile.mail);
      formData.append('phone_number', userProfile.phone_number);
      formData.append('latitude', userProfile.latitude);
      formData.append('longitude', userProfile.longitude);

      if (image_ref.current && image_ref.current.files && image_ref.current.files[0]) {
        formData.append('image', image_ref.current.files[0]);
      } else if (imagePresent) {
        formData.append('imageNotUpdated', true);
      }

      await axios.put('http://localhost:8000/api/user/', formData, getConfig());
      setIsEditing(false);
      successMessage("Profile update successful!")
    } catch (error) {
      errorMessage("An updating profile")
    }

    setIsEditing(!isEditing);
  };

  const handleCancelClick = async (e) => {
    setUserProfile(initialProfileRef.current);
    setIsEditing(false);
    setErrors({});
    document.getElementById('profile-image').src = 'http://localhost:8000/' + initialProfileRef.current.image;
  };

  const handleDeleteImage = async (e) => {
    document.getElementById('profile-image').src = 'http://localhost:8000/media/images/users/default.png';
    setImagePresent(false);
    if (image_ref.current) {
      image_ref.current.value = null;
    }
  };

  const handleUserDeletion = async () =>{
    try{
      await axios.delete("http://localhost:8000/api/user/", getConfig())
      setIsAuthenticated(false);
      navigate('/')
    }catch (error) {
      alert('Failed to delete profile. Please try again.');
      console.error('Error deleting profile:', error);
    }
  }

  if (loading) {
    return <LoadingScreen></LoadingScreen>;
  }

  if (error) {
    return  <ErrorPage error={error} />;
  }

  return (
      <div className="full-profile">
      <div className="profile-container">
          {userProfile && (
              <form className="profile-form rounded-5" onSubmit={handleSubmit}>
                <h1>@{userProfile.djuser.username}</h1>
                <div className="">
                  <img id="profile-image" src="" alt="Profile Image"/>
                  {(imagePresent && isEditing) &&
                      <button type="button" id='image-delete' onClick={handleDeleteImage}>Delete Image</button>}
                  {isEditing && <input
                      type="file"
                      id="image"
                      name="image"
                      ref={image_ref}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                  />}
                </div>
                <div className="user-rating">
                  <img src="http://localhost:8000/media/images/utils/star.png" alt="User Rating"/>
                  <span>{userProfile.rating}</span>
                </div>
                <div className='profile-input-group'>
                  <label htmlFor="first_name">First Name:</label>
                  <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      className="form-control profile-form-control"
                      ref={first_name_ref}
                      value={userProfile.first_name}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                  />
                </div>
                {errors.first_name && <span className="error">{errors.first_name}</span>}
                <div className='profile-input-group'>
                  <label htmlFor="last_name">Last Name:</label>
                  <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      className="form-control profile-form-control"
                      value={userProfile.last_name}
                      ref={last_name_ref}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                  />
                </div>
                {errors.last_name && <span className="error">{errors.last_name}</span>}
                <div className='profile-input-group'>
                  <label htmlFor="date_of_birth">Date of birth:</label>
                  <input
                      type="date"
                      id="date_of_birth"
                      name="date_of_birth"
                      className="form-control profile-form-control"
                      ref={date_of_birth_ref}
                      value={userProfile.date_of_birth}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                  />
                </div>
                {errors.date_of_birth && <span className="error">{errors.date_of_birth}</span>}
                <div className='profile-input-group'>
                  <label htmlFor="mail">Email:</label>
                  <input
                      type="email"
                      id="mail"
                      name="mail"
                      className="form-control profile-form-control"
                      ref={mail_ref}
                      value={userProfile.mail}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                  />
                </div>
                {errors.mail && <span className="error">{errors.mail}</span>}
                <div className='profile-input-group'>
                  <label htmlFor="phone_number">Phone Number:</label>
                  <input
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      className="form-control profile-form-control"
                      ref={phone_number_ref}
                      value={userProfile.phone_number}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                  />
                </div>
                {errors.phone_number && <span className="error">{errors.phone_number}</span>}
                <div id="profile-mapid" style={{height: '200px', width: '100%'}}></div>
                <div className="profile-button-container">
                  {isEditing ? (
                      <button type="button" className="cancel-button" onClick={handleCancelClick}>Cancel</button>
                  ) : (
                      <button type="button" className="edit-button" onClick={() => setIsEditing(true)}>Edit
                        Profile</button>
                  )}
                  {isEditing && <button type="submit" className="save-button">Save Changes</button>}
                </div>
                <div className="password-reset-link">
                  <Link to="/password-change">Change password</Link>
                </div>
              </form>
          )}
        <button className="user-delete" onClick={handleUserDeletion}>Delete account</button>
      </div>
        <div className="my-books">
          <h1>MY BOOKS</h1>
          <div className="catalogContainer">
            {items.map(item => (
                <BookItem key={+item.id} bookItem={item}/>
            ))}
          </div>
        </div>
      </div>
  );
};
export default Profile;
