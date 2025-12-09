import express from 'express';
import client from 'prom-client';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3001;

// Resolve __dirname style path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve static dashboard files from /public
app.use(express.static(path.join(__dirname, 'public')));

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Main dashboard page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Prometheus scrape endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.listen(PORT, () => {
    console.log(`Monitor Project is listening on port ${PORT}`);
});