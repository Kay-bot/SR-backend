const Staff = require('../models/staff');
const formidable = require('formidable');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not upload',
      });
    }

    const { name, title, body } = fields;

    if (!name || name.length === 0) {
      return res.status(400).json({
        error: 'name is required',
      });
    }

    if (!title || !title.length) {
      return res.status(400).json({
        error: 'title is required',
      });
    }

    if (!body || body.length < 20) {
      return res.status(400).json({
        error: 'Content is too short',
      });
    }

    let staff = new Staff();
    staff.name = name;
    staff.title = title;
    staff.body = body;
    staff.postedBy = req.user._id;

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: 'Image should be less then 1mb in size',
        });
      }
      staff.photo.data = fs.readFileSync(files.photo.path);
      staff.photo.contentType = files.photo.type;
    }

    staff.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};
