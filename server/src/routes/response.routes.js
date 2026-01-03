import express from 'express';
import { submitResponse } from '../controllers/response.controller.js';

const router = express.Router();

router.post('/', submitResponse);

export default router;

