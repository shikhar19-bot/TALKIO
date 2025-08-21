const asyncHandler=require('express-async-handler');
const User= require('../models/userModel');
const generateToken= require('../config/generateToken');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app=express();

const registerUser =asyncHandler(async(req,res)=>{
    const {name ,email,password ,pic}=req.body;

    if(!name || !email || !password)
    {
        const log= {
            level: 'error',
            message: 'Invalid registration data',
            timestamp: new Date().toISOString(),
            resourceId: 'invalid23',
            traceId:uuidv4(),
            spanId:uuidv4(),
            commit: 'Updatedinvalid',
           
          };
          fetch('https://log-ingestor-mko8.onrender.com/ingest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(log),
        });

        res.status(400);
        throw new Error('Please Enter all the Fields')
    }

    const userExists =await User.findOne({email:email});

    if(userExists)
    {
        const log={
            level: 'error',
            message: 'User already exists',
            resourceId:'userExist'+uuidv4(),
            timestamp: new Date().toISOString(),
            traceId:uuidv4(),
            spanId:uuidv4(),
            commit: 'exists2t671',
            
          };
        // app.post('http://localhost:3001/ingest',JSON.stringify(log));
        fetch('https://log-ingestor-mko8.onrender.com/ingest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(log),
        })
        res.status(400);
        throw new Error('user already exist');
    }

    const user =User({
        name,
        email,
        password,
        pic,

    });
    // change
     await user.save()
    if(user)
{     
    
    const log= {
        level: 'info',
        message: 'User registered successfully',
        timestamp: new Date().toISOString(),
        resourceId: 'usercontrol'+uuidv4(),
        traceId: uuidv4(), // Replace with actual trace ID logic
        spanId: uuidv4(), // Replace with actual span ID logic
        commit: 'register6728',

      };
      fetch('https://log-ingestor-mko8.onrender.com/ingest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
    });
  
    res.status(201).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        password:user.password,
        pic:user.pic,
        token:generateToken(user._id)
    });

}
else{
    const log={
        level: 'error',
        message: 'Failed to create new user',
        timestamp: new Date().toISOString(),
        resourceId: undefined, // Replace with actual resource ID logic
        traceId: uuidv4(), // Replace with actual trace ID logic
        spanId: uuidv4(), // Replace with actual span ID logic
        commit: 'Failed672',
        
      };
      fetch('https://log-ingestor-mko8.onrender.com/ingest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
    });
    res.status(400);
    throw new Error("Failed to create new user")
}

});

const authUser =asyncHandler(async(req,res)=>{
    const {email,password}=req.body;

    const user =await User.findOne({email:email});

    if(user && (await user.matchPassword(password)))
    {
        const log= {
            level: 'info',
            message: 'User authenticated successfully',
            timestamp: new Date().toISOString(),
            resourceId:'match'+uuidv4(),
            traceId: uuidv4(), // Replace with actual trace ID logic
            spanId: uuidv4(), // Replace with actual span ID logic
            commit: 'authenticated35465',
           
          };
          fetch('https://log-ingestor-mko8.onrender.com/ingest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(log),
        });
        res.json({
             _id:user._id,
        name:user.name,
        email:user.email,
        password:user.password,
        pic:user.pic,
        token:generateToken(user._id)
        })
    }
    else{
       const log= {
            level: 'error',
            message: 'Invalid id or password',
            resourceId:undefined,
            timestamp: new Date().toISOString(),
            traceId:uuidv4(),
            spanId:uuidv4(),
            commit: 'invalid oiuy4567',
          
          };
          fetch('https://log-ingestor-mko8.onrender.com/ingest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(log),
        })
    


        //  app.post('http://localhost:3002/ingest',log);
    res.status(400);
    throw new Error("Invalid id or password")
}

});
// /api/user?search=Raj
const allUsers= asyncHandler(async (req,res)=>{
    const keyword=req.query.search?{
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}},
        ],
    }
    :{}
    // change from find
    const users =await User.find(keyword).find({_id: {$ne: req.user._id}});
     const log= {
        level: 'info',
        message: 'Fetched all users',
        resourceId:'user'+uuidv4(),
        timestamp: new Date().toISOString(),
        traceId:uuidv4(),
        spanId:uuidv4(),
        commit: 'Fetched23e8',
     
      };
    //   app.post('http://localhost:3001/ingest',JSON.stringify(log));

    fetch('https://log-ingestor-mko8.onrender.com/ingest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
    })
    res.send(users)

   
})



module.exports={registerUser ,authUser,allUsers };
