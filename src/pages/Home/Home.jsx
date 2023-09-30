import { React, useState, useEffect } from 'react'
import axios from 'axios';
import Layout from '../../components/Layout/Layout'
import Navbar from '../../components/Layout/Navbar/navbar'
import Card from './HomePageComponents/EmergencyCard';
import { ChatState } from '../../context/ChatProvider';
import WePage from './HomePageComponents/WePage';
import Press from './HomePageComponents/Press/Press';


const Home = () => {

  const {CurrentUser} = ChatState();
  //console.log(CurrentUser);
  return (
    <Layout title="Home Page | SIH 2k23">
      <Card />
      <Navbar CurrentUser={CurrentUser}/>
      <WePage />
      <Press />
    </Layout>
  )
}

export default Home
