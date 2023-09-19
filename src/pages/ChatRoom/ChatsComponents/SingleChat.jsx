import React from 'react'
import { ChatState } from '../../../context/ChatProvider';
import { Box, Button, Text } from '@chakra-ui/react';
import getSender from '../../../config/ChatLogic';
import axios from 'axios';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {  //functional component should not be async mfuck

    const { CurrentUser, selectedChat , setSelectedChat } = ChatState();

    const LeaveGroup = async() =>{

        const { data } = await axios.put(
            `/chatroom/removeFromGroup`,
            {
                groupID: selectedChat._id,
                userID: CurrentUser._id,
            },
          );
          console.log(data);
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          window.location.reload();
    }

    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            w="100%"
                            fontFamily="Work sans"
                            d="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"
                        >
                            {
                                !selectedChat.GroupChat ? (
                                    <>
                                        {getSender(CurrentUser, selectedChat.users)}
                                    </>
                                ) : (
                                    <Box
                                        display='flex'
                                        justifyContent='space-between'
                                    >
                                       { selectedChat.chatName.toUpperCase()}
                                        <Button
                                            colorScheme='red'
                                            onClick={LeaveGroup}
                                        >Leave Group</Button>
                                    </Box>
                                )

                            }
                        </Text>
                        <Box
                            display="flex"
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            h="100%"
                            borderRadius="lg"
                            overflowY="hidden"
                        >

                        </Box>
                    </>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click On Chat to Communicate
                        </Text>
                    </Box>
                )
            }
        </>
    )
}

export default SingleChat;
