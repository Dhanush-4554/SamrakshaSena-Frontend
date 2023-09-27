import React from "react";
import "./registerpage.css";

import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";

const Login = () => {
  const toast = useToast();

  const [AgencyName, setAgencyName] = useState();
  const [AgencyPassword, setAgencyPassword] = useState();
  //const [loading, setLoading] = useState(false);
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

    try {
      const { data } = await axios.post("/api/login", {
        AgencyName,
        AgencyPassword,
      });
      toast({
        title: "Login Successful",
        status: "success",
        duration: 500,
        isClosable: true,
        position: "top",
      });

      //console.log(data);
      setCurrentUser(data.Agency);
      localStorage.setItem("userInfo", JSON.stringify(data.Agency)); //created a localStorage for CurrentUser

      setTimeout(() => {
        navigate("/");
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

  return (
    <div className="login">
      <div className="register">
        <h1>Rescue Again!</h1>
        <h3>
          To help us protect!
          <br />
          Register with your info
        </h3>
        <Link to="/register">
          <input type="button" defaultValue="Register" />
        </Link>
      </div>
      <div className="signIn">
        <h1>Login</h1>
        <br />
        <div className="input">
          <img
            src="https://w7.pngwing.com/pngs/290/731/png-transparent-computer-icons-user-username-avatar-person-skill-thumbnail.png"
            alt="username"
          />
          <input
            value={AgencyName}
            type="text"
            placeholder="Enter AgencyName"
            onChange={(e) => setAgencyName(e.target.value)}
          />
        </div>

        {/* <div class="input">
                        <img
                        src="https://cdn-icons-png.flaticon.com/512/684/684833.png"
                        alt="id"
                        />
                        <input type="text" placeholder="Agency ID" />
                </div> */}

        <br />

        <div className="input">
          <img
            src="https://toppng.com/uploads/preview/lock-login-key-password-protected-safe-security-icon-login-password-11553447634eebadko8fe.png"
            alt="password"
          />
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
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
