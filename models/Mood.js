import mongoose from 'mongoose';
const moodSchema = new mongoose.Schema(
  {
    mood: {
      type: String,
    },
    note: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: new Date(),
    },
    uid: {
      type: String,
    },
  },
  { timestamps: true }
);
const Mood = mongoose.model('moods', moodSchema);
export default Mood;
