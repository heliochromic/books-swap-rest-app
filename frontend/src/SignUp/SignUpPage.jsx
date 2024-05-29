import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './signup.css'

const SignUpPage = ({setIsAuthenticated}) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
            "age": "",
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
      document.getElementById('signup-image').src = 'http://localhost:8000/media/images/users/default.png'
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
          const previewImage = document.getElementById('signup-image');
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
        formData.append('image', image_ref.current.files[0]);
    }
      const response = await axios.post('http://localhost:8000/api/signup/', formData, config);
       const authToken = response.data.token;
            sessionStorage.setItem('token', authToken);
            setIsAuthenticated(true);
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
    document.getElementById('signup-image').src = 'http://localhost:8000/media/images/users/default.png'
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
    <div className="signup-container">
      <h1>Sign Up</h1>
      {userProfile && (
          <form className="signup-form" onSubmit={handleSubmit}>
            <div>
              <img id="signup-image" src="" alt="Profile Image"/>
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
                  className="input-username"
                  value={userProfile.username}
                  onChange={handleInputChange}
                  placeholder={userProfile.username ? '' : 'Enter your username'}
                  onFocus={(e) => e.target.placeholder = ''}
                  onBlur={(e) => e.target.placeholder = userProfile.username ? '' : 'Enter your username'}
              />
            </div>
            <div>
              <input
                  type="password"
                  id="password"
                  name="password"
                  className="input-password"
                  value={userProfile.password}
                  onChange={handleInputChange}
                  placeholder={userProfile.password ? '' : 'Enter your password'}
                  onFocus={(e) => e.target.placeholder = ''}
                  onBlur={(e) => e.target.placeholder = userProfile.password ? '' : 'Enter your password'}
              />
            </div>
            <div>
              <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="input-first-name"
                  value={userProfile.first_name}
                  onChange={handleInputChange}
                  placeholder={userProfile.first_name ? '' : 'Enter your first name'}
                  onFocus={(e) => e.target.placeholder = ''}
                  onBlur={(e) => e.target.placeholder = userProfile.first_name ? '' : 'Enter your first name'}
              />
            </div>
            <div>
              <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="input-last-name"
                  value={userProfile.last_name}
                  onChange={handleInputChange}
                  placeholder={userProfile.last_name ? '' : 'Enter your last name'}
                  onFocus={(e) => e.target.placeholder = ''}
                  onBlur={(e) => e.target.placeholder = userProfile.last_name ? '' : 'Enter your last name'}
              />
            </div>
            <div>
              <input
                  type="text"
                  id="age"
                  name="age"
                  className="input-age"
                  value={userProfile.age}
                  onChange={handleInputChange}
                  placeholder={userProfile.age ? '' : 'Enter your age'}
                  onFocus={(e) => e.target.placeholder = ''}
                  onBlur={(e) => e.target.placeholder = userProfile.age ? '' : 'Enter your age'}
              />
            </div>
            <div>
              <input
                  type="email"
                  id="mail"
                  name="mail"
                  className="input-email"
                  value={userProfile.mail}
                  onChange={handleInputChange}
                  placeholder={userProfile.email ? '' : 'Enter your email'}
                  onFocus={(e) => e.target.placeholder = ''}
                  onBlur={(e) => e.target.placeholder = userProfile.email ? '' : 'Enter your email'}
              />
            </div>
            <div>
              <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  className="input-phone-number"
                  value={userProfile.phone_number}
                  onChange={handleInputChange}
                  placeholder={userProfile.phone_number ? '' : 'Enter your phone number'}
                  onFocus={(e) => e.target.placeholder = ''}
                  onBlur={(e) => e.target.placeholder = userProfile.phone_number ? '' : 'Enter your phone number'}
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

export default SignUpPage;
