function User(name){
  this.name = name;
}

User.prototype.hello = function(who){
  console.log("Hello, " + who.name);
};

var john = new User("John");
var alice = new User("Alice");

john.hello(alice);
