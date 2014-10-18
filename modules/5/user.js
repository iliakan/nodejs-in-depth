var data = require('./github');

function User(name){
  this.name = name;
}

User.prototype.getGithub = function(){
  var login = this.name;
  var records = data.filter(function(item) { 
    return item.login == login; 
  });

  return records.length ? records[0].url : null;
};

module.exports = User;
