import { React, useState, useEffect } from 'react';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
import { ChatState } from '../../../context/ChatProvider';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import getSender from '../../../config/ChatLogic'
import GroupChatModel from './GroupChatModel';

const ChatsConatiner = ({ fetchAgain }) => {

  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, CurrentUser, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {

    //console.log(CurrentUser._id);

    try {

      const { data } = await axios.get("/chatroom/fetchUserChats");
      //console.log(data);
      setChats(data);

    } catch (error) {
      toast({
        title: "Login to get Chats",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  },[fetchAgain]);


  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >

      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="sans-serif"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModel>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            Create New Agency Grp
          </Button>
        </GroupChatModel>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h='90%'
        borderRadius="lg"
        overflowY="hidden"
      >

        {chats ? (
          <Stack overflowY="scroll">
            {chats.result.map((chat) => (
              <Box
                onClick={() => {setSelectedChat(chat)
                  //console.log(selectedChat);
                }}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.GroupChat
                    ? getSender(loggedUser,chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default ChatsConatiner
