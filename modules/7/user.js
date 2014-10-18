var db = require('./db');
var log = require('./log');

function User(name){
  log("user created", name);
  this.name = name;
}

User.prototype.getGithub = function(){
  var record = db.findOne({login: this.name});
  return record ? record.url : null;
};

module.exports = User;
