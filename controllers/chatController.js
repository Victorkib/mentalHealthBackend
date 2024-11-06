// controllers/chatController.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import Chat from '../models/chat.js';

const genAI = new GoogleGenerativeAI('AIzaSyB4i1axhlAxUU4fp6_G0Vav3sNMko2P3mU');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const postChat = async (req, res) => {
  try {
    const userId = req.body.userId || 'default-user';
    const message = req.body.message;

    // Find or create a chat document for the user
    let chat = await Chat.findOne({ userId });
    if (!chat) {
      chat = new Chat({ userId, messages: [{ conversation: [] }] });
    }

    // Initialize a new chat session if there are no messages
    let chatSession;
    if (chat.messages.length === 0) {
      chatSession = await model.startChat(); // Start a new chat session
    } else {
      chatSession = await model.startChat(); // Reuse previous session if applicable
    }

    // Send the message to the AI model
    const result = await chatSession.sendMessage(message);
    const aiMessage = result.response.text();

    // Generate a summary title based on the conversation (AI-generated)
    const summaryResult = await chatSession.sendMessage(
      `Please summarize this conversation in one title.: ${aiMessage}`
    );
    const conversationTitle = summaryResult.response.text();

    // Store the user message, AI response, and title in the chat history
    chat.messages[0].conversation.push({
      user: { text: message, sender: 'user' },
      ai: { text: aiMessage, sender: 'AI' },
      title: conversationTitle,
    });

    await chat.save(); // Save the updated chat history

    // Respond with the generated response
    res.json({ response: aiMessage });
  } catch (error) {
    console.error('Error in postChat:', error);
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

// Get a user's chat history
export const getAllChats = async (req, res) => {
  try {
    const userId = req.params.userId || 'default-user';
    const chats = await Chat.find({ userId });

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
