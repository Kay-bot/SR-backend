const Leader = require('../models/leader');
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

    let leader = new Leader();
    leader.name = name;
    leader.slug = slugify(name).toLowerCase();
    leader.title = title;
    leader.body = body;
    leader.mdesc = stripHtml(body.substring(0, 160));
    leader.postedBy = req.user._id;

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: 'Image should be less then 1mb in size',
        });
      }
      leader.photo.data = fs.readFileSync(files.photo.path);
      leader.photo.contentType = files.photo.type;
    }

    leader.save((err, result) => {
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
  Leader.find({}).exec((err, data) => {
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

  Leader.findOne({ slug }).exec((err, data) => {
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

  Leader.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: 'Leader deleted',
    });
  });
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Leader.findOne({ slug }).exec((err, oldLeader) => {
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

      let slugBeforeMerge = oldLeader.slug;
      oldLeader = _.merge(oldLeader, fields, files);
      oldLeader.slug = slugBeforeMerge;

      if (files.photo) {
        if (files.photo.size > 10000000) {
          return res.status(400).json({
            error: 'Image should be less then 1mb in size',
          });
        }
        oldLeader.photo.data = fs.readFileSync(files.photo.path);
        oldLeader.photo.contentType = files.photo.type;
      }

      oldLeader.save((err, result) => {
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
  Leader.findOne({ slug })
    .select('photo')
    .exec((err, leader) => {
      if (err || !leader) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set('Content-Type', leader.photo.contentType);
      return res.send(leader.photo.data);
    });
};
