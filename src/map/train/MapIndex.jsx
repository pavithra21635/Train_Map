// src/map/train/MapIndex.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from '../train/train-pin.png';
import govlog from '../train/logo2.png';
import './MapIndex.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

const center = [7.688843, 80.665844];

const MapIndex = () => {
  const [trainData, setTrainData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchTrainData();

    const intervalId = setInterval(fetchTrainData, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [navigate]);

  const fetchTrainData = () => {
    fetch('${process.env.REACT_APP_API_BASE_URL}/train-location/', {
  
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
    },
  })
      .then(response => response.json())
      .then(data => {
        const organizedData = data.reduce((acc, curr) => {
          if (!acc[curr.trainId]) {
            acc[curr.trainId] = [];
          }
          acc[curr.trainId].push(curr);
          return acc;
        }, {});

        setTrainData(organizedData);
      })
      .catch(error => {
        console.error('Error fetching train data:', error);
      });
  };

  const customIcon = L.icon({
    iconUrl: markerIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  });

  return (
    <div className="map-wrapper">
      <div className="map-header">
        <img src={govlog} alt="Government Logo" className="government-logo" />
        <h3>DEPARTMENT OF RAILWAYS SRI LANKA</h3>
      </div>
      <MapContainer
        center={center}
        zoom={5}
        minZoom={7.5}
        maxZoom={8}
        style={{ width: "100vw", height: "calc(100vh - 10px)" }}
        maxBounds={[[5.5, 79], [10, 82]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.entries(trainData).map(([trainId, locations]) =>
          locations.map((location, index) => (
            <Marker
              key={`${trainId}-${index}`}
              position={[location.latitude, location.longitude]}
              icon={customIcon}
            >
              <Popup>
                <div>
                  <h3>{trainId}</h3>
                  <p>Latitude: {location.latitude}</p>
                  <p>Longitude: {location.longitude}</p>
                  <p>Last Updated: {new Date(location.timestamp).toLocaleString()}</p>
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
      <div className="contact-us">
        <h2>CONTACT US</h2>
        <p><strong>Address:</strong><br />Department of Railways<br />Colombo 10<br />Sri Lanka</p>
        <p><strong>Phone:</strong> +94 11 269 4847</p>
        <p><strong>Fax:</strong> +94 11 269 8311</p>
        <p><strong>Email:</strong> info@railways.gov.lk</p>
      </div>
    </div>
  );
};

export default MapIndex;
