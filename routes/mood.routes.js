import express from 'express';
import {
  deleteMoodOfUser,
  getAllMoods,
  getSingleMood,
  postMood,
} from '../controllers/moodControllers.js';

const router = express.Router();

router.post('/postMood', postMood);
router.get('/getAllMoods/:userId', getAllMoods);
router.get('/getAllMoods/:moodId/:userId', getSingleMood);
router.delete('/deleteMoodOfUser/:moodId', deleteMoodOfUser);

export default router;
