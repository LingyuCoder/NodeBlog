var commonDao = require("./CommonDAO.js"),
	collectionName = "user";

exports.saveUser = function(user, callback) {
	commonDao.save(collectionName, user, callback);
};

exports.findUserByUsername = function(username, callback) {
	commonDao.find(collectionName, {
		username: username
	}, callback);
};

exports.findUsers = function(callback) {
	commonDao.find(collectionName, {}, callback);
};

exports.findUsersByPage = function(curPage, perPage, callback) {
	commonDao.findByPage(collectionName, {}, curPage, perPage, callback);
};

exports.updateUser = function(user, callback) {
	commonDao.update(collectionName, {
		username: user.username
	}, user, callback);
};

exports.removeUserByUsername = function(username, callback) {
	commonDao.remove(collectionName, {
		username: username
	}, callback);
};