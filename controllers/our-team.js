const OurTeam = require('../models/our-team');
exports.create = (req, res) => {
  const { name, title, positionDescription } = req.body;

  let ourTeam = new OurTeam({ name, title, positionDescription });

  ourTeam.save((err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data, message: 'Member created' });
  });
};
