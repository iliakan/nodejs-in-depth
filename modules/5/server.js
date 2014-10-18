// new module type: json

var User = require('./user');

var mojombo = new User("mojombo");

console.log(mojombo.getGithub());