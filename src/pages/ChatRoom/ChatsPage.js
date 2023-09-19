import{ React, useState } from 'react';
import { Box } from '@chakra-ui/react';

import { ChatState } from '../../context/ChatProvider';
import SearchBar from './ChatsComponents/SearchBar';
import ChatsConatiner from './ChatsComponents/ChatsConatiner';
import ChatBox from './ChatsComponents/ChatBox';


const ChatsPage = () => {

  const [fetchAgain, setFetchAgain] = useState(false);
  
  const {CurrentUser} = ChatState();
  //console.log(CurrentUser);
  
  return (
    <div style={{width:'100%',backgroundColor:'white',minHeight:'100vh',}}>
      {CurrentUser && <SearchBar/>}
      <Box 
        display='flex'
        justifyContent='space-between'
        pt={5}
        w='100%'
        h='90vh'
      >
        {CurrentUser && <ChatsConatiner fetchAgain={fetchAgain}/>}
        {CurrentUser && 
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  )
}

export default ChatsPage;
