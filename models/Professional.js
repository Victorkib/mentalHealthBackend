import mongoose from 'mongoose';

const ProfessionalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    resume: {
      type: String, // URL of the resume in Cloudinary
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    idFront: {
      type: String, // URL of the front of ID in Cloudinary
      required: true,
    },
    idBack: {
      type: String, // URL of the back of ID in Cloudinary
      required: true,
    },
    status: {
      type: Boolean,
      default: false, // Default to not verified
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Professional = mongoose.model('Professional', ProfessionalSchema);

export default Professional;