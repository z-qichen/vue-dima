// 用户路由（演示） — 挂载于 /users
var express = require('express');
var router = express.Router();

// GET /users → 直接返回文本
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
