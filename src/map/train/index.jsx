import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from '../train/train-pin.png';
import L from 'leaflet';

const center = [7.688843, 80.665844];

////////

const MapIndex = () => {
    const [trainData, setTrainData] = useState({});
    
  
    useEffect(() => {
      // Fetch train data from API initially
      fetchTrainData();
     
  
      // Refresh train data every 30 seconds
      const intervalId = setInterval(fetchTrainData,  1000);
  
      return () => {
        clearInterval(intervalId); // Clean up interval on unmount
      };
    }, []);
  
    const fetchTrainData = () => {
      //fetch('http://localhost:3001/api/train-location/')
      fetch('https://trainapi-13vx.onrender.com/api/train-location/')
        .then(response => response.json())
        .then(data => {
          // Organize data by trainId and keep only the last 5 locations for each train
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
      <MapContainer
        center={center}
        zoom={7.5}
        style={{ width: "100vw", height: "100vh" }}
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
    );
  };
  export default MapIndex;

  //////


  
 

 
