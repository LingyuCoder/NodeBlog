var Bookmark = require("../Model/Bookmark.js"),
	Article = require("../Model/Article.js"),
	Remind = require("../Model/Remind.js");

exports.save = function(req, res) {
	var bookmark = new Bookmark({
		articleId: req.body.articleId,
		username: req.session.user.username
	});
	bookmark.save(function(err, bookmark) {
		if (err) return res.json(500, {
			message: err.message
		});
		Article.get(bookmark.articleId, function(err, article) {
			if (err) return res.json(500, {
				message: err.message
			});
			new Remind({
				type: "bookmark",
				ref: bookmark.id,
				user: article.writer
			}).save(function(err, remind) {
				if (err) return res.json(500, {
					message: err.message
				});
				res.json({
					success: true
				});
			});
		});
		res.json({
			success: true
		});
	});
};

exports.remove = function(req, res) {
	var bookmark = new Bookmark({
		articleId: req.body.articleId,
		username: req.session.user.username
	});
	bookmark.remove(function(err) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			success: true
		});
	});
};

exports.countByArticle = function(req, res) {
	Bookmark.countByArticle(req.body.articleId, function(err, total) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			total: total
		});
	});
};

exports.checkBooked = function(req, res) {
	Bookmark.checkBooked(req.session.user.username, req.body.articleId, function(err, booked) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			booked: booked
		});
	});
};