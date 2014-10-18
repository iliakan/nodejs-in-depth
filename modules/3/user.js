function User(name){
  this.name = name;
}

User.prototype.hello = function(who){
  console.log("Hello, " + who.name);
};

// module object (show in console)
// module.exports == exports by default {}
// also can: 
//   exports.User = User
//   this.User = User (but when inside a function, `this` has another meaning, so use exports)

console.log(module);

module.exports = User;
