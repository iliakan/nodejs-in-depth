var http = require('http');
var zlib = require('zlib');
var fs = require('fs');

var server = http.createServer(function(req, res) {
  res.setHeader('content-encoding', 'gzip');
  fs.createReadStream(__filename).pipe(zlib.createGzip()).pipe(res);
});
 

server.listen(3001);