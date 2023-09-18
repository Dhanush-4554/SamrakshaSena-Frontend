import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({children}) =>{
    const [CurrentUser,setCurrentUser] = useState();
    const [selectedChat , setSelectedChat] =  useState();
    const [chats,setChats] = useState();

    const navigate = useNavigate();

    //This is for Chat Authentication only

    useEffect(()=>{
        const CurrentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        setCurrentUser(CurrentUserInfo);

        // if(!CurrentUser){
        //     navigate('/login'); //This is not needed because Emergency User don't Need login
        // }

    },[navigate]);

    const value = {
        CurrentUser,
        setCurrentUser,
        setSelectedChat,
        selectedChat,
        chats,
        setChats
    };
    return(
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
};

export const ChatState = () =>{
    return useContext(ChatContext); //Custom Hook Type
};


export default ChatProvider;