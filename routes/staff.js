const express = require('express');
const router = express.Router();
const { create, list, read, remove, update } = require('../controllers/staff');

const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/staff', requireSignin, adminMiddleware, create);
router.get('/staff', list);
router.get('/staff/:slug', read);
router.delete('/staff/:slug', requireSignin, adminMiddleware, remove);
router.put('/staff/:slug', requireSignin, adminMiddleware, update);

module.exports = router;
