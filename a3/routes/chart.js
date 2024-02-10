const express = require('express');
const router = express.Router();
const axios = require('axios');

const apiKey = '19d5df6d69ca4e3ea78954d7cd51830c'
const apiUrl = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&country=us`;

router.get('/chart', async (req, res) => {
  try {
    // Fetch data from API
    const response = await axios.get(apiUrl);
    const chartData = response.data;

    // Render the chart with data
    res.render('chart', { chartData });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
