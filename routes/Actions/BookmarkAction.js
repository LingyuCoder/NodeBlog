var Bookmark = require("../Model/Bookmark.js"),
	Article = require("../Model/Article.js"),
	Remind = require("../Model/Remind.js"),
	moment = require("moment");

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

exports.getOne = function(req, res) {
	Bookmark.get(req.body.bookmarkId, function(err, bookmark) {
		if (err) return res.json(500);
		if (!bookmark) return res.status(404).send("not found");
		bookmark.time = moment(bookmark.time).format("HH:mm MM月DD日 YYYY年");
		res.json({
			bookmark: bookmark
		});
	});
};

exports.getByUser = function(req, res) {
	Bookmark.getByUser(req.body.username, Number(req.body.curPage), Number(req.body.perPage), function(err, bookmarks) {
		if (err) return res.json(500);
		for (var i = bookmarks.length; i--;) {
			bookmarks[i].time = moment(bookmarks[i].time).format("HH:mm MM月DD日 YYYY年");
		}
		res.json({
			bookmarks: bookmarks
		});
	});
};

exports.countByUser = function(req, res) {
	Bookmark.countByUser(req.body.username, function(err, total) {
		if (err) return res.json(500);
		res.json({
			total: total
		});
	});
};