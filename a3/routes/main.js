const express = require('express');
const router = express.Router();
const News = require('../models/news');
const ExchangeRate = require('../models/exchangeRate');
const { getNewsData, getExchangeRateData } = require('../controllers/apiController');

router.get('/', async (req, res) => {
  try {
    const newsData = await News.find().sort({ timestamp: -1 }).limit(1);

    res.render('main', { newsData});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/exchangeRate', async (req, res) => {
  try {
    const exchangeRateData = await ExchangeRate.find().sort({ timestamp: -1 }).limit(1);

    res.render('exchangeRate', {exchangeRateData });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/refreshDataForNews', async (req, res) => {
  try {
    const userRequest = req.body.userRequest;
    await getNewsData(userRequest);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/refreshDataForExchangeRate', async (req, res) => {
  try {
    const userRequest = req.body.userRequest;
    await getExchangeRateData(userRequest);
    res.redirect('/exchangeRate');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
