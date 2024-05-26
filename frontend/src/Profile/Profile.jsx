import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css'

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



  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const csrftoken = getCookie('csrftoken');
        const config = {
          headers: {
            'X-CSRFToken': csrftoken,
            'Authorization': `Token ${token}`
          }
        };
        const response = await axios.get('http://localhost:8000/api/user/', config);
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
      document.getElementById('profile-image').src = 'http://localhost:8000/' + userProfile.image
      const newLatLng = L.latLng(userProfile.latitude, userProfile.longitude);
      const newIcon = L.icon({
        iconUrl: `http://localhost:8000/media/location-pointer_68545.png`,
        iconSize: [30, 30],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      });

      markerRef.current.setIcon(newIcon);

      const mapElement = document.getElementById('mapid'); // Get the map container element
      const newMap = L.map(mapElement).setView([userProfile.latitude, userProfile.longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(newMap);

      markerRef.current.addTo(newMap);
      mapRef.current = newMap; // Store map instance in ref
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
    setIsEditing(!isEditing)
    try {
      const token = sessionStorage.getItem('token');
      const csrftoken = getCookie('csrftoken');
      const config = {
        headers: {
          'X-CSRFToken': csrftoken,
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      };
      await axios.put('http://localhost:8000/api/user/', userProfile, config);

      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };

  const handleCancelClick = async (e) => {
    setUserProfile(initialProfileRef.current)
     setImagePreview(null);
    setIsEditing(false);
    document.getElementById('profile-image').src = 'http://localhost:8000/' + initialProfileRef.current.image;
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
              {isEditing && <input
                  type="file"
                  id="image"
                  name="image"
                  ref={image_ref}
                  // value={userProfile.image}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
              />}
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
                  readOnly={!isEditing}
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
                  readOnly={!isEditing}
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
                  readOnly={!isEditing}
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
                  readOnly={!isEditing}
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
                  readOnly={!isEditing}
              />
            </div>
            <div id="mapid" style={{height: '200px', width: '100%'}}></div>
            <div className="button-container">
              {isEditing ? (
                  <button type="button" onClick={handleCancelClick}>Cancel</button>
              ) : (
                  <button type="button" onClick={() => setIsEditing(true)}>Edit Profile</button>
              )}
              {isEditing && <button type="submit">Save Changes</button>}
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

export default Profile;
