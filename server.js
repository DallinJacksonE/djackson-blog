import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the compiled static files from Vite
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all for React Router (Express 5.0 Safe Syntax)
app.get(['/', '/*splat'], (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Blog server is running on port ${PORT}`);
});
