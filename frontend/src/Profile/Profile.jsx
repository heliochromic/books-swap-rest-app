import React, { useState, useEffect } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [map, setMap] = useState(null);
  var marker = new L.Marker([51.505, -0.09]);

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
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  fetchUserProfile();
}, []);

useEffect(() => {
  if (userProfile && !mapInitialized) {
    const newLatLng = L.latLng(userProfile.latitude, userProfile.longitude);
    console.log(newLatLng)// Replace newLatitude and newLongitude with your new coordinates
    marker.setLatLng(newLatLng);
    const newMap = L.map('mapid').setView([marker.getLatLng().lat, marker.getLatLng().lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(newMap);
    newMap.on('click', handleMapClick);
    setMap(newMap);
    setMapInitialized(true);
    marker.addTo(newMap);
  }
}, [userProfile, mapInitialized]);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
    setUserProfile(prevState => ({
      ...prevState,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleInputChange = (e) => {
    setUserProfile({
      ...userProfile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (error) {
      alert('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div style={{"display": "flex", "justify-content": "center", "align-items": "center", "flexDirection": "column" }}>
      <h1>User Profile</h1>
      {userProfile && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="first_name">First Name:</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
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
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
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
              value={userProfile.phone_number}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="rating">Rating:</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={userProfile.rating}
              onChange={handleInputChange}
            />
          </div>
          <div id="mapid" style={{ height: '200px', width: '100%' }}></div>
          <button type="submit">Save Changes</button>
        </form>
      )}
    </div>
  );
};

const getCookie = (name) => {
  const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return cookieValue ? cookieValue.pop() : '';
};

export default Profile;
