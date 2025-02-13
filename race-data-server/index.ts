import express from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';

const app = express();

app.use(cors()); // This will allow all origins without restrictions

app.get('/race-data/:username', (req, res) => {
  const { username } = req.params;
  console.log(`Received request for username: ${username}`);
  
  // Mock data for testing - replace this with your actual data fetching logic
  const mockData = {
    profile_info: {
      username: username,
      total_races: 5,
      best_position: 1,
      worst_position: 10,
      average_position: 4.5
    },
    races_data: [
      {
        race_id: "race1",
        position: 1,
        date: "2024-03-10",
        track: "Silverstone",
        car: "Mercedes",
        lap_times: Array.from({ length: 10 }, (_, i) => [i + 1, 80 + Math.random() * 5])
      },
      // Add more mock races as needed
    ]
  };

  res.setHeader('Content-Type', 'application/json');
  res.json(mockData);
});

const PORT = 8000;

// For production, you'll need proper SSL certificates
const options = {
  key: fs.readFileSync('path/to/your/key.pem'),
  cert: fs.readFileSync('path/to/your/cert.pem')
};

https.createServer(options, app).listen(PORT, 'localhost', () => {
  console.log(`Race data server running on https://localhost:${PORT}`);
}); 