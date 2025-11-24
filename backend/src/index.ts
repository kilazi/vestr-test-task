import express, { Request, Response } from 'express';
import cors from 'cors';
import { getQuizQuestions, calculateScore } from './utils/quiz';
import { QuizCheckRequest } from './types/quiz';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express backend 1!' });
});

// Quiz endpoints
app.get('/api/quiz', (req: Request, res: Response) => {
  try {
    const questions = getQuizQuestions();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ error: 'Failed to fetch quiz questions' });
  }
});

app.post('/api/quiz/check', (req: Request, res: Response) => {
  try {
    const body: QuizCheckRequest = req.body;
    
    if (!body.answers || typeof body.timeElapsed !== 'number') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const result = calculateScore(body.answers, body.timeElapsed);
    res.json(result);
  } catch (error) {
    console.error('Error checking quiz:', error);
    res.status(500).json({ error: 'Failed to check quiz' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

