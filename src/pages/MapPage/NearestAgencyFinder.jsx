import { React, useState, useEffect, useRef } from "react";
import customMarkerIconUrl from "./path-to-your-marker-icon.png";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import './map.css'

function Nearest() {
  const [category, setCategory] = useState();
  const [userLocation, setUserLocation] = useState(null);
  const [markedLocations, setMarkedLocations] = useState([]);
  const [nearestLocation, setNearestLocation] = useState(null);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const customMarkerIcon = L.icon({
    iconUrl: customMarkerIconUrl,
    iconSize: [32, 32], // Adjust the size as needed
    iconAnchor: [16, 32], // Adjust the anchor point as needed
  });

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
        7.5
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
        L.marker([userLocation.latitude, userLocation.longitude], {
          icon: customMarkerIcon,
        })
          .bindPopup("Your Location")
          .addTo(mapInstanceRef.current);
      }

      // Filtering locations based on the selected category
      const filteredLocations = markedLocations.filter(
        (location) => location.Category === category
      );

      // Finding the nearest marked location of the selected category
      if (filteredLocations.length > 0) {
        const nearest = findNearestLocation(
          userLocation.latitude,
          userLocation.longitude,
          filteredLocations
        );
        setNearestLocation(nearest);

        // Adding markers for marked locations of the selected category
        filteredLocations.forEach((location) => {
          const marker = L.marker([location.Latitude, location.Longitude], {
            icon: customMarkerIcon,
          })
            .bindPopup(location.AgencyName)
            .addTo(mapInstanceRef.current);

          // Attach a custom popup content with the button
          marker.on("click", () => {
            setSelectedAgency(location);
          });
        });

        // Adding a marker for the nearest location
        if (nearest) {
          const nearestAgency = L.marker([nearest.Latitude, nearest.Longitude], {
            icon: customMarkerIcon,
          })
            .bindPopup(`Nearest: ${nearest.AgencyName}`)
            .addTo(mapInstanceRef.current);
          nearestAgency.on("click", () => {
            setSelectedAgency(nearest);
          });
        }
      }
    }
  }, [userLocation, markedLocations, category]);

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



  const showShortestRoute = () => {
    if (userLocation && selectedAgency) {

      // Creating a routing control and add it to the map
      L.Routing.control({
        waypoints: [
          L.latLng(userLocation.latitude, userLocation.longitude),
          L.latLng(selectedAgency.Latitude, selectedAgency.Longitude),
        ],
      }).addTo(mapInstanceRef.current);

    }
  };

  return (
    <div className="map-container">
      <div className="categories">
        <button className='link' onClick={() => setCategory("fire")}><p>Fire Agencies</p></button>
        <button className='link' onClick={() => setCategory("flood")}><p>Flood Agencies</p></button>
        <button className='link' onClick={() => setCategory("animalRescue")}><p>Animal Rescue</p></button>
        <button className='link' onClick={() => setCategory("excavation")}><p>Excavation Agencies</p></button>
      </div>
      <div className="map-holder">
        <div id="map" className="map" ref={mapRef}></div>
      </div>
      {selectedAgency && (
        <div className="route-button">
          <button onClick={showShortestRoute}>Show Shortest Route</button>
        </div>
      )}
    </div>
  );
}

export default Nearest;