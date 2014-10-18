function User(name){
  this.name = name;
}

User.prototype.hello = function(who){
  console.log("Hello, " + who.name);
};

// a real global is also possible, 
// but due to features of the module system, very rarely used, almost never
global.User = User;
