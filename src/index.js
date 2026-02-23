const express = require('express');
const client = require('prom-client');

const app = express();
const port = 3000;

// Default metrics
client.collectDefaultMetrics();

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
