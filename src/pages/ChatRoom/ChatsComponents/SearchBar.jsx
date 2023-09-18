import { Box, Button, Input, Spinner, Text, Tooltip, useToast } from '@chakra-ui/react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Avatar } from "@chakra-ui/avatar";
import axios from 'axios';
import React, { useState } from 'react'


import { ChatState } from '../../../context/ChatProvider';
import ChatLoading from './ChatLoading';
import UserList from './UserList';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const btnRef = React.useRef();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { CurrentUser, setSelectedChat , chats ,setChats } = ChatState();
  const Name = CurrentUser.Agency.AgencyName;


  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }


    try {
      setLoading(true);

      const { data } = await axios.get('/api/getAllagencies');

      setLoading(false);
      setSearchResult(data.agencies);
      //console.log(searchResult);

    } catch (error) {
      console.log(error);
    }
  };

  const accessChat = async (userID) => {
    try {
      setLoadingChat(true);

      const { data } = await axios.post('/chatroom/getChat', { chatUser: userID });
      //console.log(data);

      if (!chats.result.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setLoadingChat(false);
      setSelectedChat(data);
      onClose(onClose);
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };



  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="2px"
      >
        <Tooltip label='Search Agencies to Communicate' hasArrow placement='bottom-end'>
          <Button variant='ghost' ref={btnRef} colorScheme='teal' onClick={onOpen}>
            <Text px={4}>
              Search Agency
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work Sans" paddingRight={0}>
          Communicate With Agencies
        </Text>
        <Box>
          <Box>
            <Text>{Name}</Text>
            <Text fontSize="xs">
              {CurrentUser.Agency.AgencyEmail}
            </Text>
          </Box>
        </Box>
      </Box>


      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Agencies</DrawerHeader>

          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input
                placeholder='Search Name'
                mr={2}
                value={search}
                onChange={(e) => { setSearch(e.target.value) }}
              />
              <Button onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {
              loading ? (
                <ChatLoading />
              ) : searchResult.map((users) => (
                <UserList
                  key={users._id}
                  Name={users.AgencyName}
                  Email={users.AgencyEmail}
                  handleFunction={() => accessChat(users._id)}
                />
              ))
            }
            {loadingChat && <Spinner ml="20px" d="flex" size='xl' thickness='6px' />}
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

    </>
  )
}

export default SearchBar;
