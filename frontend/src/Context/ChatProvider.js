import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;


// import React, {  createContext, useContext, useEffect, useState } from 'react'
// // import {useNavigate} from "react-router-dom"
// import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

// const ChatContext = createContext()
// const ChatProvider = ({ children }) => {
//   const history = useHistory()
//   const [user, setUser] = useState()
//   const [selectedChat, setSelectedChat] = useState() // object of one on one chat accessChat api , it means chatModel of one particular chat, which will container two users(inside chatModel's users: array) for one on one and a 2 or more users for groupChat
//   const [chats, setChats] = useState() // array of all chatModels, it will be a array that will contain objects (chatModel) to how many users , the logged in user chatted with => fetchChat api
//   // chat = [{a}, {b}, {v},....]
//   const [notification, setNotification] = useState([])
  
//   useEffect(() => {
//     const userInfo = JSON.parse(localStorage.getItem("userInfo"))
//     setUser(userInfo)
//     if (!userInfo) {
//       history.push("/")
//     }
//   }, [history])
//   return (
//     <ChatContext.Provider value={{user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification}}>
//       {children}
//     </ChatContext.Provider>
//   )
// }
// export const ChatState = ()=>{
//   return useContext(ChatContext)
// }

// export default ChatProvider 