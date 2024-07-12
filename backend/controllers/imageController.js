const uploadImageHandler = (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      res.json({
        success: true,
        url: imageUrl,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Image upload failed',
        error: err.message,
      });
    }
  };
  
  module.exports = { uploadImageHandler };
  