const express = require('express');
const router = express.Router();
const {
  create,
  list,
  read,
  remove,
  update,
  photo,
} = require('../controllers/supportTeam');

const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/support-team', requireSignin, adminMiddleware, create);
router.get('/all-support-team', list);
router.get('/support-team/:slug', read);
router.get('/support-team/photo/:slug', photo);
router.delete('/support-team/:slug', requireSignin, adminMiddleware, remove);
router.put('/support-team/:slug', requireSignin, adminMiddleware, update);

module.exports = router;
