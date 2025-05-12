require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // <-- ADD THIS

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { requireAuth } = require('./middlewares/authMiddleware');

const app = express();

// ✅ Enable CORS for frontend (adjust origin as needed)
app.use(cors({
  origin: 'http://localhost:5173', // <-- Your frontend URL (Vite default)
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('<h1>Task App API v1.0</h1>');
});
app.use('/auth', authRoutes);
app.use('/tasks', requireAuth, taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
