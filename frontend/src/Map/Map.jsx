import axios from "axios";
import { useEffect, useState } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css'
import {getConfig} from "../utils";

const Map = () => {
    useEffect(() => {
        const newIcon = L.icon({
        iconUrl: `http://localhost:8000/media/location-pointer_68545.png`,
        iconSize: [30, 30],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      });
        axios.get('http://localhost:8000/api/map/', getConfig())
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
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
    <img src="http://localhost:8000${user.image}" 
         alt="Profile Image" 
         onerror="this.onerror=null;this.src='http://localhost:8000/media/images/users/default.png';"
         style="width: 50px; 
                height: 50px;
                border-radius: 50%;">
    <strong style="font-size: 1.2em; padding: 2px 5px; border-radius: 5px;">
        <a href="/user/${user.userID}" style="text-decoration: none; color: inherit;">
            ${user.djuser ? user.djuser.username : 'Unknown User'}
        </a>
    </strong>
    <strong style="background-color: lightblue; padding: 2px 5px; border-radius: 5px;">
        Active Books: ${user.active_book_items_count}
    </strong>
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

    return (
        <div id="mapid"></div>
    );
}

export default Map;
