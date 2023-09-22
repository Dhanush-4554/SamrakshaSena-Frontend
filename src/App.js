import { Routes, Route } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';
import './App.css';



import Home from "./pages/Home/Home";
import ChatsPage from "./pages/ChatRoom/ChatsPage";
import Nearest from "./pages/MapPage/NearestAgencyFinder";
import Login from "./pages/RegisterPages/Login";
import NearestWithCategory from "./pages/EmergencyForm/EmergencyForm";


function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path='/communication' element={<ChatsPage/>} />
        <Route exact path="/login" element={<Login />} /> {/*  Dont Use this it for Testing with backend Create New Page */}
        <Route path='/map' element={<Nearest/>} />
        <Route path="/form"  element={<NearestWithCategory/>}/>
      </Routes>
    </ChakraProvider>
  );
}

export default App;