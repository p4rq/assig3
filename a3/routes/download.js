// routes/download.js
const express = require('express');
const router = express.Router();
const pdf = require('html-pdf');
const ExchangeRate = require('../models/exchangeRate');
const News = require('../models/news');

// Route to download historical exchange rate data as PDF
router.get('/news', async (req, res) => {
    try {
      const newsData = await News.find().sort({ timestamp: 'desc' });
  
      // Render EJS template for news data
      res.render('download/news', { newsData }, (err, html) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }
  
        // Generate PDF
        pdf.create(html).toBuffer((err, buffer) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
  
          // Send PDF as response
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=newsData.pdf');
          res.send(buffer);
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  module.exports = router;

// Route to download historical news data as PDF
router.get('/news', async (req, res) => {
  try {
    const newsData = await News.find().sort({ timestamp: 'desc' });

    // Render EJS template for news data
    res.render('download/news', { newsData });

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
