import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { VStack } from '@chakra-ui/react';

import React from 'react'
import { useState } from 'react';
import { useToast } from '@chakra-ui/react'; 
import axios from 'axios';
import {useHistory} from 'react-router-dom';



const Signup = () => {

  const [show,setShow]=useState(false);
   const [name,setName]=useState();
   const [email,setEmail]=useState();
   const [password,setPassword]=useState();
   const [confirmpassword,setConfirmpassword]=useState();
   const [pic,setPic]=useState();
   const [loading,setLoading]=useState(false);
     const toast = useToast();
     const history =useHistory();


   const handleClick =()=>setShow(!show);

   const postDetails = (pics) => {
    setLoading(true);

    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
      toast({
        title: "Please Select a JPEG or PNG Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {

      const data = new FormData()
      data.append("file", pics)
      data.append("upload_preset", 'chatting app')
      data.append("cloud_name", 'akanshajaiswal')
      axios.post("https://api.cloudinary.com/v1_1/akankshajaiswal/image/upload", data)
        .then((response) => {
          console.log("Cloudinary response:", response);
          setPic(response.data.url.toString());
          setLoading(false);
          toast({
            title: "Image uploaded successfully!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        })
        .catch((error) => {
          console.log("Cloudinary error:", error);
          setLoading(false);
        });
    }
  }

   const submitHandler = async()=>{
    setLoading(true);
    // gonna check if all field is fill or not if no then show warning
   if(!name || !email || !password || !confirmpassword)
   {
    toast({
      title:"Please fill all the fields",
      status:"warning",
      duration:5000,
      isClosable:true,
      position:"bottom",

    });
    setLoading(false);
    return; 
   }
   if(password!==confirmpassword)
   {
    toast({
      title:"Passwords Do not match",
      status:"warning",
      duration:5000,
      isClosable:true,
      position:'bottom'
    });
    return;
   }
   try{
    const config={
      headers:{
        "Content-type":"application/json",
      },
    };
          const {data} =await axios.post('/api/user',
          {name,email,password,pic},
          config
          ); 
          toast({
            title:"Registration Successful",
            status:"success",
            duration:5000,
            isClosable:true,
            position:"bottom",
          });
         localStorage.setItem("userInfo",JSON.stringify(data));
         
         setLoading(false);
         history.push("/chats");
   } catch(error)
   {
      //  if any error occurs
      toast({
        title:"error Occured!",
        description:error.response.data.message,
        status:'error',
        duration:5000,
        isClosable:true,
        position:'bottom',
      });
      setLoading(false);
   }

   };

  return (
    <VStack  spacing={'5px'}>
    <FormControl id='first-name' isRequired>
      <FormLabel>Name</FormLabel>
      <Input 
      placeholder={'enter your name'}
      onChange={(e)=>setName(e.target.value)}
      />
    </FormControl>

    <FormControl id='email' isRequired>
      <FormLabel>Email</FormLabel>
      <Input 
      placeholder={'enter your email'}
      onChange={(e)=>setEmail(e.target.value)}
      />
    </FormControl>

    <FormControl id='password' isRequired>
      <FormLabel>Password</FormLabel>
      <InputGroup>
       <Input 
       type={show?'text':'password'} 
      placeholder={'enter your password'}
      onChange={(e)=>setPassword(e.target.value)}
      />
      <InputRightElement width={'4.5rem'}>
        <Button h={'1.75rem'} size='sm' onClick={handleClick}>
            {show ?'Hide':'Show'}
        </Button>
      </InputRightElement>
      </InputGroup>
      
    </FormControl>

     <FormControl id='password' isRequired>
      <FormLabel>Confirm Password</FormLabel>
      <InputGroup>
       <Input 
       type={show?'text':'password'} 
      placeholder={'enter your password'}
      onChange={(e)=>setConfirmpassword(e.target.value)}
      />
      <InputRightElement width={'4.5rem'}>
        <Button h={'1.75rem'} size='sm' onClick={handleClick}>
            {show ?'Hide':'Show'}
        </Button>
      </InputRightElement>
      </InputGroup>
      
    </FormControl>

    <FormControl id='pic'>
      <FormLabel>Upload your Picture</FormLabel>
      <Input
      type='file'
      p={1.5}
      accept='image/*'
      onChange={(e)=> postDetails(e.target.files[0])}
      />
    </FormControl>
    
    <Button colorScheme='blue'
    width={'100%'}
    style={{marginTop:15}}
    onClick={submitHandler}
    isLoading={loading}>
       Sign Up
    </Button>
      


    </VStack>
  )
}

export default Signup