const express = require('express');
const router = express.Router();
const { subscribeNewsletter } = require('../controllers/miscControllers');

router.post('/subscribe', subscribeNewsletter);

module.exports = router;
