var http = require('http');
var zlib = require('zlib');
var fs = require('fs');

var gzip = zlib.createGzip();
var inStream = fs.createReadStream(__filename, {highWaterMark: 100});
var outStream = fs.createWriteStream(__filename + '.gz');

inStream.on('data', function(data) {
  console.log(data)
});

// will not happen every chunk (cause of data)
// will happen once (the last time)
inStream.on('readable', function() {
  console.log('.');
});

inStream.pipe(gzip).pipe(outStream);

