var commonDao = require("./CommonDAO.js"),
	collectionName = "article",
	uuid = require("node-uuid"),
	async = require("async"),
	Bookmark = require("./Bookmark.js"),
	Comment = require("./Comment.js"),
	__resultToListFn = function(callback) {
		return function(err, results) {
			var i;
			if (err) return callback(err);
			for (i = results.length; i--;) {
				results[i] = new Article(results[i]);
			}
			callback(err, results);
		};
	};

function Article(article) {
	this.content = article.content;
	this.title = article.title;
	this.writer = article.writer;
	this.id = article.id;
	this.writeTime = article.writeTime;
	this.lastModifyTime = article.lastModifyTime;
	this.tags = article.tags;
}

module.exports = Article;

Article.prototype.save = function(callback) {
	var article = {
		content: this.content,
		title: this.title,
		writer: this.writer,
		writeTime: new Date().getTime(),
		lastModifyTime: new Date().getTime(),
		tags: this.tags,
		id: uuid.v4()
	};
	commonDao.save(collectionName, article, function(err, result) {
		if (err) return callback(err);
		if (!result[0]) return callback(new Error("保存失败"));
		callback(err, new Article(result[0]));
	});
};

Article.get = function(id, callback) {
	commonDao.findOne(collectionName, {
		id: id
	}, function(err, result) {
		if (err) return callback(err);
		callback(err, result ? new Article(result) : result);
	});
};

Article.getDetail = function(id, callback) {};

Article.getAll = function(callback) {
	commonDao.find(collectionName, {
		sort: {
			writeTime: -1
		}
	}, __resultToListFn(callback));
};

Article.countAll = function(callback) {
	commonDao.count(collectionName, {}, callback);
};

Article.getByPage = function(curPage, perPage, callback) {
	commonDao.find(collectionName, {
		sort: {
			writeTime: -1
		},
		page: {
			curPage: curPage,
			perPage: perPage
		}
	}, __resultToListFn(callback));
};

Article.getByUser = function(username, curPage, perPage, callback) {
	commonDao.find(collectionName, {
		condition: {
			writer: username
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

Article.countByUser = function(username, callback) {
	commonDao.count(collectionName, {
		writer: username
	}, callback);
};


Article.prototype.update = function(callback) {
	commonDao.update(collectionName, {
		id: this.id
	}, {
		content: this.content,
		title: this.title,
		lastModifyTime: new Date().getTime(),
		tags: this.tags
	}, callback);
};

Article.prototype.remove = function(callback) {
	var articleId = this.id;
	async.waterfall([

		function(callback) {
			Bookmark.removeByArticle(articleId, callback);
		},
		function(callback) {
			Comment.removeByArticle(articleId, callback);
		},
		function(callback) {
			commonDao.remove(collectionName, {
				id: articleId
			}, callback);
		}
	], callback);
};