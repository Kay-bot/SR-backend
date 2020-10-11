const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const leaderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      min: 3,
      max: 100,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true,
    },
    body: {
      type: {},
      required: true,
      min: 20,
      max: 2000000,
    },
    mdesc: {
      type: {},
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    postedBy: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leader', leaderSchema);
