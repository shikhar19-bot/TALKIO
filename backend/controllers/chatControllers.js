const asyncHandler=require('express-async-handler');
const Chat =require('../models/chatModel');
const User = require('../models/userModel');
const {v4:uuidv4}=require('uuid');
const express = require('express');
const app=express();


const accessChat = asyncHandler(async(req,res)=> {
    const { userId} =req.body;

    if(!userId)
    {
        console.log('UserId params not sent with request');
        var randomValue = Math.floor(Math.random() * 9) + 1;
        const log={
            level :'error',
            message:'userid doest not exist',
            timestamp: new Date().toISOString(),
            resourceId:'invaliduser'+uuidv4(),
            traceId:uuidv4(),
            spanId:uuidv4(),
            commit:'error in sending2893',
        };
        // app.post('http://localhost:3001/ingest',JSON.stringify(log));
        // direct add karna h idhar
        fetch('https://log-ingestor-mko8.onrender.com/ingest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(log),
        });
        return res.sendStatus(400);
    }

    var isChat =await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch :{$eq: req.user._id}}},
            {users:{$elemMatch :{$eq: userId}}},
        ],
    }).populate("users","-password").populate("latestMessage");

    isChat =await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name pic email",
    });

    if(isChat.length>0)
    {
        res.send(isChat[0]);
    }
    else
    {
        var chatData ={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId],
        };

        try{
            const createdChat = await Chat.create(chatData);

            const FullChat =await Chat.findOne({_id:createdChat._id}).populate("users","-password");
            const log={
                level: 'info',
                message: 'Chat created successfully',
                timestamp: new Date().toISOString(),
                resourceId: 'createdchat'+uuidv4(),
                traceId: uuidv4(),
                spanId: uuidv4(),
                commit: 'Chat creation commit log',
              
            };
            // app.post('http://localhost:3001/ingest',JSON.stringify(log));
            fetch('https://log-ingestor-mko8.onrender.com/ingest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(log),
        });
            res.status(200).json(FullChat);
        }
        catch(error){
           const log= {
                level: 'error',
                message: 'error.message',
                timestamp: new Date().toISOString(),
                resourceId: 'erro'+uuidv4(),
                traceId: uuidv4(),
                spanId: uuidv4(),
                commit:'error6790',
                
              };
            //   app.post('http://localhost:3001/ingest',JSON.stringify(log));
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
        
    }
    

});

const fetchChats =asyncHandler(async(req,res)=>{
    try{
        const log= {
            level: 'info',
            message: 'fetchChatsChat successfully',
            resourceId:'fetch'+uuidv4(),
            timestamp: new Date().toISOString(),
            traceId: uuidv4(), // Include the traceId in the log entry
            spanId: uuidv4(),
            commit: 'fetchsuc13439',
       
            
          };
        //   app.post('http://localhost:3001/ingest',JSON.stringify(log));
        fetch('https://log-ingestor-mko8.onrender.com/ingest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(log),
        });
           Chat.find({users:{$elemMatch: {$eq: req.user._id}}}).
           populate("users","-password")
           .populate("groupAdmin","-password")
           .populate("latestMessage")
             .sort({updatedAt:-1})
             .then(async(results)=>{
                results =await User.populate(results,{
                      path:"latestMessage.sender",
                       select:"name pic email",
                  });
                  res.status(200).send(results);
             })
             
              

         
           
    }
    catch(error){
      const log= {
            level: 'error',
            message: 'fetchChatsChats error',
            resourceId: 'fetch'+uuidv4(),
            traceId: uuidv4(), // Include the traceId in the log entry
            spanId:  uuidv4(),
            commit: 'failded23',
            timestamp: new Date().toISOString(),
            
          };
        //   app.post('http://localhost:3001/ingest',JSON.stringify(log));
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

const CreateGroupChat=asyncHandler(async(req,res)=>{
     if(!req.body.users || !req.body.name)
     {
        return res.status(400).send({message:"Please fill all the fields"});
     }

     var users=JSON.parse(req.body.users);
       if(users.length<2)
       {
        return res
        .status(400)
        .send("More Than 2 users are required to fom a group")
       }

    //    while creating grp chat we need all users along with login one

    users.push(req.user);

    // we need query  to database
    try {
        const groupChat =await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        });
        // fetch this grp chat from database and send it to user

        const fullGroupChat =await Chat.findOne({_id:groupChat._id})
          .populate("users","-password")
           .populate("groupAdmin","-password");



        res.status(200).json(fullGroupChat);


    } catch (error) {
        res.status(400);
         throw new Error(error.message);
    }

});

const renameGroup =asyncHandler(async(req,res)=>{
        const {chatId,chatName}=req.body;
        const updatedChat= await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName,
            },
            {
                new:true,
            }
        )
        .populate("users","-password")
           .populate("groupAdmin","-password");


        if(!updatedChat)
        {
            res.status(404);
            throw new Error('Chat Not Found');
        }   
        else{
            res.json(updatedChat)
        }

});

const addToGroup =asyncHandler(async(req,res)=>{
    // we need two thing the chhatid and userid which we want to add
    const {chatId,userId}=req.body;
    const added= await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId},
    },
    {
        new:true
    }).populate("users","-password")
           .populate("groupAdmin","-password");

           if(!added)
           {
            res.status(404);
            throw new Error("Chat Not Found");
           }
           else
           {
            res.json(added);
           }

});



const removeFromGroup =asyncHandler(async(req,res)=>{
    // we need two thing the chhatid and userid which we want to add
    const {chatId,userId}=req.body;
    const removed = await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId},
    },
    {
        new:true
    }).populate("users","-password")
           .populate("groupAdmin","-password");

           if(!removed)
           {
            res.status(404);
            throw new Error("Chat Not Found");
           }
           else
           {
            res.json(removed);
           }

});

module.exports={accessChat ,fetchChats,CreateGroupChat,renameGroup,addToGroup,removeFromGroup};