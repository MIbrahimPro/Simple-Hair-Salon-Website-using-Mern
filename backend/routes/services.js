const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');

// @desc    List all services
// @route   GET /api/services
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const services = await Service.find();
    res.json(services);
  })
);

// @desc    Create a new service
// @route   POST /api/services
// @access  Admin
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const svc = new Service(req.body);
    await svc.save();
    res.status(201).json(svc);
  })
);

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Admin
router.put(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const svc = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!svc) {
      res.status(404);
      throw new Error('Service not found');
    }
    res.json(svc);
  })
);

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Admin
router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const svc = await Service.findById(req.params.id);
    if (!svc) {
      res.status(404);
      throw new Error('Service not found');
    }
    await svc.remove();
    res.json({ message: 'Service removed' });
  })
);

module.exports = router;
