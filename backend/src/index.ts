import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { getQuizQuestions, calculateScore } from './utils/quiz';
import { QuizCheckRequest } from './types/quiz';
import { fetchMarketData } from './services/binance';
import { MarketData } from './types/market';

const app = express();
const server = createServer(app);
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

// Serve static files from client build in production
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));
  
  // Catch-all handler: send back React's index.html file for client-side routing
  app.get('*', (req: Request, res: Response) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api') || req.path.startsWith('/ws')) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// WebSocket server setup
const wss = new WebSocketServer({ server, path: '/ws' });

const clients = new Set<WebSocket>();

wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket client connected');
  clients.add(ws);

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  // Send initial market data when client connects
  fetchMarketData()
    .then((data) => {
      ws.send(JSON.stringify({ type: 'marketData', data }));
    })
    .catch((error) => {
      console.error('Error sending initial market data:', error);
    });
});

// Poll Binance API every 10 seconds and broadcast to all clients
let pollingInterval: NodeJS.Timeout | null = null;

function startPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }

  pollingInterval = setInterval(async () => {
    try {
      const marketData = await fetchMarketData();
      
      // Only broadcast if we have data
      if (marketData.length > 0) {
        // Broadcast to all connected clients
        const message = JSON.stringify({ type: 'marketData', data: marketData });
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      }
    } catch (error) {
      console.error('Error polling market data:', error);
      // Try to send cached data if available
      const cachedData = await fetchMarketData().catch(() => null);
      if (cachedData && cachedData.length > 0) {
        const message = JSON.stringify({ type: 'marketData', data: cachedData });
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      }
    }
  }, 10000); // 10 seconds - increased to reduce rate limiting

  // Fetch immediately on startup
  fetchMarketData()
    .then((data) => {
      const message = JSON.stringify({ type: 'marketData', data });
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    })
    .catch((error) => {
      console.error('Error fetching initial market data:', error);
    });
}

startPolling();

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`WebSocket server is running on ws://localhost:${PORT}/ws`);
});

