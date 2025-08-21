const express =require('express');
const router =express.Router();
const {protect}=require('../middleware/authMiddleware');
const {accessChat,fetchChats,CreateGroupChat} =require('../controllers/chatControllers');
const {renameGroup,addToGroup,removeFromGroup} =require('../controllers/chatControllers');
 


// // to create chat
router.route('/').post(protect,accessChat);
// // to get all the chat from datbase of user
router.route('/').get(protect,fetchChats)
// // to create new group
router.route("/group").post(protect,CreateGroupChat);
// //  to rename the group
router.route("/rename").put(protect,renameGroup);
// // to remove someone or leave the group
router.route("/groupremove").put(protect,removeFromGroup);
// // to add some one to group
router.route("/groupadd").put(protect,addToGroup);

module.exports = router;