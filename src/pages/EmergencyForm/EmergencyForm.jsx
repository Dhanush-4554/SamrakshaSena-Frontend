// import React, { useState, useEffect } from "react";

// function NearestWithCategory() {
//   const [category, setCategory] = useState("");
//   const [userLocation, setUserLocation] = useState(null);
//   const [nearestAgencyPhoneNumber, setNearestAgencyPhoneNumber] = useState(null);

//   useEffect(() => {
//     // Checking if Geolocation is available in the browser
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           try {
//             const { latitude, longitude } = position.coords;
//             setUserLocation({ latitude, longitude });

//             // Fetch agencies of the selected category
//             if (category) {
//               try {
//                 const response = await fetch(
//                   `/api/getEverything/?AgencyCategory=${category}`
//                 );

//                 if (response.ok) {
//                   const data = await response.json();
//                   // Handle the response from the backend here
//                   if (data.length > 0) {
//                     // Find the nearest agency's phone number
//                     const nearestPhoneNumber = findNearestAgencyPhoneNumber(
//                       latitude,
//                       longitude,
//                       data
//                     );
//                     console.log(nearestPhoneNumber)
//                     setNearestAgencyPhoneNumber(nearestPhoneNumber);
//                   }
//                 } else {
//                   // Handle error responses from the backend
//                   console.error("Error fetching agency data");
//                 }
//               } catch (error) {
//                 console.error("Error fetching agency data:", error);
//               }
//             }
//           } catch (err) {
//             console.error("Error fetching location data", err);
//           }
//         },
//         (err) => {
//           console.error(err.message);
//         }
//       );
//     } else {
//       console.error("Geolocation is not available in your browser");
//     }
//   }, [category]);

//   // Function to calculate distance between two points
//   function calculateDistance(lat1, lon1, lat2, lon2) {
//     const earthRadius = 6371;
//     const dLat = degToRad(lat2 - lat1);
//     const dLon = degToRad(lon2 - lon1);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(degToRad(lat1)) *
//         Math.cos(degToRad(lat2)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = earthRadius * c;
//     return distance;
//   }

//   // Function to convert degrees to radians
//   function degToRad(deg) {
//     return deg * (Math.PI / 180);
//   }

//   // Function to find the nearest agency's phone number
//   function findNearestAgencyPhoneNumber(latitude, longitude, agencies) {
//     let nearestPhoneNumber = null;
//     let minDistance = Number.MAX_VALUE;

//     for (const agency of agencies) {
//       const distance = calculateDistance(
//         latitude,
//         longitude,
//         agency.AgencyLatitude,
//         agency.AgencyLongitude
//       );

//       if (distance < minDistance) {
//         minDistance = distance;
//         nearestPhoneNumber = agency.AgencyNumber;
//       }
//     }

//     return nearestPhoneNumber;
//   }

//   return (
//     <div>
//       <label htmlFor="category">Select a Category:</label>
//       <select
//         id="category"
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//       >
//         <option value="">Select a Category</option>
//         <option value="fire rescue agency">Fire Agencies</option>
//         <option value="flood">Flood Agencies</option>
//         <option value="animalRescue">Animal Rescue</option>
//         <option value="excavation">Excavation Agencies</option>
//       </select>

//       {userLocation && (
//         <div>
//           <p>User Location:</p>
//           <p>Latitude: {userLocation.latitude}</p>
//           <p>Longitude: {userLocation.longitude}</p>
//         </div>
//       )}

//       {nearestAgencyPhoneNumber && (
//         <div>
//           <p>Nearest Agency's Phone Number:</p>
//           <p>{nearestAgencyPhoneNumber}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default NearestWithCategory;



import React, { useState, useEffect } from "react";

function NearestWithCategory() {
  const [category, setCategory] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [nearestAgencyPhoneNumber, setNearestAgencyPhoneNumber] = useState(null);
  const [nearestAgencyName, setNearestAgencyName] = useState(null);

  useEffect(() => {
    // Checking if Geolocation is available in the browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });

            // Fetch agencies of the selected category
            if (category) {
              try {
                const response = await fetch(
                  `/api/getEverything/?AgencyCategory=${category}`
                );

                if (response.ok) {
                  const data = await response.json();
                  // Handle the response from the backend here
                  if (data.length > 0) {
                    // Find the nearest agency's phone number and name
                    const nearestAgency = findNearestAgency(
                      latitude,
                      longitude,
                      data
                    );
                    console.log(nearestAgency);
                    setNearestAgencyPhoneNumber(nearestAgency.AgencyNumber);
                    setNearestAgencyName(nearestAgency.AgencyName);

                    // Send user location, agency name, and phone number to the backend
                    sendToBackend({
                      latitude,
                      longitude,
                      agencyName: nearestAgency.AgencyName,
                      phoneNumber: nearestAgency.AgencyNumber,
                    });
                  }
                } else {
                  // Handle error responses from the backend
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
  }, [category]);

  // Function to calculate distance between two points
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

  // Function to convert degrees to radians
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
   
    const backendEndpoint = `http://localhost:5000/api/sendDataToBackend`;
  
    console.log('Sending data to backend:', data);
  
    fetch(backendEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log('Response status:', response.status);
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
    <div>
      <label htmlFor="category">Select a Category:</label>
      <select
        id="category"
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
    </div>
  );
}

export default NearestWithCategory;
