import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    user: {
      text: { type: String, required: true },
      sender: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
    ai: {
      text: { type: String, required: true },
      sender: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
    title: { type: String, default: '' },
  },
  { timestamps: true } // This will add createdAt and updatedAt for each conversation
);

const messageSchema = new mongoose.Schema(
  {
    conversation: [conversationSchema],
  },
  { timestamps: true } // This will also add timestamps for each message
);

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    messages: [messageSchema],
  },
  { timestamps: true } // This adds timestamps for the chat document itself
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
