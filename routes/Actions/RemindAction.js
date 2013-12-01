var Remind = require("../Model/Remind.js"),
	moment = require("moment"),
	async = require("async");

exports.getAll = function(req, res) {
	Remind.getByUser(req.session.user.username, Number(req.body.curPage), Number(req.body.perPage), function(err, reminds) {
		if (err) res.json(500, {
			message: err.message
		});
		res.json({
			reminds: reminds
		});
	});
};

exports.getByType = function(req, res) {
	Remind.getByUserAndType(req.session.user.username, req.body.type, Number(req.body.curPage), Number(req.body.perPage), function(err, reminds) {
		if (err) res.json(500, {
			message: err.message
		});
		res.json({
			reminds: reminds
		});
	});
};

exports.countUnreadAll = function(req, res) {
	Remind.countUnreadByUser(req.session.user.username, function(err, total) {
		if (err) res.json(500, {
			message: err.message
		});
		res.json({
			total: total
		});
	});
};

exports.countUnreadByType = function(req, res) {
	Remind.countUnreadByUserAndType(req.session.user.username, req.body.type, function(err, total) {
		if (err) res.json(500, {
			message: err.message
		});
		res.json({
			total: total
		});
	});
};

exports.remove = function(req, res) {
	var remindId = req.body.remindId;
	Remind.getOne(remindId, function(err, remind) {
		if (err) return callback(err);
		remind.remove(function(err) {
			if (err) return res.json(500);
			res.json(null);
		});
	});
};

exports.setReaded = function(req, res) {
	var remindIds = req.body.remindIds;
	async.each(remindIds, function(remindId, callback) {
		Remind.getOne(remindId, function(err, remind) {
			if (err) return callback(err);
			remind.readed = true;
			remind.update(function(err) {
				if (err) return callback(err);
				callback(null);
			});
		});
	}, function(err) {
		if (err) return res.json(500);
		res.json(null);
	});
};