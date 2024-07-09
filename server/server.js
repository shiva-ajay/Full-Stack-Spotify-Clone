import express from 'express';
import cors from 'cors';
import 'dotenv/config'

// Initialize the app
const app = express();
const port = process.env.PORT || 4000;

// Apply middlewares
app.use(express.json());
app.use(cors());

// Define a simple route
app.get('/', (req, res) => {
    res.send("API Working");
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on ${port}`);
});
