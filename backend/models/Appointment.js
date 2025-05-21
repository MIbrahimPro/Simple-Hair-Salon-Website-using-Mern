const mongoose = require('mongoose');
const validator = require('validator');

const appointmentSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    validate: {
      validator: (val) => val === '' || validator.isEmail(val),
      message: 'Invalid email',
    },
    default: '',
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: (val) => validator.isMobilePhone(val, 'any'),
      message: 'Invalid phone number',
    }
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: (val) => val > new Date(),
      message: 'Appointment date must be in the future',
    },
  },
  time: {
    type: String,
    required: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM 24-hour format'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
