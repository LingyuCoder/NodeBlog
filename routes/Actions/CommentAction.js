var Comment = require("../Model/Comment.js"),
	Remind = require("../Model/Remind.js"),
	moment = require("moment"),
	async = require("async");

exports.save = function(req, res) {
	var remind,
		comment = new Comment({
			articleId: req.body.articleId,
			username: req.session.user.username,
			comment: req.body.comment,
			reply: req.body.replyId
		});

	async.waterfall([

		function(callback) {
			comment.save(function(err, comment) {
				if (err) return callback(err);
				callback(err, comment);
			});
		},
		function(comment, callback) {
			if (comment.reply) {
				Comment.get(comment.reply, function(err, com) {
					if (err) return callback(err);
					var remind = new Remind({
						type: "comment",
						ref: comment.id,
						user: com.username
					});
					remind.save(function(err) {
						if (err) return callback(err);
						callback(comment);
					});
				});
			} else {
				callback(comment);
			}
		},
		function(comment, callback) {
			Article.get(comment.articleId, function(err, com) {
				if (err) return callback(err);
				var remind = new Remind({
					type: "comment",
					ref: comment.id,
					user: com.username
				});
				remind.save(function(err) {
					if (err) return callback(err);
					callback(comment);
				});
			});
		}
	], function(err) {
		if (err) res.render("error", {
			message: err.message
		});
		res.redirect("/article_load?articleId=" + comment.articleId + "#comments");
	});
};

exports.remove = function(req, res) {
	Comment.get(req.body.commentId, function(err, comment) {
		if (err) return res.json(500, {
			message: err.message
		});
		if (req.session.user.username === comment.username) {
			comment.remove(function(err) {
				if (err) return res.json(500, {
					message: err.message
				});
				res.json({
					success: true
				});
			});
		} else {
			return res.json(500, {
				message: "不能删除他人的评论"
			});
		}
	});
};

exports.getByArticle = function(req, res) {
	Comment.getByArticle(req.body.articleId, Number(req.body.curPage), Number(req.body.perPage), function(err, comments) {
		var i;
		if (err) return res.json(500, {
			message: err.message
		});
		for (i = comments.length; i--;) {
			comments[i].time = moment(comments[i].time).format("HH:mm MM月DD日 YYYY年");
		}
		res.json({
			comments: comments
		});
	});
};

exports.countByArticle = function(req, res) {
	Comment.countByArticle(req.body.articleId, function(err, total) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			total: total
		});
	});
};

exports.countByUser = function(req, res) {
	Comment.countByUser(req.body.username, function(err, total) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			total: total
		});
	});
};

exports.getByUser = function(req, res) {
	Comment.getByUser(req.body.username, Number(req.body.curPage), Number(req.body.perPage), function(err, comments) {
		if (err) return res.json(500, {
			message: err.message
		});
		for (var i = comments.length; i--;) {
			comments[i].time = moment(comments[i].time).format("HH:mm MM月DD日 YYYY年");
		}
		res.json({
			comments: comments
		});
	});
};


exports.getOne = function(req, res) {
	Comment.get(req.body.commentId, function(err, comment) {
		if (err) return res.json(500);
		if (!comment) return res.status(404).send("not fount");
		comment.time = moment(comment.time).format("HH:mm MM月DD日 YYYY年");
		res.json({
			comment: comment
		});
	});
};