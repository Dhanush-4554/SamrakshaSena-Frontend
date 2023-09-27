import { React, useState, useEffect, useRef } from "react";
import customMarkerIconUrl from "./path-to-your-marker-icon.png";
import { useLocation } from "react-router-dom";

import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import "./map.css";
import Navbar from "../../components/Layout/Navbar/navbar";

function Nearest() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");

  const [category, setCategory] = useState();
  const [userLocation, setUserLocation] = useState(null);
  const [markedLocations, setMarkedLocations] = useState([]);
  const [markedLocationsContact, setMarkedLocationsContact] = useState([]);
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
            .bindPopup(
              location.AgencyName + " Phone no:" + location.AgencyNumber
            )

            .addTo(mapInstanceRef.current);

          // Attach a custom popup content with the button
          marker.on("click", () => {
            setSelectedAgency(location);
          });
        });

        // Adding a marker for the nearest location
        if (nearest) {
          const nearestAgency = L.marker(
            [nearest.Latitude, nearest.Longitude],
            {
              icon: customMarkerIcon,
            }
          )
            .bindPopup(
              "Nearest:" +
                nearest.AgencyName +
                " " +
                "Phone no:" +
                nearest.AgencyNumber
            )
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
      const lineStroke = document.getElementsByClassName("leaflet-interactive");
      lineStroke.stroke = "blue";
    }
  };

  // const showShortestRoute = async () => {
  //   if (userLocation && selectedAgency && categoryParam) {
  //     try {
  //       // Create a request object with the necessary data, including the selected category
  //       const requestData = {
  //         userLocation: {
  //           latitude: userLocation.latitude,
  //           longitude: userLocation.longitude,
  //         },
  //         nearestAgency: {
  //           name: selectedAgency.AgencyName,
  //           phoneNumber: selectedAgency.AgencyNumber,
  //         },
  //         category: categoryParam, // Use the categoryParam from the URL
  //       };

  //       // Send the request to the backend
  //       const response = await fetch('/api/getEverything', {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(requestData),
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         // Handle the response from the backend here
  //         console.log('Response from Backend:', data);
  //       } else {
  //         // Handle error responses from the backend
  //         console.error('Error sending data to the backend');
  //       }
  //     } catch (error) {
  //       console.error('Error sending data to the backend:', error);
  //     }
  //   }
  // }

  return (
    <div className="map-page">
      <Navbar className="navbarMap" />
      <div>
        <div className="map-container">
          <div className="categories">
            <button className="link" onClick={() => setCategory("fire")}>
              <p>Fire Agencies</p>
            </button>
            <button className="link" onClick={() => setCategory("flood")}>
              <p>Flood Agencies</p>
            </button>
            <button
              className="link"
              onClick={() => setCategory("animalRescue")}
            >
              <p>Animal Rescue</p>
            </button>
            <button className="link" onClick={() => setCategory("excavation")}>
              <p>Excavation Agencies</p>
            </button>
          </div>
          <div className="map-holder">
            <div id="map" className="map" ref={mapRef}></div>
          </div>
          {selectedAgency && (
            <div className="route-button">
              <button onClick={showShortestRoute} className="shortestRoute">
                Show Shortest Route
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nearest;
