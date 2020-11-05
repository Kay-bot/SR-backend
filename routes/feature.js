const express = require('express');
const router = express.Router();
const {
  create,
  list,
  read,
  remove,
  update,
  photo,
} = require('../controllers/feature');

const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/feature', requireSignin, adminMiddleware, create);
router.get('/feature', list);
router.get('/feature/:slug', read);
router.get('/feature/photo/:slug', photo);
router.delete('/feature/:slug', requireSignin, adminMiddleware, remove);
router.put('/feature/:slug', requireSignin, adminMiddleware, update);

module.exports = router;
