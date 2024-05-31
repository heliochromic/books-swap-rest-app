import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './profile.css'
import {Link} from "react-router-dom";
import {getConfig} from "../utils";

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const initialProfileRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const mapRef = useRef(null); // Create a ref for the map
  const markerRef = useRef(new L.Marker([51.505, -0.09])); // Create a ref for the marker
  const first_name_ref = useRef(null)
  const last_name_ref = useRef(null)
  const age_ref = useRef(null)
  const phone_number_ref = useRef(null)
  const mail_ref = useRef(null)
  const image_ref = useRef(null)
  let [imagePresent, setImagePresent] = useState(false)



  useEffect(() => {
    const fetchUserProfile = async () => {
      try {

        const response = await axios.get('http://localhost:8000/api/user/', getConfig());
        setUserProfile(response.data);
        setLoading(false);
        if(!initialProfileRef.current){
          initialProfileRef.current = response.data
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile && !mapRef.current) {
      document.getElementById('profile-image').src = 'http://localhost:8000' + userProfile.image
      if(userProfile.image === "/media/images/users/default.png"){
        setImagePresent(false)
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
    }
    else if (userProfile){
      const newLatLng = L.latLng(userProfile.latitude, userProfile.longitude);
      markerRef.current.setLatLng(newLatLng);
    }


  }, [userProfile]);

  useEffect(() => {
    if (mapRef.current) {
      if (isEditing) {
        mapRef.current.on('click', handleMapClick);
      } else {
        mapRef.current.off('click',);
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
        reader.onload = function(e) {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        console.log(image_ref.current.files[0])
      formData.append('image', image_ref.current.files[0]);
    }
      else if (imagePresent){
        formData.append('imageNotUpdated', true)
     }
      await axios.put('http://localhost:8000/api/user/', formData, getConfig());

      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }

  setIsEditing(!isEditing)
  };

  const handleCancelClick = async (e) => {
    setUserProfile(initialProfileRef.current)
     setImagePreview(null);
    setIsEditing(false);
    document.getElementById('profile-image').src = 'http://localhost:8000/' + initialProfileRef.current.image;
  }

  const handleDeleteImage = async (e) => {
    document.getElementById('profile-image').src = 'http://localhost:8000/media/images/users/default.png'
    setImagePresent(false)
    if (image_ref.current) {
      image_ref.current = null;
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
      <h1>@{userProfile.djuser.username}</h1>
      {userProfile && (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-input-group">
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
            <div className='profile-input-group'>
              <label htmlFor="first_name">First Name:</label>
              <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="profile-first-name"
                  ref={first_name_ref}
                  value={userProfile.first_name}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
              />
            </div>
            <div className='profile-input-group'>
              <label htmlFor="last_name">Last Name:</label>
              <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="profile-last-name"
                  value={userProfile.last_name}
                  ref={last_name_ref}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
              />
            </div>
            <div className='profile-input-group'>
              <label htmlFor="age">Age:</label>
              <input
                  type="number"
                  id="age"
                  name="age"
                  className="profile-age"
                  ref={age_ref}
                  value={userProfile.age}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
              />
            </div>
            <div className='profile-input-group'>
              <label htmlFor="mail">Email:</label>
              <input
                  type="email"
                  id="mail"
                  name="mail"
                  className="profile-mail"
                  ref={mail_ref}
                  value={userProfile.mail}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
              />
            </div>
            <div className='profile-input-group'>
              <label htmlFor="phone_number">Phone Number:</label>
              <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  className="profile-phone-number"
                  ref={phone_number_ref}
                  value={userProfile.phone_number}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
              />
            </div>
            <div id="profile-mapid" style={{height: '200px', width: '100%'}}></div>
            <div className="profile-button-container">
              {isEditing ? (
                  <button type="button" className="cancel-button" onClick={handleCancelClick}>Cancel</button>
              ) : (
                  <button type="button" className="edit-button" onClick={() => setIsEditing(true)}>Edit Profile</button>
              )}
              {isEditing && <button type="submit" className="save-button">Save Changes</button>}
            </div>
            <div className="password-reset-link">
              <Link to="/password-change">Change password</Link>
            </div>
          </form>

      )}
    </div>
  );
};
export default Profile;
