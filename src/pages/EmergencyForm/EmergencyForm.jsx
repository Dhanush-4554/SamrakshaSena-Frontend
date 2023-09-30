import React, { useState, useEffect } from "react";
import "./EmergencyForm.css";

function NearestWithCategory() {
  const [category, setCategory] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [nearestAgencyPhoneNumber, setNearestAgencyPhoneNumber] =
    useState(null);
  const [nearestAgencyName, setNearestAgencyName] = useState(null);

  async function handleSubmit() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });

            if (category) {
              try {
                const response = await fetch(
                  `/api/getEverything/?AgencyCategory=${category}`
                );

                if (response.ok) {
                  const data = await response.json();

                  if (data.length > 0) {
                    const nearestAgency = findNearestAgency(
                      latitude,
                      longitude,
                      data
                    );
                    console.log(nearestAgency);
                    setNearestAgencyPhoneNumber(nearestAgency.AgencyNumber);
                    setNearestAgencyName(nearestAgency.AgencyName);

                    sendToBackend({
                      UserLatitude: latitude,
                      UserLongitude: longitude,
                      AgencyNumber: nearestAgency.AgencyNumber,
                    });
                  }
                } else {
                  console.error("Error fetching agency data");
                }
              } catch (error) {
                console.error("Error fetching agency data:", error);
              }
            }
          } catch (err) {
            console.error("Error fetching location data", err);
          }
        },
        (err) => {
          console.error(err.message);
        }
      );
    } else {
      console.error("Geolocation is not available in your browser");
    }
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

  // Function to find the nearest agency's phone number and name
  function findNearestAgency(latitude, longitude, agencies) {
    let nearestAgency = null;
    let minDistance = Number.MAX_VALUE;

    for (const agency of agencies) {
      const distance = calculateDistance(
        latitude,
        longitude,
        agency.AgencyLatitude,
        agency.AgencyLongitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestAgency = agency;
      }
    }

    return nearestAgency;
  }

  function sendToBackend(data) {
    const backendEndpoint = `http://localhost:5000/api/alertAgency`;

    console.log("Sending data to backend:", data);

    fetch(backendEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log("Response status:", response.status);
        if (response.ok) {
          console.log("Data sent to backend successfully");
        } else {
          console.error("Error sending data to backend");
        }
      })
      .catch((error) => {
        console.error("Error sending data to backend:", error);
      });
  }

  return (
    <div className="emergencyForm">
      <div className="div0">
        <div className="class1 class2"></div>
        <h1 className="heading_Wepage heading_Wepage2">report an emergency</h1>
      </div>

      <label htmlFor="category">
        <b style={{ fontSize: 25 }}>Select a Category:</b>
      </label>
      <select
        id="category"
        className="dropDownStyle"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select a Category</option>
        <option value="fire rescue agency">Fire Agencies</option>
        <option value="flood">Flood Agencies</option>
        <option value="animalRescue">Animal Rescue</option>
        <option value="excavation">Excavation Agencies</option>
      </select>

      {userLocation && (
        <div>
          <p>User Location:</p>
          <p>Latitude: {userLocation.latitude}</p>
          <p>Longitude: {userLocation.longitude}</p>
        </div>
      )}

      {nearestAgencyPhoneNumber && nearestAgencyName && (
        <div>
          <p>Nearest Agency's Name:</p>
          <p>{nearestAgencyName}</p>
          <p>Nearest Agency's Phone Number:</p>
          <p>{nearestAgencyPhoneNumber}</p>
        </div>
      )}

      <div className="reportButtonDiv" onClick={handleSubmit}>
        <button className="reportButton">Report</button>
      </div>
    </div>
  );
}

export default NearestWithCategory;
