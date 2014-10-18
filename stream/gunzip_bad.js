var fs = require('fs');
var zlib = require('zlib');

// error may be here (no file?)
var fileStream = fs.createReadStream('bad.gz');

// error may be here (corrupted file?)
var gzipStream = zlib.createGunzip();

fileStream.pipe(gzipStream).pipe(process.stdout);

fileStream.on('error', function(e) {
  console.log("file", e);
});

gzipStream.on('error', function(e) {
  console.log("gzip", e);
});