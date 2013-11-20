var Bookmark = require("../Model/Bookmark.js");

exports.save = function(req, res) {
	var bookmark = new Bookmark({
		articleId: req.query.articleId,
		username: req.session.user.username
	});
	bookmark.save(function(err) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			success: true
		});
	});
};

exports.remove = function(req, res) {
	var bookmark = new Bookmark({
		articleId: req.query.articleId,
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