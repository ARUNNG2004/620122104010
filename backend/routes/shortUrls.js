import express from 'express';
import {
  createShortUrl,
  redirectToOriginal,
  getShortUrlStats
} from '../controllers/shortUrlController.js';

const router = express.Router();

router.post('/shorturls', createShortUrl);

//api/shorturls/:shortcode
router.get('/shorturls/:shortcode', getShortUrlStats);
router.get('/:shortcode', redirectToOriginal);

export default router;
