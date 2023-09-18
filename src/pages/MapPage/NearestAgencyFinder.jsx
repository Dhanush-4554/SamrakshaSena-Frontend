import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function Nearest() {
  const [userLocation, setUserLocation] = useState(null);
  const [markedLocations, setMarkedLocations] = useState([]);
  const [nearestLocation, setNearestLocation] = useState(null);
  const [error, setError] = useState(null);
  const mapRef = useRef(null); // Ref for the map container
  const mapInstanceRef = useRef(null); // Ref for the Leaflet map instance

  useEffect(() => {
    // Checking if Geolocation is available in the browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });

            const response = await fetch("/api/AgencyLocations");
            const data = await response.json();

            if (data.AllLocation && data.AllLocation.length > 0) {
              setMarkedLocations(data.AllLocation);

              // Finding the nearest marked location
              const nearest = findNearestLocation(
                latitude,
                longitude,
                data.AllLocation
              );
              setNearestLocation(nearest);
            } else {
              setError("No location data available");
            }
          } catch (err) {
            setError("Error fetching location data");
          }
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not available in your browser");
    }
  }, []);

  useEffect(() => {
    // Initializing the Leaflet map when userLocation is available
    if (userLocation && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [userLocation.latitude, userLocation.longitude],
        12
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    }
  }, [userLocation]);

  useEffect(() => {
    // Adding markers for user location, marked locations, and nearest location
    if (mapInstanceRef.current) {
      // Removing existing markers before adding new ones
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Adding a marker for the user's location
      if (userLocation) {
        L.marker([userLocation.latitude, userLocation.longitude])
          .bindPopup("Your Location")
          .addTo(mapInstanceRef.current);
      }

      // Adding markers for marked locations
      markedLocations.forEach((location) => {
        L.marker([location.Latitude, location.Longitude])
          .bindPopup(location.AgencyName)
          .addTo(mapInstanceRef.current);
      });

      // Adding a marker for the nearest location
      if (nearestLocation) {
        L.marker([nearestLocation.Latitude, nearestLocation.Longitude])
          .bindPopup(`Nearest: ${nearestLocation.AgencyName}`)
          .addTo(mapInstanceRef.current);
      }
    }
  }, [userLocation, markedLocations, nearestLocation]);

  function findNearestLocation(userLat, userLon, locations) {
    let nearestLocation = null;
    let minDistance = Number.MAX_VALUE;

    for (const location of locations) {
      const distance = calculateDistance(
        userLat,
        userLon,
        location.Latitude,
        location.Longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestLocation = location;
      }
    }

    return nearestLocation;
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371;
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) *
        Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance;
  }

  function degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  return (
    <div>
      <h1>Nearest Locations</h1>
      {userLocation && nearestLocation ? (
        <div>
          <h3>Your current location is:</h3>
          <ul>
            <li>Latitude: {userLocation.latitude}</li>
            <li>Longitude: {userLocation.longitude}</li>
          </ul>

          <h3>Nearest Marked Location:</h3>
          <ul>
            <li>Name: {nearestLocation.AgencyName}</li>
            <li>Latitude: {nearestLocation.Latitude}</li>
            <li>Longitude: {nearestLocation.Longitude}</li>
            <li>
              Distance:{" "}
              {calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                nearestLocation.Latitude,
                nearestLocation.Longitude
              ).toFixed(2)}{" "}
              km
            </li>
          </ul>
        </div>
      ) : (
        <h1>{error || "Fetching location..."}</h1>
      )}

      <div id="map" style={{ height: "500px" }} ref={mapRef}></div>
    </div>
  );
}

export default Nearest;



