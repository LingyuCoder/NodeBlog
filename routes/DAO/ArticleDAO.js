var commonDao = require("./CommonDAO.js"),
	collectionName = "article";

exports.saveArticle = function(article, callback) {
	commonDao.save(collectionName, article, callback);
};

exports.findArticleById = function(id, callback) {
	commonDao.find(collectionName, {
		id: id
	}, callback);
};

exports.findArticles = function(callback) {
	commonDao.find(collectionName, {}, callback);
};

exports.findArticlesByWriter = function(writer, callback) {
	commonDao.find(collectionName, {
		writer: writer
	}, callback);
};

exports.findArticlesByPage = function(curPage, perPage, callback) {
	commonDao.findByPage(collectionName, {}, curPage, perPage, callback);
};

exports.updateArticle = function(article, callback) {
	commonDao.update(collectionName, {
		id: article.id
	}, article, callback);
};

exports.removeArticleById = function(id, callback) {
	commonDao.remove(collectionName, {
		id: id
	}, callback);
};