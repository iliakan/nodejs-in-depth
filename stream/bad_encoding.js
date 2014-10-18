// never ever use chunk.toString('utf-8')
// will cut character

var fs = require('fs');

var r = fs.createReadStream('lala', {highWaterMark: 3});

var result = "";
r.on('data', function(chunk) {
  result += chunk.toString('utf-8');
});

r.on('end', function() {
  console.log(result);
});
