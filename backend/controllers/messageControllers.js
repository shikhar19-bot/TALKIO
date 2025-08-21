const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModule");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app=express();

const sendMessage=asyncHandler(async(req,res)=>{

    const {content,chatId}=req.body;
    if(!content || !chatId)
    {
        console.log("Invalid data passed into request");
        
        return res.sendStatus(400);
    }

    var newMesaage={
        sender:req.user._id,
        content:content,
        chat:chatId,
    };

    try {
        var message=await Message.create(newMesaage);
         
        message =await message.populate("sender","name pic");
        message=await message.populate("chat");
          

        // change 
        //  message =await User.populate(message,{
        //     path:"chat.users",
        //     select:"name pic email",
        //  });



   await Chat.findByIdAndUpdate(req.body.chatId,{
    latestMessage:message,
   });
    const log={
    level: "info",
    message: "Message sent successfully",
    timestamp: new Date().toISOString(),
    resourceId: 'sendMessage'+uuidv4(),
    traceId: uuidv4(), // Replace with actual trace ID logic
    spanId: uuidv4() , // Replace with actual span ID logic
    commit: "successh2w",
  };

  // app.post('http://localhost:3001/ingest',JSON.stringify(log));
  fetch('https://log-ingestor-mko8.onrender.com/ingest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(log),
        });
   res.json(message);
        
    } catch (error) {
      const log={
        level: "error",
        message: "Error sending message",
        timestamp: new Date().toISOString(),
        resourceId:'sendMessage'+uuidv4(), // Replace with actual resource ID logic
        traceId: uuidv4(), // Replace with actual trace ID logic
        spanId:  uuidv4(), // Replace with actual span ID logic
        commit: "Failed", // Replace with actual commit message
       
      };
      // app.post('http://localhost:3001/ingest',JSON.stringify(log));
      fetch('https://log-ingestor-mko8.onrender.com/ingest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(log),
        });
        res.status(400);
        throw new Error(error.message);
        
    }


});


const allMessages=asyncHandler(async(req,res)=>{
     try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
      const log={
        level: "info",
        message: "Fetched all messages for chat",
        timestamp: new Date().toISOString(),
        resourceId: 'allmessgae'+uuidv4(), // Replace with actual resource ID logic
        traceId: uuidv4(), // Replace with actual trace ID logic
        spanId: uuidv4(), // Replace with actual span ID logic
        commit: "successchatt", // Replace with actual commit message
        
      };
      // app.post('http://localhost:3001/ingest',JSON.stringify(log));
      fetch('https://log-ingestor-mko8.onrender.com/ingest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(log),
        });
    res.json(messages);
  } catch (error) {
      const log={
      level: "error",
      message: "Error fetching messages",
      timestamp: new Date().toISOString(),
      resourceId: undefined,
      traceId: uuidv4(),
      spanId: uuidv4(),
      commit: "error042", // Replace with actual commit message
    
    };
    // app.post('http://localhost:3001/ingest',JSON.stringify(log));
    fetch('https://log-ingestor-mko8.onrender.com/ingest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(log),
        });
    res.status(400);
    throw new Error(error.message);
  }

})

module.exports={sendMessage,allMessages}; 