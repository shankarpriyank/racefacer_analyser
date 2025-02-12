import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS for all origins during development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Origin']
}));

app.get('/race-data/:username', (req, res) => {
  const { username } = req.params;
  
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

  res.json(mockData);
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Race data server running on port ${PORT}`);
}); 