const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middlewire
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('ema john server')
})

app.listen(port, () => {
  console.log(`ema John server is running on port: ${port}`);
})