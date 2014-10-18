var db = require('./db');
db.connect('github');

var User = require('./user');

var mojombo = new User("mojombo");

console.log(mojombo.getGithub());