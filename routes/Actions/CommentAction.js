var Comment = require("../Model/Comment.js");

exports.save = function(req, res) {
	var comment = new Comment({
		articleId: req.body.articleId,
		username: req.session.user.username,
		comment: req.body.comment,
		reply: req.body.replyId
	});
	comment.save(function(err, comment) {
		if (err) return res.render("error", {
			message: err.message
		});
		res.redirect("/article_load?articleId=" + comment.articleId + "#cmt_" + comment.id);
	});
};

exports.remove = function(req, res) {
	Comment.get(req.query.commentId, function(err, comment) {
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

exports.listByArticle = function(req, res) {
	Comment.getByArticle(req.query.articleId, function(err, comments) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			comments: comments
		});
	});
	var articleId = req.query.articleId;
	connection.findCommentsByArticle(articleId, function(err, comments) {
		var i;
		if (err) res.json(500, {
			message: err.message
		});
		res.json({
			comments: comments
		});
	});
};