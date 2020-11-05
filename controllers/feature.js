const Feature = require('../models/feature');
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

    const { title, body } = fields;

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

    let feature = new Feature();
    feature.title = title;
    feature.slug = slugify(title).toLowerCase();
    feature.body = body;
    feature.mdesc = stripHtml(body.substring(0, 160));
    feature.postedBy = req.user._id;

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: 'Image should be less then 1mb in size',
        });
      }
      feature.photo.data = fs.readFileSync(files.photo.path);
      feature.photo.contentType = files.photo.type;
    }

    feature.save((err, result) => {
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
  Feature.find({}).exec((err, data) => {
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

  Feature.findOne({ slug }).exec((err, data) => {
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

  Feature.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: 'Feature deleted',
    });
  });
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Feature.findOne({ slug }).exec((err, oldFeature) => {
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

      let slugBeforeMerge = oldFeature.slug;
      oldFeature = _.merge(oldFeature, fields, files);
      oldFeature.slug = slugBeforeMerge;

      if (files.photo) {
        if (files.photo.size > 10000000) {
          return res.status(400).json({
            error: 'Image should be less then 1mb in size',
          });
        }
        oldFeature.photo.data = fs.readFileSync(files.photo.path);
        oldFeature.photo.contentType = files.photo.type;
      }

      oldFeature.save((err, result) => {
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
  Feature.findOne({ slug })
    .select('photo')
    .exec((err, staff) => {
      if (err || !staff) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set('Content-Type', feature.photo.contentType);
      return res.send(feature.photo.data);
    });
};
