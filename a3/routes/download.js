// routes/download.js
const express = require('express');
const router = express.Router();
const pdf = require('html-pdf');
const ExchangeRate = require('../models/exchangeRate');
const News = require('../models/news');

router.get('/news', async (req, res) => {
    try {
      const newsData = await News.find().sort({ timestamp: 'desc' });
  
      res.render('download/news', { newsData }, (err, html) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }
  
        pdf.create(html).toBuffer((err, buffer) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
  
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
