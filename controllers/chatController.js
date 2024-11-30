// controllers/chatController.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import Chat from '../models/chat.js';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.geminiApi);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const postChat = async (req, res) => {
  try {
    const { user } = req.body || 'default-user';
    const message = req.body.message;

    if (!user || !message) {
      return res
        .status(400)
        .json({ message: 'User and message are required.' });
    }

    // Find or create a chat document for the user
    let chat = await Chat.findOne({ userId: user.id });
    if (!chat) {
      chat = new Chat({ userId: user.id, messages: [] });
    }

    // Start a new chat session
    const chatSession = await model.startChat();

    // Send the message to the AI model
    const result = await chatSession.sendMessage(message);
    const aiMessage = result.response.text();

    // Generate a summary title based on the conversation (AI-generated)
    const summaryResult = await chatSession.sendMessage(
      `Please summarize this conversation in one title: ${aiMessage}`
    );
    const conversationTitle = summaryResult.response.text();

    // Create a new conversation object
    const newConversation = {
      conversation: [
        {
          user: { text: message, sender: user.firstName },
          ai: { text: aiMessage, sender: 'SerenityAI' },
          title: conversationTitle,
        },
      ],
    };

    // Add the new conversation object to the messages array
    chat.messages.push(newConversation);

    await chat.save(); // Save the updated chat history

    // Retrieve the last added conversation (it will now include the generated _id)
    const createdConversation = chat.messages[chat.messages.length - 1];

    // Respond with the generated response
    res.json({ response: aiMessage, createdConversation });
  } catch (error) {
    console.error('Error in postChat:', error);
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

// Get a user's chat history
export const getAllChats = async (req, res) => {
  try {
    const userId = req.params.userId || 'default-user';
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });

    if (!chats || chats.length === 0) {
      return res.status(404).json({ error: 'Chat history not found' });
    }

    res.json(chats);
  } catch (error) {
    console.error('Error in getAllChats:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// Delete a specific conversation by its ID
export const deleteConversation = async (req, res) => {
  const { userId, conversationId } = req.params; // Assuming userId is passed for verification

  try {
    // Find the chat document for the user
    const chat = await Chat.findOne({ userId });

    // Check if chat exists
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Find the index of the conversation to delete
    const conversationIndex = chat.messages.findIndex((msg) =>
      msg.conversation.some((conv) => conv._id.toString() === conversationId)
    );

    // Check if the conversation exists in the messages
    if (conversationIndex === -1) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Remove the conversation
    chat.messages[conversationIndex].conversation = chat.messages[
      conversationIndex
    ].conversation.filter((conv) => conv._id.toString() !== conversationId);

    // Save the updated chat document
    await chat.save();

    return res
      .status(200)
      .json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get specific conversation history
export const getConvoHistory = async (req, res) => {
  const { userId, conversationId } = req.params;

  try {
    // Find the chat for the given userId
    const chat = await Chat.findOne({ userId: userId });
    if (!chat) {
      return res
        .status(404)
        .json({ message: 'No conversations found for this user' });
    }

    // Find the specific conversation by its _id
    const conversationObject = chat.messages.find(
      (msg) => msg._id.toString() === conversationId
    );

    if (!conversationObject) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    return res.status(200).json(conversationObject);
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Add a new conversation to a specific user's chat
export const addConvoWithRecentHistory = async (req, res) => {
  try {
    const { messageId } = req.params; // The _id of the messages array object
    const { user, message } = req.body;

    // Step 1: Find the chat document for the user
    let chat = await Chat.findOne({ userId: user.id });

    if (!chat) {
      return res
        .status(404)
        .json({ message: 'No chat history found for this user.' });
    }

    // Step 2: Locate the correct messages object by _id
    const targetMessage = chat.messages.find(
      (msg) => msg._id.toString() === messageId
    );

    if (!targetMessage) {
      return res
        .status(404)
        .json({ message: 'No message object found with the given ID.' });
    }

    // Step 3: Extract the last three conversations
    const lastConversations = targetMessage.conversation.slice(-3);

    const recentConversations = lastConversations.map((convo) => ({
      user: convo.user.text,
      ai: convo.ai.text,
      title: convo.title,
    }));

    // Step 4: Format the recent conversations for history
    const historyMessage = `Use the following Recent Conversation History as a reference as you proceed with the user message below: \n${recentConversations
      .map(
        (convo, index) =>
          `\nConversation ${index + 1}:\n- User: ${convo.user}\n- AI: ${
            convo.ai
          }\n- Title: ${convo.title}`
      )
      .join('\n')}`;

    // Step 5: Send history and new message to AI
    const chatSession = await model.startChat();
    const aiResponse = await chatSession.sendMessage(
      `${historyMessage}\n\nNew User Message: ${message}`
    );

    const aiMessage = aiResponse.response.text();

    // Step 6: Generate a conversation title
    const summaryResult = await chatSession.sendMessage(
      `Please summarize this conversation in one title: ${aiMessage}`
    );
    const conversationTitle = summaryResult.response.text();

    // Step 7: Append the new conversation to the conversation array
    targetMessage.conversation.push({
      user: { text: message, sender: user.firstName || 'Anonymous' },
      ai: { text: aiMessage, sender: 'SerenityAI' },
      title: conversationTitle,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await chat.save(); // Save the updated chat document

    // Step 8: Return the AI response and recent history
    res.json({ response: aiMessage, recentHistory: recentConversations });
  } catch (error) {
    console.error('Error in addConvoWithRecentHistory:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
