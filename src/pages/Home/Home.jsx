import { React, useState, useEffect } from 'react'
import axios from 'axios';
import Layout from '../../components/Layout/Layout'
import Navbar from '../../components/Layout/Navbar/navbar'
import Card from './HomePageComponents/EmergencyCard';


const Home = () => {

  return (
    <Layout title="Home Page | SIH 2k23">
      <Card />
      <Navbar />
    </Layout>
  )
}

export default Home
