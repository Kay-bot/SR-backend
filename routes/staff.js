const express = require('express');
const router = express.Router();
const {
  create,
  list,
  read,
  remove,
  update,
  photo,
} = require('../controllers/staff');

const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/staff', requireSignin, adminMiddleware, create);
router.get('/allstaff', list);
router.get('/staff/:slug', read);
router.get('/staff/photo/:slug', photo);
router.delete('/staff/:slug', requireSignin, adminMiddleware, remove);
router.put('/staff/:slug', requireSignin, adminMiddleware, update);

module.exports = router;
