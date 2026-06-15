// 首页路由 — 挂载于 /
var express = require('express');
var router = express.Router();

// GET / → 渲染 views/index.ejs 模板
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
