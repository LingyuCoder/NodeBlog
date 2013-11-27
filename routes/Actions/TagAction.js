var Tag = require("../Model/Tag.js"),
	User = require("../Model/User.js"),
	Article = require("../Model/Article.js"),
	async = require("async");

exports.create = function(req, res) {
	var tag = new Tag({
		name: req.body.name,
		color: req.body.color
	});
	tag.save(function(err, newTag) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			tag: newTag
		});
	});
};

exports.listAll = function(req, res) {
	var name = req.query.name;
	Tag.getAll(function(err, tags) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			tags: tags
		});
	});
};

exports.listUserTags = function(req, res) {
	User.get(req.body.username, function(err, user) {
		if (err) return req.json(500, {
			message: err.message
		});
		async.map(user.tags, function(tagId, callback) {
			Tag.get(tagId, function(err, tag) {
				if (err) return callback(tag);
				callback(null, tag);
			});
		}, function(err, tags) {
			if (err) return req.json(500, {
				message: err.message
			});
			res.json({
				tags: tags
			});
		});
	});
};

exports.listArticleTags = function(req, res) {
	Article.get(req.body.articleId, function(err, article) {
		if (err) return req.json(500, {
			message: err.message
		});
		async.map(article.tags, function(tagId, callback) {
			Tag.get(tagId, function(err, tag) {
				if (err) return callback(tag);
				callback(null, tag);
			});
		}, function(err, tags) {
			if (err) return req.json(500, {
				message: err.message
			});
			res.json({
				tags: tags
			});
		});
	});
};

exports.listFuzzy = function(req, res) {
	var name = req.query.name;
	Tag.getByFuzzyName(name, function(err, tags) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			tags: tags
		});
	});
};