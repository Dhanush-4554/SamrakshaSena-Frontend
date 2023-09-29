import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import "./registerpage.css";

import { Button, FormControl, Input, useToast, Box, } from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";

const Register = () => {
  const [AgencyName, setAgencyName] = useState();
  const [AgencyNumber, setAgencyNumber] = useState();
  const [AgencyEmail, setAgencyEmail] = useState();
  const [AgencyDescription, setAgencyDescription] = useState();
  const [AgencyAddress, setAgencyAddress] = useState();
  const [AgencyCategory, setAgencyCategory] = useState();
  const [AgencyPassword, setAgencyPassword] = useState();
  const [Latitude, setLatituse] = useState();
  const [Longitude, setLongitude] = useState();
  const [verifyLicense, setverifyLicense] = useState();
  const [verifiedNumber, setverifiedNumber] = useState();
  const [Loading, setLoading] = useState(false);
  const [verifyStatus,setverifyStatus] = useState(false);

  const toast = useToast();

  const navigate = useNavigate();
  const { setCurrentUser } = ChatState();

  const submitHandler = async () => {
    if (!AgencyName || !AgencyPassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const register_ojt = {
      AgencyName,
      AgencyNumber,
      AgencyEmail,
      AgencyDescription,
      AgencyAddress,
      AgencyCategory,
      AgencyLatitude: Latitude,
      AgencyLongitude: Longitude,
      AgencyPassword,
    };

    try {
      const { data } = await axios.post("/api/register", register_ojt);
      toast({
        title: "Registered Successful",
        status: "success",
        duration: 500,
        isClosable: true,
        position: "top",
      });

      console.log(data);

      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (error) {
      toast({
        title: "Error Occured!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const CheckLicenseNumber = async () => {

    setLoading(true);

    try {
      const { data } = await axios.post(`/api/getLicense`, {
        LicenseNumber: verifyLicense
      });

      if (data) {
        toast({
          title: "Verified",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
        setverifiedNumber(true);
      } else {
        toast({
          title: "License Number Not Found",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setverifyStatus(true);
        setLoading(false);
        setverifiedNumber(false)
      }



    } catch (error) {
      toast({
        title: "Could not Find License Number!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Get latitude and longitude from the position object
          setLatituse(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          // Handle error when geolocation fails
          console.error("Error getting location:", error);
        }
      );
      toast({
        title:
          "This is Your Current Location Coordinates.If you are not in Spot give the Coordinates Manually",
        status: "warning",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
    } else {
      // Geolocation is not supported by the browser
      console.error("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="login">
      <div className="register">
        <h1>Rescue Again!</h1>
        <h3>
          To help us protect!
          <br />
          Register with your info
        </h3>
        <Link to="/login">
          <input type="button" defaultValue="Login" />
        </Link>
      </div>
      <div className="signIn">
        <h1>Register</h1>

        <div className="input">
          <input
            value={AgencyName}
            type="text"
            placeholder="Enter AgencyName"
            onChange={(e) => setAgencyName(e.target.value)}
          />
        </div>

        <br />

        <div className="input">
          <input
            value={AgencyNumber}
            type="text"
            placeholder="Enter AgencyNumber"
            onChange={(e) => setAgencyNumber(e.target.value)}
          />
        </div>

        <div className="input">
          <input
            autoComplete="off"
            value={AgencyEmail}
            type="email"
            placeholder="Enter AgencyEmail"
            onChange={(e) => setAgencyEmail(e.target.value)}
          />
        </div>

        <div className="input">
          <input
            value={AgencyAddress}
            type="text"
            placeholder="Enter AgencyAddress"
            onChange={(e) => setAgencyAddress(e.target.value)}
          />
        </div>
        <div className="input">
          <input
            value={AgencyCategory}
            type="text"
            placeholder="Enter AgencyCategory"
            onChange={(e) => setAgencyCategory(e.target.value)}
          />
        </div>

        <div className="input">
          <input
            value={AgencyDescription}
            type="text"
            placeholder="Enter AgencyDescription"
            onChange={(e) => setAgencyDescription(e.target.value)}
          />
        </div>

        <FormControl display={"flex"} flexDir={"column"} ml={8}>
          <Button
            colorScheme="teal"
            onClick={handleGetLocation}
            mb={2}
            ml={7}
            mt={8}
            size="sm"
            width={40}
          >
            Get Location
          </Button>{" "}
          {/*Make this button on right side or anywhere */}
          <Input
            placeholder="Latitude"
            mb={1}
            ml={9}
            value={Latitude}
            onChange={(e) => setLatituse(e.target.value)}
            width={210}
          />
          <Input
            placeholder="Longitude"
            mb={1}
            ml={9}
            value={Longitude}
            onChange={(e) => setLongitude(e.target.value)}
            width={210}
          />
        </FormControl>

        <Box
          display={'flex'}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Input
            position={"relative"}
            left={3.5}
            placeholder="License Number"
            mb={1}
            ml={50}
            value={verifyLicense}
            onChange={(e) => {
              setverifyLicense(e.target.value)
            }}
            width={210}
          />

          {
            Loading ?
              <Button
                isLoading
                loadingText='Check'
                colorScheme='teal'
                variant='outline'
                ml={4}
                width={100}
              />
              :
              <Button
                colorScheme='teal'
                leftIcon={
                  verifiedNumber ? <CheckIcon color={'green'} boxSize={6} /> :
                     ( verifyStatus ? <CloseIcon color={'red'} /> : null)
                }
                ml={5}
                onClick={CheckLicenseNumber}
              >
                Verify
              </Button>
          }


        </Box>

        <div className="input">
          <input
            value={AgencyPassword}
            onChange={(e) => setAgencyPassword(e.target.value)}
            type="password"
            placeholder="Enter password"
          />
        </div>
        <br />
        <br />
        <button className="submit" onClick={submitHandler}>
          SignUp
        </button>
      </div>
    </div>
  );
};

export default Register;
