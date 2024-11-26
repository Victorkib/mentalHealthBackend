import express from 'express';
import {
  createProfessional,
  getAllProfessionals,
  getProfessionalById,
  updateProfessional,
  deleteProfessional,
} from '../controllers/professionalController.js';

const router = express.Router();

router.post('/postProfessional', createProfessional); // Create a new professional
router.get('/getProfessionals', getAllProfessionals); // Get all professionals
router.get('/getProfessional/:id', getProfessionalById); // Get a professional by ID
router.put('/updateProfessional/:id', updateProfessional); // Update a professional
router.delete('/deleteProfessional/:id', deleteProfessional); // Delete a professional

export default router;
