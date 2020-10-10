const SupportTeam = require('../models/supportTeam');
const formidable = require('formidable');
const slugify = require('slugify');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const stripHtml = require('string-strip-html');
// const { smartTrim } = require('../helpers/staff');

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

    if (!body || body.length === 0) {
      return res.status(400).json({
        error: 'Contend is required',
      });
    }

    let supportTeam = new SupportTeam();
    supportTeam.name = name;
    supportTeam.slug = slugify(name).toLowerCase();
    supportTeam.title = title;
    supportTeam.body = body;
    supportTeam.mdesc = stripHtml(body.substring(0, 160));
    supportTeam.postedBy = req.user._id;

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: 'Image should be less then 1mb in size',
        });
      }
      supportTeam.photo.data = fs.readFileSync(files.photo.path);
      supportTeam.photo.contentType = files.photo.type;
    }

    supportTeam.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

exports.list = (req, res) => {
  SupportTeam.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  SupportTeam.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  SupportTeam.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: 'Staff deleted',
    });
  });
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  SupportTeam.findOne({ slug }).exec((err, oldStaff) => {
    if (err) {
      return res.status(400).json({
        error: 'errorHandler(err)',
      });
    }

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: 'Image could not upload',
        });
      }

      let slugBeforeMerge = oldStaff.slug;
      oldStaff = _.merge(oldStaff, fields, files);
      oldStaff.slug = slugBeforeMerge;

      if (files.photo) {
        if (files.photo.size > 10000000) {
          return res.status(400).json({
            error: 'Image should be less then 1mb in size',
          });
        }
        oldStaff.photo.data = fs.readFileSync(files.photo.path);
        oldStaff.photo.contentType = files.photo.type;
      }

      oldStaff.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(result);
      });
    });
  });
};

exports.photo = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  SupportTeam.findOne({ slug })
    .select('photo')
    .exec((err, staff) => {
      if (err || !supportTeam) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set('Content-Type', supportTeam.photo.contentType);
      return res.send(supportTeam.photo.data);
    });
};
