import express from 'express';
import {
  addConvoWithRecentHistory,
  deleteConversation,
  getAllChats,
  getConvoHistory,
  postChat,
} from '../controllers/chatController.js';

const router = express.Router();

//post a chat
router.post('/postChat', postChat);

//get all chats for a user
router.get('/chatHistory/:userId', getAllChats);

//get specific conversations of a user
router.get('/getConvoHistory/:userId/:conversationId', getConvoHistory);

//add conversations to a conversation
router.post('/addConversation/:messageId', addConvoWithRecentHistory);

//delete specfic conversation
router.delete(
  '/deleteConversation/:conversationId/:userId',
  deleteConversation
);

export default router;
