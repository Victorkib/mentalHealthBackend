// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register a new user
export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const user = new User({ email, password });
    await user.save();
    console.log('we are sending back a response1!');
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    console.log('we are sending back a response2!');
    return res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

// Google OAuth callback
// export const googleCallback = async (req, res) => {
//   const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
//     expiresIn: '1d',
//   });
//   res.redirect(`myapp://login?token=${token}`); // Replace with your app's deep link
// };
