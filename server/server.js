import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import songRouter from './src/routes/songRoute.js';
import connectDB from './src/config/mongodb.js';
import connectCloudinary from './src/config/cloudinary.js';

// Initialize the app
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Apply middlewares
app.use(express.json());
app.use(cors());

// initializing routes
app.use("/api/song",songRouter)

// Define a simple route
app.get('/', (req, res) => {
    res.send("API Working");
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on ${port}`);
});
