import React, { useEffect, useRef } from "react";
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

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([userLocation.latitude, userLocation.longitude])
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

  return <div id="map" style={{ height: "500px" }} ref={mapRef}></div>;
};

export default Map;
