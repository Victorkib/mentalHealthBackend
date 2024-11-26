// routes/auth.routes.js
import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  recordLoggedInUser,
  getUserData,
  updateUser,
  //   googleCallback,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/recordLoggedInUser', recordLoggedInUser);
router.get('/getUserData/:uid', getUserData);
router.patch('/updateUser/:id', updateUser);
router.post('/login', login);
// router.get(
//   '/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );
// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   googleCallback
// );

export default router;
