const mongoose = require('mongoose');

const ourTeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      min: 5,
      max: 160,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      min: 5,
      max: 120,
      required: true,
    },
    positionDescription: {
      type: String,
      required: true,
      min: 20,
      max: 300,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OurTeam', ourTeamSchema);
