var fs = require('fs'),
    https = require('https');

function Server (app, port) {
  var httpsOptions = {
    key: fs.readFileSync('./app/secure/key.pem'),
    cert: fs.readFileSync('./app/secure/cert.pem')
  };
  return https.createServer(httpsOptions, app).listen(port);
}

module.exports = Server;