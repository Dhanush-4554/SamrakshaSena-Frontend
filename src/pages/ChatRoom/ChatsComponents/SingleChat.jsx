import React, { useEffect } from 'react'
import { ChatState } from '../../../context/ChatProvider';
import { Box, Button, FormControl, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import getSender from '../../../config/ChatLogic';
import axios from 'axios';
import { useState } from 'react';
import './Styles.css'
import ScrollChat from './ScrollChat';
import AssistCall from './AssistCall';

import io from "socket.io-client";
import GroupChatModel from './GroupChatModel';
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {  //functional component should not be async mfuck

    const { CurrentUser, selectedChat, setSelectedChat } = ChatState();
    const [SocketConnected, setSocketConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    const toast = useToast();

    const LeaveGroup = async () => {

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


    const fetchMessages = async () => {

        if (!selectedChat) return;
        console.log(selectedChat._id);

        try {
            setLoading(true);

            const { data } = await axios.get(`/chatroom/getMsg/${selectedChat._id}`);

            console.log(selectedChat);
            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id)

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }

    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", CurrentUser);
        socket.on("connected", () => setSocketConnected(true));
        // socket.on("typing", () => setIsTyping(true));
        // socket.on("stop typing", () => setIsTyping(false));

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat]);


    useEffect(() => {
        socket.on('Msg recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                console.log('Notify');
            } else {
                setMessages([...messages, newMessageRecieved]);
            }

        })
    })




    const sendMessage = async (event) => {

        if (event.key === "Enter" && newMessage) {


            try {

                const { data } = await axios.post('/chatroom/sendMsg', {
                    content: newMessage,
                    chatID: selectedChat._id
                });


                setNewMessage('');

                socket.emit('new message', data);
                setMessages([...messages, data]);
                //console.log(messages);



            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }

        }
    }



    const typingHandler = async (e) => {
        setNewMessage(e.target.value);
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

                                        <Box
                                            display='flex'
                                            justifyContent='space-between'
                                        >
                                            {getSender(CurrentUser, selectedChat.users)}

                                            <AssistCall>
                                                <Button
                                                    d="flex"
                                                    fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                                                    colorScheme='whatsapp'
                                                >
                                                    Need Assist
                                                </Button>
                                            </AssistCall>

                                        </Box>
                                    </>
                                ) : (
                                    <Box
                                        display='flex'
                                        justifyContent='space-between'
                                    >
                                        {selectedChat.chatName.toUpperCase()}
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

                            {
                                loading ?
                                    <Spinner
                                        size="xl"
                                        w={20}
                                        h={20}
                                        alignSelf="center"
                                        margin="auto"
                                    /> : (
                                        <div className='messages'>
                                            <ScrollChat messages={messages} />
                                        </div>
                                    )
                            }

                            <FormControl
                                onKeyDown={sendMessage}
                                isRequired
                                mt={3}
                            >
                                <Input
                                    variant="filled"
                                    bg="#E0E0E0"
                                    placeholder="Enter a message.."
                                    value={newMessage}
                                    onChange={typingHandler}
                                />

                            </FormControl>

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
