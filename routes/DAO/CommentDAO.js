var commonDao = require("./CommonDAO.js"),
	collectionName = "comment";

exports.saveComment = function(comment, callback) {
	commonDao.save(collectionName, comment, callback);
};

exports.findCommentsByArticle = function(articleId, callback) {
	commonDao.find(collectionName, {
		articleId: articleId
	}, callback);
};

exports.findCommentsByUser = function(username, callback) {
	commonDao.find(collectionName, {
		username: username
	}, callback);
};

exports.removeComment = function(id, callback) {
	commonDao.remove(collectionName, {
		id: id
	}, callback);
};

exports.removeCommentsByArticle = function(articleId, callback) {
	commonDao.remove(collectionName, {
		articleId: articleId
	}, callback);
};