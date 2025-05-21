const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const generalInfoSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'Invalid email'],
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: (val) => validator.isMobilePhone(val, 'any'),
      message: 'Invalid phone number',
    }
  },
  address: {
    type: String,
    required: true,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// Only one GeneralInfo allowed
generalInfoSchema.statics.isSingleDocAllowed = async function () {
  const count = await this.countDocuments();
  return count === 0;
};

// Password encryption middleware
generalInfoSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('GeneralInfo', generalInfoSchema);
