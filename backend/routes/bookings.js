const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');

// @desc    Book an appointment (public)
// @route   POST /api/bookings
// @access  Public
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const appt = new Appointment(req.body);
    await appt.save();
    res.status(201).json(appt);
  })
);

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Admin
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const all = await Appointment.find().populate('service');
    res.json(all);
  })
);

// @desc    Update only status (admin)
// @route   PUT /api/bookings/:id/status
// @access  Admin
router.put(
  '/:id/status',
  protect,
  asyncHandler(async (req, res) => {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) {
      res.status(404);
      throw new Error('Appointment not found');
    }
    appt.status = req.body.status;
    await appt.save();
    res.json(appt);
  })
);

// @desc    Full update (admin)
// @route   PUT /api/bookings/:id
// @access  Admin
router.put(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!appt) {
      res.status(404);
      throw new Error('Appointment not found');
    }
    res.json(appt);
  })
);

// @desc    Delete a booking (admin)
// @route   DELETE /api/bookings/:id
// @access  Admin
router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) {
      res.status(404);
      throw new Error('Appointment not found');
    }
    await appt.remove();
    res.json({ message: 'Appointment deleted' });
  })
);

module.exports = router;
