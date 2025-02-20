const express= require('express');
const protectRoute = require('../middleware/protectRoute.middleware');
const { getUsersForSideBar, getMessages, sendMessage } = require('../controllers/message.controllers');

const router= express.Router();

router.get("/users",protectRoute,getUsersForSideBar)
router.get("/:id",protectRoute,getMessages)
router.post("/send/:id",protectRoute,sendMessage)



module.exports=router