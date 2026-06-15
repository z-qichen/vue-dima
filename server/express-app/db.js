// 启动时执行：Mongoose 连接本地 MongoDB 数据库
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/express-app');

var db = mongoose.connection;

db.on('error', console.error.bind(console, '连接失败:'));
db.once('open', function () {
  console.log('MongoDB 连接成功');
});

module.exports = db;
