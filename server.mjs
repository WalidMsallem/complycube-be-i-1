import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import generateTokenHandler from './api/generate-token.js';
import healthHandler from './api/health.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.options('*', cors());

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000', // Local React app
    'https://complycube-i-1.vercel.app', // Deployed React app on Vercel
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


const PORT = process.env.PORT || 5000;

app.post('/api/generate-token', (req, res) => generateTokenHandler(req, res));
app.get('/api/health', (req, res) => healthHandler(req, res));

app.listen(PORT, () => {
  console.log(`Server running locally on http://localhost:${PORT}`);
});
