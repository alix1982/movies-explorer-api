const mongoose = require('mongoose');
const { email } = require('../utils/regulatoryExpression');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: email,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);
