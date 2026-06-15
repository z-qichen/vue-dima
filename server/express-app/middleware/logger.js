var fs = require('fs');
var path = require('path');

var logDir = path.join(__dirname, '..', 'log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

var logStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

function formatTime() {
  var now = new Date();
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  return now.getFullYear() + '-' +
    pad(now.getMonth() + 1) + '-' +
    pad(now.getDate()) + ' ' +
    pad(now.getHours()) + ':' +
    pad(now.getMinutes()) + ':' +
    pad(now.getSeconds());
}

function logger(req, res, next) {
  var startTime = Date.now();
  var timestamp = formatTime();

  var originalJson = res.json;
  var originalSend = res.send;
  var responseBody = null;

  res.json = function (body) {
    responseBody = body;
    return originalJson.apply(this, arguments);
  };

  res.send = function (body) {
    responseBody = body;
    return originalSend.apply(this, arguments);
  };

  res.on('finish', function () {
    var duration = Date.now() - startTime;
    var logEntry = {
      timestamp: timestamp,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      status: res.statusCode,
      duration: duration + 'ms',
      requestBody: req.method !== 'GET' ? JSON.stringify(req.body) : null,
      responseBody: typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody)
    };

    var consoleMsg = [
      '[' + logEntry.timestamp + ']',
      logEntry.method,
      logEntry.url,
      logEntry.status,
      logEntry.duration
    ];
    if (logEntry.requestBody) {
      consoleMsg.push('| body: ' + logEntry.requestBody);
    }
    consoleMsg.push('| resp: ' + (logEntry.responseBody || ''));
    console.log(consoleMsg.join(' '));

    logStream.write(JSON.stringify(logEntry) + '\n');
  });

  next();
}

module.exports = logger;
