var commonDao = require("./CommonDAO.js"),
	collectionName = "bookmark",
	uuid = require("node-uuid"),
	__resultToListFn = function(callback) {
		return function(err, results) {
			var i;
			if (err) return callback(err);
			for (i = results.length; i--;) {
				results[i] = new Bookmark(results[i]);
			}
			callback(err, results);
		};
	};

function Bookmark(bookmark) {
	this.username = bookmark.username;
	this.articleId = bookmark.articleId;
	this.time = bookmark.time;
	this.id = bookmark.id;
}

module.exports = Bookmark;

Bookmark.prototype.save = function(callback) {
	commonDao.save(collectionName, {
		username: this.username,
		articleId: this.articleId,
		time: new Date().getTime(),
		id: uuid.v4()
	}, function(err, result) {
		if (err) return callback(err);
		if (!result[0]) return callback(new Error("保存失败"));
		callback(err, new Bookmark(result[0]));
	});
};

Bookmark.prototype.remove = function(callback) {
	commonDao.remove(collectionName, {
		username: this.username,
		articleId: this.articleId
	}, callback);
};


Bookmark.get = function(bookmarkId, callback) {
	commonDao.findOne(collectionName, {
		id: bookmarkId
	}, function(err, result) {
		if (err) return callback(err);
		callback(err, result ? new Bookmark(result) : result);
	});
};

Bookmark.checkBooked = function(username, articleId, callback) {
	commonDao.findOne(collectionName, {
		username: username,
		articleId: articleId
	}, function(err, result) {
		if (err) return callback(err);
		if (!result) return callback(err, false);
		return callback(err, true);
	});
};

Bookmark.getByUser = function(username, curPage, perPage, callback) {
	commonDao.find(collectionName, {
		condition: {
			username: username
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

Bookmark.countByUser = function(username, callback) {
	commonDao.count(collectionName, {
		username: username
	}, callback);
};

Bookmark.getByArticle = function(articleId, callback) {
	commonDao.find(collectionName, {
		condition: {
			articleId: articleId
		},
		sort: {
			time: -1
		}
	}, __resultToListFn(callback));
};

Bookmark.removeByArticle = function(articleId, callback) {
	commonDao.remove(collectionName, {
		articleId: articleId
	}, callback);
};

Bookmark.countByArticle = function(articleId, callback) {
	commonDao.count(collectionName, {
		articleId: articleId
	}, function(err, total) {
		if (err) return callback(err);
		callback(err, total);
	});
};