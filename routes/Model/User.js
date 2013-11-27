var commonDao = require("./CommonDAO.js"),
	collectionName = "user",
	__resultToListFn = function(callback) {
		return function(err, results) {
			var i;
			if (err) {
				return callback(err);
			}
			for (i = results.length; i--;) {
				results[i] = new User(results[i]);
			}
			callback(err, results);

		};
	};

function User(user) {
	this.username = user.username;
	this.nickname = user.nickname;
	this.password = user.password;
	this.owner = user.owner;
	this.avatar = user.avatar;
	this.tags = user.tags;
}

module.exports = User;

User.prototype.save = function(callback) {
	commonDao.save(collectionName, {
		username: this.username,
		password: this.password,
		nickname: this.nickname,
		owner: this.owner,
		avatar: this.avatar,
		tags: this.tags
	}, function(err, result) {
		if (err) return callback(err);
		if (!result[0]) return new Error("保存评论失败");
		return callback(err, new User(result[0]));
	});
};

User.get = function(username, callback) {
	commonDao.findOne(collectionName, {
		username: username
	}, function(err, result) {
		if (err) return callback(err);
		callback(err, result ? new User(result) : result);
	});
};

User.getAll = function(callback) {
	commonDao.find(collectionName, {}, __resultToListFn(callback));
};

User.countAll = function(callback) {
	commonDao.count(collectionName, {}, callback);
};

User.prototype.remove = function(callback) {
	commonDao.remove(collectionName, {
		username: this.username
	}, callback);
};

User.prototype.update = function(callback) {
	console.log(this.tags);
	commonDao.update(collectionName, {
		username: this.username
	}, {
		username: this.username,
		password: this.password,
		nickname: this.nickname,
		owner: this.owner,
		avatar: this.avatar,
		tags: this.tags
	}, callback);
};