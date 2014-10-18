// CJS module
var User = require('./user');

var john = new User("John");
var alice = new User("Alice");

john.hello(alice);