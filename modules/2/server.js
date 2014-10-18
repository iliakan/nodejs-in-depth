// try moving the User apart
require('./user');

var john = new User("John");
var alice = new User("Alice");

john.hello(alice);
