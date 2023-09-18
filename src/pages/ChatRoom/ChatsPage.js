import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box } from '@chakra-ui/react';

import { ChatState } from '../../context/ChatProvider';

import SearchBar from './ChatsComponents/SearchBar';
import ChatsConatiner from './ChatsComponents/ChatsConatiner';
import ChatBox from './ChatsComponents/ChatBox';



const ChatsPage = () => {
  
  const {CurrentUser} = ChatState();
  
  return (
    <div style={{width:'100%',backgroundColor:'white',minHeight:'100vh',}}>
      {CurrentUser && <SearchBar/>}
      <Box 
        display='flex'
        justifyContent='space-between'
        w='100%'
        h='90vh'
      >
        {CurrentUser && <ChatsConatiner/>}
        {CurrentUser && <ChatBox/>}
      </Box>
    </div>
  )
}

export default ChatsPage;
