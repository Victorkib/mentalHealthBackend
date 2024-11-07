import express from 'express';
import mongoose from 'mongoose';
// import passport from 'passport';
// import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import moodRoutes from './routes/mood.routes.js';
import chartsRoutes from './routes/chat.routes.js';
import './config/passport.js';

const PORT = process.env.PORT || 6500;

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));

// Session setup
// app.use(
//   session({
//     secret: process.env.JWT_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/chats', chartsRoutes);
