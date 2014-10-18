var log = require('../log');

function Db() {
  this.data = [];
}

Db.prototype.connect = function(name) {
  this.data = require('./' + name);
};

Db.prototype.find = function(query) {
  log("find ", query);

  return this.data.filter(function(item) {
    for(var key in query) {
      if (item[key] != query[key]) return false;
    }
    return true;
  });
};

Db.prototype.findOne = function(query) {
  var records = this.find(query);
  return records.length ? records[0] : null;
};

module.exports = new Db;