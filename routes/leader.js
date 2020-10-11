const express = require('express');
const router = express.Router();
const {
  create,
  list,
  read,
  remove,
  update,
  photo,
} = require('../controllers/leader');

const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/leader', requireSignin, adminMiddleware, create);
router.get('/all-leader', list);
router.get('/leader/:slug', read);
router.get('/leader/photo/:slug', photo);
router.delete('/leader/:slug', requireSignin, adminMiddleware, remove);
router.put('/leader/:slug', requireSignin, adminMiddleware, update);

module.exports = router;
