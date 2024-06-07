import React, {useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import {getConfig} from "../utils";

const Map = () => {
    useEffect(() => {
        const newIcon = new L.icon({
            iconUrl: `http://localhost:8000/media/location-pointer_68545.png`,
            iconSize: [30, 30],
            iconAnchor: [19, 38],
            popupAnchor: [0, -38],
        });

        axios
            .get("http://localhost:8000/api/map/", getConfig())
            .then((response) => {
                const userData = response.data;
                const map = L.map("mapid").setView(
                    [50.46446973182625, 30.5192704284471],
                    10
                );

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "&copy; OpenStreetMap contributors",
                }).addTo(map);

                userData.forEach((user) => {
                    if (user.latitude && user.longitude) {
                        const marker = L.marker(
                            [user.latitude, user.longitude],
                            {icon: newIcon}
                        ).addTo(map);

                        const popupContent = (
                            <div className="miniature">
                                <img
                                    src={`http://localhost:8000${user.image}`}
                                    alt="Profile Image"
                                    onError={(e) =>
                                        (e.target.src =
                                            "http://localhost:8000/media/images/users/default.png")
                                    }
                                    className="miniature-image"
                                />
                                <strong className="miniature-username mb-2">
                                    <Link to={`http://localhost:3000/user/${user.userID}`}>
                                        {user.djuser ? user.djuser.username : "Unknown User"}
                                    </Link>
                                </strong>
                                <strong className="active-books">
                                    Active Books: {user.active_book_items_count}
                                </strong>
                            </div>
                        );

                        marker.bindPopup(popupContent);
                    }
                });
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, []);

    return <div id="mapid"></div>;
};

export default Map;
