import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './signup.css'
import {calculateAge, successMessage} from "../utils";
import ErrorPage from "../Errors/ErrorPage";

const SignUpPage = ({setIsAuthenticated}) => {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  let [imagePresent, setImagePresent] = useState(false)
  const mapRef = useRef(null);
  const markerRef = useRef(new L.Marker([0, 0]));
  const image_ref = useRef(null)
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setUserProfile({
            "username": "",
            "password": "",
            "first_name": "",
            "last_name": "",
            "date_of_birth": "",
            "mail": "",
            "phone_number": "",
            "latitude": "",
            "longitude": "",
            "image": ""
        });
      } catch (error) {
        setError(error.message);
      }
    };
    fetchUserProfile()
  }, []);

  useEffect(() => {
    if (userProfile && !mapRef.current) {
      document.getElementById('signup-image').src = 'http://localhost:8000/media/images/users/default.png'
      const newLatLng = L.latLng(50.46446973182625, 30.51927042844712);
      const newIcon = L.icon({
        iconUrl: `http://localhost:8000/media/location-pointer_68545.png`,
        iconSize: [30, 30],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      });

      markerRef.current.setIcon(newIcon);

      const mapElement = document.getElementById('signup-mapid'); // Get the map container element
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
      if(file){
      const reader = new FileReader();
        reader.onload = function(e) {
          const previewImage = document.getElementById('signup-image');
          previewImage.src = e.target.result;
          setImagePresent(true)
        };
        reader.readAsDataURL(file);
        }
      else{
        const previewImage = document.getElementById('signup-image');
               previewImage.src = 'http://localhost:8000/media/images/users/default.png';
               setImagePresent(false)
      }
    } else {
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
    const newErrors = {}
    e.preventDefault();
     if (!validate()) {
      return;
    }
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
      formData.append('date_of_birth', userProfile.date_of_birth);
      formData.append('mail', userProfile.mail);
      formData.append('phone_number', userProfile.phone_number);
      formData.append('latitude', userProfile.latitude);
      formData.append('longitude', userProfile.longitude);

      if (image_ref.current && image_ref.current.files && image_ref.current.files[0]) {
        formData.append('image', image_ref.current.files[0]);
    }
      const response = await axios.post('http://localhost:8000/api/signup/', formData, config);
       const authToken = response.data.token;
            sessionStorage.setItem('token', authToken);
            setIsAuthenticated(true);
            navigate('/catalog');
      successMessage('Profile created successfully!');
      setIsEditing(false);
    } catch (error) {
      if(error.response.data.error === "Username already exists"){
        setErrors({
        ...errors,
        "username": error.response.data.error
      });
      }
      else if(error.response.data.error === "Email already in use"){
        setErrors({
        ...errors,
        "mail": error.response.data.error
      })
      }
    }

  setIsEditing(!isEditing)
  };

  const handleDeleteImage = async (e) => {
    document.getElementById('signup-image').src = 'http://localhost:8000/media/images/users/default.png'
    setImagePresent(false)
    if (image_ref.current) {
      image_ref.current.value = null;
    }
  }

  if (error) {
    return <ErrorPage error={error}></ErrorPage>;
  }

  return (
    <div className="signup-container">
      {userProfile && (
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="mb-4">
              <img id="signup-image" src="" alt="Profile Image" onError={(e) => (e.target.src = "http://localhost:8000/media/images/users/default.png")}/>
              {(imagePresent) &&
                  <button type="button" id='image-delete' onClick={handleDeleteImage}>Delete Image</button>}
              <input
                  type="file"
                  id="image"
                  name="image"
                  className="mt-3"
                  ref={image_ref}
                  onChange={handleInputChange}
              />
            </div>
            <div className="p-2">
              <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  value={userProfile.username}
                  onChange={handleInputChange}
                  placeholder={userProfile.username ? '' : 'Enter your username'}
                 />
            </div>
            {errors.username && <span className="signup-error">{errors.username}</span>}
            <div className="p-2">
              <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  value={userProfile.password}
                  onChange={handleInputChange}
                  placeholder={userProfile.password ? '' : 'Enter your password'}
                />
            </div>
            <div className="p-2">
              <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="form-control"
                  value={userProfile.first_name}
                  onChange={handleInputChange}
                  placeholder={userProfile.first_name ? '' : 'Enter your first name'}
                 />
            </div>
            {errors.first_name && <span className="signup-error">{errors.first_name}</span>}
            <div className="p-2">
              <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="form-control"
                  value={userProfile.last_name}
                  onChange={handleInputChange}
                  placeholder={userProfile.last_name ? '' : 'Enter your last name'}
                 />
            </div>
            {errors.last_name && <span className="signup-error">{errors.last_name}</span>}
            <div className="p-2">
              <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  className="form-control"
                  value={userProfile.date_of_birth}
                  onChange={handleInputChange}
                  placeholder={userProfile.date_of_birth ? '' : 'Enter your date of birth'}
                 />
            </div>
            {errors.date_of_birth && <span className="signup-error">{errors.date_of_birth}</span>}
            <div className="p-2">
              <input
                  type="email"
                  id="mail"
                  name="mail"
                  className="form-control"
                  value={userProfile.mail}
                  onChange={handleInputChange}
                  placeholder={userProfile.mail ? '' : 'Enter your email'}
                  />
            </div>
            {errors.mail && <span className="signup-error">{errors.mail}</span>}
            <div className="p-2">
              <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  className="form-control"
                  value={userProfile.phone_number}
                  onChange={handleInputChange}
                  placeholder={userProfile.phone_number ? '' : 'Enter your phone number'}
                 />
            </div>
            {errors.phone_number && <span className="signup-error">{errors.phone_number}</span>}
            <div id="signup-mapid" style={{height: '200px', width: '100%'}}></div>
            <div className="p-2 mx-auto">
              <button type="submit" className="signup-button">Sign Up</button>
            </div>
          </form>
      )}
    </div>
  );
};

export default SignUpPage;
