var Admire = require("../Model/Admire.js");

exports.addAdmire = function(req, res) {
	var admire = new Admire({
		username: req.session.user.username,
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

exports.checkAdmire = function(req, res) {
	var username = req.session.user.username,
		commentId = req.body.commentId;
	Admire.checkAdmired(username, commentId, function(err, admired) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			admired: admired
		});
	});
};

exports.countByComment = function(req, res) {
	var commentId = req.body.commentId;
	Admire.countByComment(commentId, function(err, total) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			total: total
		});
	});
};