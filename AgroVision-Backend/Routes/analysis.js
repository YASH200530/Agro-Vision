const router = require('express').Router();
const multer = require('multer');
const axios = require('axios');
const verifyToken = require('../middleware/auth');

// store uploaded file in memory as buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // send the image buffer to python backend
    const response = await axios.post(
      'http://localhost:8000/predict',   // your Python backend URL
      {
        image: req.file.buffer.toString('base64')
      }
    );

    return res.status(200).json({
      message: "Prediction successful",
      result: response.data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error processing image", error: err.message });
  }
});

module.exports = router;
