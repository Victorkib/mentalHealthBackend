import Mood from '../models/Mood.js';

//post a mood
export const postMood = async (req, res) => {
  const { mood, note, timestamp, uid } = req.body;
  if (!mood || !timestamp || !uid) {
    return res.status(404).json({ message: 'Relavant fields must be filled!' });
  }
  try {
    const postMood = await Mood.create({ mood, note, timestamp, uid });
    if (!postMood) {
      return res.status(404).json({ message: 'Error posting Mood!' });
    }
    return res.status(200).json(postMood);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Server Error' });
  }
};

//get all moods
export const getAllMoods = async (req, res) => {
  const { userId } = req.params;
  try {
    const moodsOfUser = await Mood.find({ uid: userId }).sort({
      createdAt: -1,
    });
    // console.log('moodsOfUser: ', moodsOfUser);
    if (!moodsOfUser) {
      return res.status(400).json({ message: 'No moods found!' });
    }
    return res.status(200).json(moodsOfUser);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

//get a single mood of user
export const getSingleMood = async (req, res) => {
  const { moodId, userId } = req.params;
  try {
    const moodofUser = await Mood.findOne({ uid: userId, _id: moodId });
    if (!moodofUser) {
      return res.status(404).json({ message: 'No mood found!' });
    }
    return res.status(200).json(moodofUser);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

//delete mood of user
export const deleteMoodOfUser = async (req, res) => {
  const { moodId } = req.params;
  try {
    const moodDeleted = await Mood.findByIdAndDelete(moodId);
    if (!moodDeleted) {
      return res.status(404).json({ message: 'No mood found to delete!' });
    }
    return res.status(200).json(moodDeleted);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};
