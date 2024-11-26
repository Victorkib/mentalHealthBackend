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

//controller to either post or check if there is one
export const recordLoggedInUser = async (req, res) => {
  const { id, firstName, lastName, name, email, password, profilePicture } =
    req.body;

  // Validate input
  if (!id || !email) {
    return res
      .status(400)
      .json({ message: 'User ID, email, and password are required.' });
  }

  try {
    // Check if the user already exists
    let user = await User.findOne({ userId: id, email });

    if (!user) {
      // Create a new user (triggers pre-save middleware for hashing password)
      user = new User({
        userId: id,
        firstName: firstName || name || null,
        lastName,
        email,
        password, // Will be hashed by the pre-save middleware
        profilePicture,
      });

      await user.save();
      return res.status(201).json(user); // Respond with 201 Created for new user
    }

    // If user exists, respond with their details
    res.status(200).json(user);
  } catch (error) {
    console.error('Error recording logged in user:', error);
    res.status(500).json({
      message: error.message || 'Error recording logged in user!',
    });
  }
};

export const getUserData = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await User.findOne({ userId: uid });
    if (!user) {
      return res.status(404).json({ message: 'No such user found!' });
    }
    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || 'Error fetching user data!' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    //update the user
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updateUser) {
      return res.status(404).json({ message: 'No such user to update!' });
    }
    res.status(200).json(updateUser);
  } catch (error) {
    console.error('Error recording logged in user:', error);
    res.status(500).json({
      message: error.message || 'Error recording logged in user!',
    });
  }
};
