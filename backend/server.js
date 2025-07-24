import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import shortUrlRoutes from './routes/shortUrls.js';
import { logger } from './middleware/logger.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/', shortUrlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
