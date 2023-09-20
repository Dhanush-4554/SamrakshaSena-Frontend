import React, { useEffect, useRef } from "react";
import markerIconUrl from "./path-to-your-marker-icon.png"; 
import L from "leaflet";

import "leaflet/dist/leaflet.css";

const Map = ({ userLocation, markedLocations, nearestLocation }) => {
  const mapRef = useRef(null);



  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView(
        [userLocation.latitude, userLocation.longitude],
        12
      );

      // const customMarkerIcon = L.icon({
      //   iconUrl: markerIconUrl,
      //   // iconSize: [32, 32], // Adjust the size as needed
      //   // iconAnchor: [16, 32], // Adjust the anchor point as needed
      // });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([userLocation.latitude, userLocation.longitude]
        )
        .bindPopup("Your Location")
        .addTo(map);

      markedLocations.forEach((location) => {
        L.marker([location.Latitude, location.Longitude])
          .bindPopup(location.AgencyName)
          .addTo(map);
      });

      if (nearestLocation) {
        L.marker([nearestLocation.Latitude, nearestLocation.Longitude])
          .bindPopup(nearestLocation.AgencyName)
          .addTo(map);
      }
    }
  }, [userLocation, markedLocations, nearestLocation]);

  return <div id="map" style={{ height: "500px",margin: "30px" ,padding:"" }} ref={mapRef}></div>;
};

export default Map;