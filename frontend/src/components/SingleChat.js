import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text} from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast,Button  } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon ,ArrowRightIcon} from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";

import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import Lottie from 'react-lottie'
import animationData from '../animations/typing.json';


// const ENDPOINT="http://localhost:5000";
const ENDPOINT="https://talkio-h0rj.onrender.com";
let socket,selectedChatCompare;
      


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat, setSelectedChat, user,notification,setNotification } =
    ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

 const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };





  const toast = useToast();

 




 const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id)
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
  };



  useEffect(()=>{
socket=io(ENDPOINT)
      socket.emit("setup",user)
      socket.on("connected",()=>
      setSocketConnected(true))
      socket.on("typing",()=>setIsTyping(true));
       socket.on("stop typing",()=>setIsTyping(false));
      

    },[]);

   useEffect(() => {
    fetchMessages();
    selectedChatCompare=selectedChat
  }, [selectedChat]);

  // console.log(notification,"........");


 useEffect(()=>{
    socket.on("message recieved",(newMessageRecieved)=>{
      if(!selectedChatCompare || selectedChatCompare._id!==newMessageRecieved.chat._id )
      {
        // dive notification
        // check if notification does not includes the new msg recived then just add newmsgrec..to notification array
        
        if(!notification.includes(newMessageRecieved))
        {
          setNotification([newMessageRecieved,...notification]);
          // update  the list of chat so latest msg is update
          setFetchAgain(!fetchAgain)
        }

      }
      else
      {
        setMessages([...messages,newMessageRecieved])
      }
    })
  })


   const sendMessage=async(e)=>{
       if (e.key === "Enter" && newMessage) 
       {
        socket.emit("stop typing",selectedChat._id)
        try {
            const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        // console.log(data);

        socket.emit("new message",data)
    
          setMessages([...messages, data]);
          setFetchAgain(!fetchAgain)
          
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
   };


     //  using send button
  const sendMessage2 = async (e) => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id)
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        // console.log(data)
        // appending this data to the array of all of the messages 9:00 #14
        // socket.emit("new message", data)
        socket.emit("new message", data)
        setMessages([...messages, data]);
        // added by me
        setFetchAgain(!fetchAgain)
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
  };

   
  


   
 
 
  const typingHandler=(e)=>{
    setNewMessage(e.target.value);

    // first check if socket is connected or not if not return it
   if(!socketConnected)return;

    //  if not typing
    if(!typing)
    {
      setTyping(true)
      socket.emit("typing",selectedChat._id)
    }
  // create debounding like   function decide when to stop typing
  // let say after 3sec it show not typing

  let lastTypingTime=new Date().getTime();
  var timerLength =3000;
  setTimeout(()=>{
    var timeNow =new Date().getTime();
    var timeDiff=timeNow-lastTypingTime;
   if(timeDiff>=timerLength && typing)
   {
    socket.emit("stop typing",selectedChat._id);
    setTyping(false);
   }

  },timerLength)

   };


 return (
    <>

    {selectedChat ? (<>
      <Text 
      fontSize={{base:"28px" ,md:"30px"}}
      pb={3}
      px={2}
      w={'100%'}
      fontFamily={'work sans'}
      d={'flex'}
      justifyContent={{base:"space-between"}}
      alignItems={'center'}
      >
        <IconButton 
        d={{base:'flex',md:"none"}}
        icon={<ArrowBackIcon />}
        onClick={()=>setSelectedChat("")}
        />
        {!selectedChat.isGroupChat ? (   
        
        <>
        
        {getSender(user,selectedChat.users )}
        <ProfileModal user={getSenderFull(user,selectedChat.users )} />
        
        </>) :
        
        (
            <>{selectedChat.chatName.toUpperCase()}
            <UpdateGroupChatModal 
                 
          
                fetchMessages={fetchMessages}
                fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />

                </>


        )} 

      </Text>

      <Box
      d={'flex'}
      flexDir='column'
      justifyContent={'flex-end'}
      p={3}
      bg='#E8E8E8'
      w='100%'
      h='100%'
      borderRadius="lg"
      overflowY="hidden"
      >

        {/* send ur message here */}
    {
      loading ? ( <Spinner
              size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
      
      />):(
        <div className='messages'>
         <ScrollableChat 
         messages={messages}/>
        </div>
      )}
      <FormControl  onKeyDown={sendMessage} isRequired mt={3}>
       {isTyping ? <div>
       <Lottie 
       options={defaultOptions}
       width={90}
       style={{marginBottom:15,marginLeft:0}}
       />
       </div>  :  <> </>}

        {/* <Button colorScheme="teal" ml={2} onClick={sendMessage2}>
                send
              </Button> */}
        <Input
               variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                
        />
              <IconButton
        icon={<ArrowRightIcon />}
        aria-label="Send message"
        position="absolute"
        right="0"
        top="50%"
        transform="translateY(-50%)"
        onClick={sendMessage2}
      />

         

      </FormControl>

      </Box>
    
    </>
    ):
    
    
    
    (
        <Box d={'flex'} alignItems={'center'} justifyContent={'center'} h={'100%'}>
            <Text fontSize={'3xl'} pb={1} fontFamily={'work sans'}>
                Click on a user to start chatting

            </Text>
            
        </Box>

    )}
    
    
    
    
    
    </>
 )
    }

export default SingleChat;