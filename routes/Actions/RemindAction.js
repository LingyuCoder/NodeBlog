var Remind = require("../Model/Remind.js"),
	moment = require("moment");

exports.getAll = function(req, res) {
	Remind.getByUser(req.session.user.username, function(err, reminds) {
		if (err) res.json(500, {
			message: err.message
		});
		res.json({
			reminds: reminds
		});
	});
};

exports.getByType = function(req, res) {
	Remind.getByUser(req.session.user.username, function(err, reminds) {
		if (err) res.json(500, {
			message: err.message
		});
		res.json({
			reminds: reminds
		});
	});
};

exports.countAll = function(req, res) {
	Remind.countByUser(req.session.user.username, function(err, total) {
		if (err) res.json(500, {
			message: err.message
		});
		res.json({
			total: total
		});
	});
};

exports.countByType = function(req, res) {
	Remind.countByUserAndType(req.session.user.username, req.body.type, function(err, total) {
		if (err) res.json(500, {
			message: err.message
		});
		res.json({
			total: total
		});
	});
};