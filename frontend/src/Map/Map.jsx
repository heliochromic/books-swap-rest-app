import axios from "axios";
import { useEffect, useState } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css'

const Map = () => {
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const csrftoken = getCookie('csrftoken');
        const config = {
            headers: {
                'X-CSRFToken': csrftoken,
                'Authorization': `Token ${token}`
            }
        };
        const newIcon = L.icon({
        iconUrl: `http://localhost:8000/media/location-pointer_68545.png`,
        iconSize: [30, 30],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      });
        axios.get('http://localhost:8000/api/map/', config)
            .then(response => {
                const userData = response.data;
                const map = L.map('mapid').setView([50.46446973182625, 30.5192704284471], 10); // Set initial center and zoom level

                // Add tile layer from OpenStreetMap
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(map);

                // Loop through the user data and add markers to the map
                userData.forEach(user => {
                    if (user.latitude && user.longitude) {
                         const marker = L.marker([user.latitude, user.longitude], { icon: newIcon }).addTo(map);
                        // Customize the marker popup content
                        const popupContent = `
                            <div style="display: flex;
                                        flex-direction: column;
                                        align-content: center;
                                        align-items: center"
                                        >
                            <img src="http://localhost:8000${user.image}" 
                            alt="Profile Image" 
                            style="width: 50px; 
                                   height: 50px;
                                   border-radius: 50px;"
                                   >
                                <strong><a href="/user/${user.userID}">${user.djuser ? user.djuser.username : 'Unknown User'}</a></strong>
                                <strong>Active Books:</strong> ${user.active_book_items_count}
                            </div>
                        `;
                        marker.bindPopup(popupContent);
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    return (<div id="mapid"></div>);
}

const getCookie = (name) => {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
};

export default Map;
