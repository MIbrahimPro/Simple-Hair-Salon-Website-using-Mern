// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const servicesRouter = require('./routes/services');
const bookingsRouter = require('./routes/bookings');
const generalRouter = require('./routes/general');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

//─── Environment Config ────────────────────────────────────────────────────────
const {
  MONGO_URI = 'mongodb://localhost:27017/hairsalon',
  PORT = 5000,
  NODE_ENV = 'development',
  UPLOAD_DIR = 'uploads',
} = process.env;

//─── Body Parser ────────────────────────────────────────────────────────────────
app.use(express.json());

//─── MongoDB Connection ─────────────────────────────────────────────────────────
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

//─── Multer Upload Setup ─────────────────────────────────────────────────────────
const uploadPath = path.join(__dirname, UPLOAD_DIR);
// ensure upload dir exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    // unique filename: timestamp-originalname
    const name = `${Date.now()}-${file.originalname}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

// Generic upload endpoint for before/after images
// expects fields: beforeImage, afterImage
app.post(
  '/api/upload',
  upload.fields([
    { name: 'beforeImage', maxCount: 1 },
    { name: 'afterImage', maxCount: 1 },
  ]),
  (req, res) => {
    // return paths for service creation/update
    const files = {};
    if (req.files.beforeImage) files.beforeImage = `${UPLOAD_DIR}/${req.files.beforeImage[0].filename}`;
    if (req.files.afterImage)  files.afterImage  = `${UPLOAD_DIR}/${req.files.afterImage[0].filename}`;
    res.status(201).json(files);
  }
);

// serve uploaded files statically
app.use(`/${UPLOAD_DIR}`, express.static(uploadPath));

//─── Serve Frontend Build If Exists ─────────────────────────────────────────────
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  // for any other route, serve index.html
  app.get('*', (req, res, next) => {
    // skip API routes
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

//─── Mount API Routes ───────────────────────────────────────────────────────────
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/general', generalRouter);

//─── Error Handler (last middleware) ────────────────────────────────────────────
app.use(errorHandler);

//─── Start Server ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${NODE_ENV} on port ${PORT}`);
});
