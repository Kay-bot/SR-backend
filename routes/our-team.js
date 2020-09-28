const express = require('express');
const router = express.Router();
const { create } = require('../controllers/our-team');

const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/our-team', requireSignin, adminMiddleware, create);

module.exports = router;
