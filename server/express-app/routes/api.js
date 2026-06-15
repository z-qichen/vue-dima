// API 路由 — 挂载于 /api，核心业务逻辑
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/User');
var auth = require('../middleware/auth');

// POST /api/register — 注册
router.post('/register', async function (req, res, next) {
  try {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
      return res.json({ code: 400, message: '用户名和密码不能为空' });
    }
    if (password.length < 6) {
      return res.json({ code: 400, message: '密码长度不能少于6位' });
    }

    var existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.json({ code: 400, message: '用户名已存在' });
    }

    var newUser = new User({ username: username, password: password });
    await newUser.save();
    res.json({ code: 200, message: '注册成功' });
  } catch (err) {
    next(err);
  }
});

// POST /api/login — 登录
router.post('/login', async function (req, res, next) {
  try {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
      return res.json({ code: 400, message: '用户名和密码不能为空' });
    }

    var user = await User.findOne({ username: username });
    if (!user) {
      return res.json({ code: 401, message: '用户名或密码错误' });
    }

    var isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.json({ code: 401, message: '用户名或密码错误' });
    }

    var token = jwt.sign(
      { userId: user._id, username: user.username },
      auth.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token: token,
        username: user.username
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/user/info — 获取当前用户信息（需登录，authMiddleware 验证 JWT）
router.get('/user/info', auth.authMiddleware, function (req, res, next) {
  // authMiddleware 已将 userId 和 username 挂到 req 上
  res.json({
    code: 200,
    data: {
      userId: req.userId,
      username: req.username
    }
  });
});




module.exports = router;
