// new module type: directory
// module is cached!

// start with db here, then use in User (show caching)
var db = require('./db');
db.connect('github');

var User = require('./user');

var mojombo = new User("mojombo");

console.log(mojombo.getGithub());