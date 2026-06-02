const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// @desc    Upload single image
// @route   POST /api/upload
// @access  Admin
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.json({
    success: true,
    url: req.file.path,
    publicId: req.file.filename,
  });
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Admin
router.post('/multiple', protect, admin, upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  const urls = req.files.map((file) => ({ url: file.path, publicId: file.filename }));
  res.json({ success: true, images: urls });
});

module.exports = router;
