const  cloudinary_js_config  = require('../config/cloudinary');
const { getReceiverSocketId, io } = require('../config/socket');
const Message = require('../models/Message.models');
const User= require('../models/User')


const getUsersForSideBar= async (req,res)=>{
    try {
        const loggedInUserId= req.user._id;
        const filteredUser=await User.find({_id:{$ne:loggedInUserId}}).select("-password")

        res.status(200).json(filteredUser)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({messgae:"Internal error"})
    }
}

const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const myId=req.user._id;

        const messages=await Message.find({
            $or:[
                {senderId:myId,recieverId:userToChatId},
                {senderId:userToChatId,recieverId:myId}
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log(error.message+ "dikkat");
        res.status(500).json({messgae:"Internal error"})
    }
}

const sendMessage=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:recieverId}=req.params;

        const senderId=req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse= await cloudinary_js_config.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=new Message({
            senderId,
            recieverId,
            text,
            image:imageUrl
        });

        await newMessage.save();

        const receiverSocketId=getReceiverSocketId(recieverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }



        res.status(200).json(newMessage)

    } catch (error) {
        console.log(error.message);
        res.status(500).json({messgae:"Internal error"})
    }
}


module.exports={getUsersForSideBar,getMessages,sendMessage}