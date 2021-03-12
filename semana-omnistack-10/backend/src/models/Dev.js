const mongose = require('mongoose');
const PointSchema = require('./utils/PointSchema');

const DevSchema = new mongose.Schema({
  name: String,
  github_username: String,
  bio: String,
  avatar_url: String,
  techs: [String],
  location: {
    type: PointSchema,
    index: '2dsphere'
  },
});

module.exports = mongose.model('Dev', DevSchema);