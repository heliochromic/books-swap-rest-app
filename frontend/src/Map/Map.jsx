import axios from "axios";
import { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { getConfig } from "../utils";

const Map = () => {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/map/', getConfig())
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    const newIcon = L.icon({
        iconUrl: `http://localhost:8000/media/location-pointer_68545.png`,
        iconSize: [30, 30],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    return (
        <MapContainer center={[50.46446973182625, 30.5192704284471]} zoom={10} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; OpenStreetMap contributors'
            />
            {userData.map(user => (
                user.latitude && user.longitude && (
                    <Marker key={user.userID} position={[user.latitude, user.longitude]} icon={newIcon}>
                        <Popup>
                            <div className="miniature">
                                <img src={`http://localhost:8000${user.image}`}
                                     alt="Profile Image"
                                     onError={(e) => e.target.src = 'http://localhost:8000/media/images/users/default.png'}
                                     className="miniature-image" />
                                <strong className="miniature-username mb-2">
                                    <Link to={`/user/${user.userID}`}>
                                        {user.djuser ? user.djuser.username : 'Unknown User'}
                                    </Link>
                                </strong>
                                <strong className="active-books">
                                    Active Books: {user.active_book_items_count}
                                </strong>
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    );
}

export default Map;
