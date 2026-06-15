// 第4步：Express 应用主文件 — 注册中间件、路由、错误处理

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var db = require('./db'); // 启动时连接 MongoDB
var logger = require('./middleware/logger');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var surveyRouter = require('./routes/survey');
var uploadRouter = require('./routes/upload');

var app = express();

// 设置模板引擎（EJS）
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 全局中间件 — 每个请求都会按注册顺序依次经过这里
app.use(logger);                               // 自定义详细日志（请求+响应）
app.use(cors());                              // 跨域处理
app.use(express.json());                      // 解析 JSON 请求体 → req.body
app.use(express.urlencoded({ extended: false })); // 解析表单请求体
app.use(cookieParser());                      // 解析 Cookie → req.cookies
app.use(express.static(path.join(__dirname, 'public'))); // 静态文件
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'))); // 上传图片访问

// 第6步：路由挂载 — URL 前缀匹配后进入对应子路由
app.use('/', indexRouter);      // 匹配 GET / → 渲染首页
app.use('/users', usersRouter); // 匹配 GET /users
app.use('/api/upload', uploadRouter); // 匹配 /api/upload（图片上传，须在 /api 之前）
app.use('/api', apiRouter);     // 匹配 /api/register、/api/login、/api/user/info
app.use('/api/survey', surveyRouter); // 匹配 /api/survey（问卷CRUD，需登录）

// 第7步：404 — 上面所有路由都没匹配到时走这里
app.use(function(req, res, next) {
  next(createError(404));
});

// 第8步：全局错误处理 — 任何地方调用 next(err) 最终都会到这里
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error'); // 渲染 views/error.ejs
});

module.exports = app;
