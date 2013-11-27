var commonDao = require("./CommonDAO.js"),
	collectionName = "remind",
	uuid = require("node-uuid"),
	async = require("async"),
	__resultToListFn = function(callback) {
		return function(err, results) {
			var i;
			if (err) return callback(err);
			for (i = results.length; i--;) {
				results[i] = new Remind(results[i]);
			}
			callback(err, results);
		};
	};

function Remind(remind) {
	this.id = remind.id;
	this.time = remind.time;
	this.type = remind.type;
	this.ref = remind.ref;
	this.readed = remind.readed;
	this.user = remind.user;
}

module.exports = Remind;

Remind.prototype.save = function(callback) {
	commonDao.save(collectionName, {
		id: uuid.v4(),
		time: new Date().getTime(),
		type: this.type,
		ref: this.ref,
		user: this.user,
		readed: false
	}, function(err, result) {
		if (err) return callback(err);
		if (!result[0]) return callback(new Error("保存失败"));
		callback(err, new Remind(result[0]));
	});
};

Remind.prototype.remove = function(callback) {
	commonDao.remove(collectionName, {
		id: this.id
	}, callback);
};

Remind.prototype.update = function(callback) {
	commonDao.find(collectionName, {
		id: this.id
	}, {
		readed: this.readed
	}, callback);
};

Remind.getByUser = function(username, callback) {
	commonDao.find(collectionName, {
		condition: {
			user: username
		},
		sort: {
			time: -1
		}
	}, __resultToListFn(callback));
};

Remind.getByUserAndType = function(username, type, callback) {
	commonDao.find(collectionName, {
		condition: {
			user: username,
			type: type
		},
		sort: {
			time: -1
		}
	}, __resultToListFn(callback));
};

Remind.getByPage = function(username, curPage, perPage, callback) {
	commonDao.find(collectionName, {
		condition: {
			user: username
		},
		sort: {
			time: -1
		},
		page: {
			curPage: curPage,
			perPage: perPage
		}
	}, __resultToListFn(callback));
};

Remind.countByUser = function(username, callback) {
	commonDao.count(collectionName, {
		user: username
	}, callback);
};

Remind.countByUserAndType = function(username, type, callback) {
	commonDao.count(collectionName, {
		user: username,
		type: type
	}, callback);
};