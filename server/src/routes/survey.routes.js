import express from 'express';
import { createSurvey, getSurveys, getSurveyById, getSurveyByLink } from '../controllers/survey.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createSurvey);
router.get('/', authMiddleware, getSurveys);
router.get('/:id', getSurveyById);
router.get('/link/:link', getSurveyByLink);

export default router;

