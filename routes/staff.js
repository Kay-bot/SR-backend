const express = require('express');
const router = express.Router();
const { create } = require('../controllers/staff');

const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/staff', requireSignin, adminMiddleware, create);

module.exports = router;
