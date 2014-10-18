var db = require('./db');

function User(name){
  this.name = name;
}

User.prototype.getGithub = function(){
  var record = db.findOne({login: this.name});
  return record ? record.url : null;
};

module.exports = User;
