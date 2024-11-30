import Professional from '../models/Professional.js';

// Create a new Professional Profile
export const createProfessional = async (req, res) => {
  try {
    const {
      userId,
      firstName,
      lastName,
      email,
      resume,
      description,
      idFront,
      idBack,
    } = req.body;

    // Validate the required fields
    if (
      !userId ||
      !firstName ||
      !lastName ||
      !email ||
      !resume ||
      !idFront ||
      !idBack
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new professional profile
    const professional = new Professional({
      userId,
      firstName,
      lastName,
      email,
      resume,
      description,
      idFront,
      idBack,
    });

    // Save to the database
    const savedProfessional = await professional.save();

    res.status(201).json({
      message: 'Professional profile created successfully.',
      data: savedProfessional,
    });
  } catch (error) {
    console.error('Error creating professional:', error);
    res.status(500).json({
      message: 'An error occurred while creating the professional profile.',
    });
  }
};

// Fetch all Professionals (optional)
export const getAllProfessionals = async (req, res) => {
  try {
    const professionals = await Professional.find();
    res.status(200).json(professionals);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching professionals.' });
  }
};

// Fetch a single Professional by ID
export const getProfessionalById = async (req, res) => {
  try {
    const { id } = req.params;

    const professional = await Professional.findById(id);

    if (!professional) {
      return res.status(404).json({ message: 'Professional not found.' });
    }

    res.status(200).json(professional);
  } catch (error) {
    console.error('Error fetching professional:', error);
    res.status(500).json({
      message: 'An error occurred while fetching the professional profile.',
    });
  }
};

// Update a Professional (optional)
export const updateProfessional = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProfessional = await Professional.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // Return the updated document
      }
    );

    if (!updatedProfessional) {
      return res.status(404).json({ message: 'Professional not found.' });
    }

    res.status(200).json({
      message: 'Professional profile updated successfully.',
      data: updatedProfessional,
    });
  } catch (error) {
    console.error('Error updating professional:', error);
    res.status(500).json({
      message: 'An error occurred while updating the professional profile.',
    });
  }
};

// Delete a Professional (optional)
export const deleteProfessional = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProfessional = await Professional.findByIdAndDelete(id);

    if (!deletedProfessional) {
      return res.status(404).json({ message: 'Professional not found.' });
    }

    res.status(200).json({
      message: 'Professional profile deleted successfully.',
      data: deletedProfessional,
    });
  } catch (error) {
    console.error('Error deleting professional:', error);
    res.status(500).json({
      message: 'An error occurred while deleting the professional profile.',
    });
  }
};
