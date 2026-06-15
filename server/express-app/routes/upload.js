var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var Image = require('../models/Image');

var uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// POST /api/upload
router.post('/', upload.single('image'), async function (req, res, next) {
  try {
    if (!req.file) {
      return res.json({ code: 400, message: '请选择要上传的图片' });
    }

    var imageUrl = '/uploads/' + req.file.filename;

    var image = new Image({
      filename: req.file.filename,
      imageUrl: imageUrl,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
    await image.save();

    res.json({
      code: 200,
      message: '图片上传成功',
      data: {
        _id: image._id,
        imageUrl: imageUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
