import express from 'express';
import {
  deleteConversation,
  getAllChats,
  postChat,
} from '../controllers/chatController.js';

const router = express.Router();

router.post('/postChat', postChat);
router.get('/chatHistory/:userId', getAllChats);
router.delete(
  '/deleteConversation/:conversationId/:userId',
  deleteConversation
);

export default router;
