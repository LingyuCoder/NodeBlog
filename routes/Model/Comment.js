var commonDao = require("./CommonDAO.js"),
	collectionName = "comment",
	uuid = require("node-uuid"),
	Admire = require("./Admire.js"),
	async = require("async"),
	__resultToListFn = function(callback) {
		return function(err, results) {
			var i;
			if (err) {
				return callback(err);
			}
			for (i = results.length; i--;) {
				results[i] = new Comment(results[i]);
			}
			callback(err, results);
		};
	};

function Comment(comment) {
	this.comment = comment.comment;
	this.username = comment.username;
	this.reply = comment.reply;
	this.articleId = comment.articleId;
	this.time = comment.time;
	this.id = comment.id;
}

module.exports = Comment;

Comment.prototype.save = function(callback) {
	commonDao.save(collectionName, {
		comment: this.comment,
		username: this.username,
		articleId: this.articleId,
		time: new Date().getTime(),
		reply: this.reply,
		id: uuid.v4()
	}, function(err, result) {
		if (err) return callback(err);
		if (!result[0]) return new Error("保存评论失败");
		return callback(err, new Comment(result[0]));
	});
};

Comment.get = function(commentId, callback) {
	commonDao.findOne(collectionName, {
		id: commentId
	}, function(err, result) {
		if (err) return callback(err);
		callback(err, result ? new Comment(result) : result);
	});
};

Comment.getByArticle = function(articleId, curPage, perPage, callback) {
	commonDao.find(collectionName, {
		condition: {
			articleId: articleId
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

Comment.getByUser = function(username, curPage, perPage, callback) {
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

Comment.countByUser = function(username, callback) {
	commonDao.count(collectionName, {
		username: username
	}, callback);
};

Comment.removeByArticle = function(articleId, callback) {
	commonDao.find(collectionName, {
		condition: {
			articleId: articleId
		}
	}, __resultToListFn(function(err, comments) {
		async.eachLimit(comments, 10, function(comment, callback) {
			comment.remove(callback);
		}, callback);
	}));
};

Comment.countByArticle = function(articleId, callback) {
	commonDao.count(collectionName, {
		articleId: articleId
	}, callback);
};

Comment.prototype.getReply = function(callback) {
	commonDao.find(collectionName, {
		condition: {
			reply: this.id
		}
	}, __resultToListFn(callback));
};

Comment.prototype.remove = function(callback) {
	var commentId = this.id;
	async.waterfall([

		function(callback) {
			Admire.removeByComment(commentId, callback);
		},
		function(callback) {
			commonDao.remove(collectionName, {
				id: commentId
			}, callback);
		}
	], callback);

};