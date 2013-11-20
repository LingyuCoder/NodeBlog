var mongodb = require('mongodb'),
	setting = require('../setting.js');
console.log("setting", setting);
module.exports = new mongodb.Db(setting.db, new mongodb.Server(setting.host, setting.port, {}));