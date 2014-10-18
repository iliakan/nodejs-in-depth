// global User inside, 
// from the outer code not so obvious where it is defined
require('./user'); 

var john = new User("John");
var alice = new User("Alice");

john.hello(alice);