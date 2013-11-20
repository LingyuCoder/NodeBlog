var Admire = require("../Model/Admire.js");

exports.addAdmire = function(req, res) {
	var admire = new Admire({
		username: req.session.user.username,
		articleId: req.query.articleId,
		commentId: req.query.commentId
	});
	admire.save(function(err) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			success: true
		});
	});
};

exports.removeAdmire = function(req, res) {
	var admire = new Admire({
		username: req.session.user.username,
		articleId: req.query.articleId,
		commentId: req.query.commentId
	});
	admire.remove(function(err) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			success: true
		});
	});
};