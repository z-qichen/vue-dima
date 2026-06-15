// JWT 鉴权中间件 — 在需要登录的路由上使用
var jwt = require('jsonwebtoken');

var JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  // 从请求头 Authorization 字段取 token
  var token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ code: 401, message: '未登录' });
  }
  // 去掉 "Bearer " 前缀（标准 JWT 格式：Bearer xxxxx.yyyyy.zzzzz）
  token = token.replace('Bearer ', '');
  // 用密钥验证 token 是否合法、是否过期
  jwt.verify(token, JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).json({ code: 401, message: 'token无效或已过期' });
    }
    // 验证通过 -> 把用户信息挂到 req 上，后续处理器可以直接用
    req.userId = decoded.userId;
    req.username = decoded.username;
    next(); // 放行，进入下一个处理器
  });
}

module.exports = { authMiddleware: authMiddleware, JWT_SECRET: JWT_SECRET };
