import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatsPage = () => {
    const [chats,setChats] = useState([]);

    const getChats = async() =>{
        const {data} = await axios.get('/api/agencyLocations');
        console.log(data);
        setChats(data.AllLocation);
    }

    useEffect(()=>{
        getChats();
    },[])

  return (
    <div>
      {
        chats.map((chat)=>{
            return (<h1>{chat.AgencyName}</h1>)
        })
      }
    </div>
  )
}

export default ChatsPage;
