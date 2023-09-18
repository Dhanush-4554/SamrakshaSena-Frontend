import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import UserListItem from "./UserList";
import UserBadgeItem from "./UserBadge";

const GroupChatModel = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { CurrentUser, chats, setChats } = ChatState();


    const handleSearch = async (query) => {
        //console.log(query);
        setSearch(query);
        if (!query) {
            toast({
                title: "Error",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try{

            setLoading(true);
            const { data } = await axios.get(`/api/getAllagencies?search=${query}`);
            setLoading(false);
            setSearchResult(data.agencies);

        } catch (error) {

            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });

        }
    }

    const handleSubmit = async () => {

        if (!groupChatName || !selectedUsers) {
            toast({
              title: "Please fill all the feilds",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
        }

        try {

            const {data} = await axios.post('/chatroom/createGroup',{
                GroupName: groupChatName,
                users: JSON.stringify(selectedUsers.map((user) => user._id)),
            })
            console.log(chats);
            //console.log(response.data);
            setChats({data , ...chats});
            onClose();
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });

            window.location.reload();

        } catch (error) {

            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
            
        }


    }

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {

          toast({
            title: "User already added",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return ;

        }

        setSelectedUsers([...selectedUsers, userToAdd]);
      };


    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="25px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        Create New Agencies Grp
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input
                                placeholder="Group Name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Agencies"
                                mb={1}
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w="100%" d="flex" flexWrap="wrap">
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                              searchResult?.slice(0,4).map((users) => (
                                <UserListItem
                                  key={users._id}
                                  Name={users.AgencyName}
                                  Email={users.AgencyEmail}
                                  handleFunction={() => handleGroup(users)}
                                />
                              )
                              ))
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleSubmit} colorScheme="blue">
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModel
