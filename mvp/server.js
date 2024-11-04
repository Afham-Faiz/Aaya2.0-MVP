const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 3001;

// Endpoint to interact with Rasa
app.post('/webhook', async (req, res) => {
    const { message } = req.body;
    const response = await axios.post(`http://localhost:5005/webhooks/rest/webhook`, {
        sender: 'user',
        message: message,
    });
    res.json(response.data);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
