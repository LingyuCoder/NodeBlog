var Admire = require("../Model/Admire.js"),
	Comment = require("../Model/Comment.js"),
	Remind = require("../Model/Remind.js"),
	moment = require("moment");

exports.add = function(req, res) {
	var admire = new Admire({
		username: req.session.user.username,
		commentId: req.body.commentId
	});
	admire.save(function(err, admire) {
		if (err) return res.json(500, {
			message: err.message
		});
		Comment.get(admire.commentId, function(err, comment) {
			if (err) return res.json(500, {
				message: err.message
			});
			new Remind({
				type: "admire",
				ref: admire.id,
				user: comment.username
			}).save(function(err) {
				if (err) return res.json(500, {
					message: err.message
				});
				res.json({
					success: true
				});
			});
		});
	});
};

exports.remove = function(req, res) {
	var admire = new Admire({
		username: req.session.user.username,
		commentId: req.body.commentId
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

exports.checkAdmired = function(req, res) {
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

exports.getOne = function(req, res) {
	Admire.get(req.body.admireId, function(err, admire) {
		if (err) return res.json(500);
		if (!admire) return res.status(404).send("not fount");
		admire.time = moment(admire.time).format("HH:mm MM月DD日 YYYY年");
		res.json({
			admire: admire
		});
	});
};

exports.getByUser = function(req, res) {
	Admire.getByUser(req.body.username, Number(req.body.curPage), Number(req.body.perPage), function(err, admires) {
		if (err) return res.json(500);
		for (var i = admires.length; i--;) {
			admires[i].time = moment(admires[i].time).format("HH:mm MM月DD日 YYYY年");
		}
		res.json({
			admires: admires
		});
	});
};

exports.countByUser = function(req, res) {
	Admire.countByUser(req.body.username, function(err, total) {
		if (err) return res.json(500);
		res.json({
			total: total
		});
	});
};