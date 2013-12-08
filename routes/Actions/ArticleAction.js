var Article = require("../Model/Article.js"),
	User = require("../Model/User.js"),
	Comment = require("../Model/Comment.js"),
	Admire = require("../Model/Admire.js"),
	Bookmark = require("../Model/Bookmark.js"),
	Tag = require("../Model/Tag.js"),
	async = require("async"),
	markdown = require("markdown").markdown,
	moment = require("moment");

moment.lang("zh-cn");

exports.writePage = function(req, res) {
	res.render("writeArticle");
};

exports.editPage = function(req, res) {
	Article.get(req.query.articleId, function(err, article) {
		if (err) {
			return res.render("error", {
				message: err.message
			});
		}
		if (article) {
			return res.render("editArticle", {
				article: article
			});
		}
	});
};

exports.update = function(req, res) {
	Article.get(req.body.articleId, function(err, article) {
		if (err) return res.json(500, {
			message: err.message
		});
		article.title = req.body.title;
		article.content = req.body.content;
		article.tags = JSON.parse(req.body.tags);
		article.update(function(err) {
			if (err) return res.json(500, {
				message: err.message
			});
			res.json("editArticle", {
				success: true
			});
		});
	});
};

exports.save = function(req, res) {
	console.log(req.body.tags);
	var article = new Article({
		writer: req.session.user.username,
		content: req.body.content,
		title: req.body.title,
		tags: JSON.parse(req.body.tags)
	});
	article.save(function(err, art) {
		if (err) return res.render("err", {
			message: "保存文章失败"
		});
		res.redirect("/article_load?articleId=" + art.id);
	});
};

exports.remove = function(req, res) {
	Article.get(req.body.articleId, function(err, article) {
		if (err) return res.json(500);
		article.remove(function(err) {
			if (err) return res.json(500);
			res.json({});
		});
	});
};

exports.getOne = function(req, res) {
	Article.get(req.body.articleId, function(err, article) {
		if (err) return res.json(500);
		if (!article) return res.status(404).send("not fount");
		article.writeTime = moment(article.writeTime).fromNow();
		return res.json({
			article: article
		});
	});
};


exports.load = function(req, res) {
	Article.get(req.query.articleId, function(err, article) {
		if (err) return res.render("error", {
			message: err.message
		});
		if (!article) return res.render("error", {
			message: "没有找到该文章"
		});
		article.content = markdown.toHTML(article.content);
		article.writeTime = moment(article.writeTime).fromNow();
		res.render("articleDetail", {
			article: article
		});
	});
};

exports.listAll = function(req, res) {
	Article.getAll(Number(req.body.curPage), Number(req.body.perPage), function(err, articles) {
		var i;
		if (err) return res.json(500);
		for (i = articles.length; i--;) {
			articles[i].content = markdown.toHTML(articles[i].content);
			articles[i].writeTime = moment(articles[i].writeTime).fromNow();
		}
		return res.json({
			articles: articles
		});
	});
};


exports.getByUser = function(req, res) {
	Article.getByUser(req.body.username, Number(req.body.curPage), Number(req.body.perPage), function(err, articles) {
		if (err) return res.json(500);
		for (var i = articles.length; i--;) {
			articles[i].writeTime = moment(articles[i].writeTime).fromNow();
		}
		res.json({
			articles: articles
		});
	});
};

exports.countByUser = function(req, res) {
	Article.countByUser(req.body.username, function(err, total) {
		if (err) return res.json(500);
		res.json({
			total: total
		});
	});
};

exports.getByTags = function(req, res) {
	Article.getByTags(req.body.tags, Number(req.body.curPage), Number(req.body.perPage), function(err, articles) {
		if (err) return res.json(500);
		for (var i = articles.length; i--;) {
			articles[i].writeTime = moment(articles[i].writeTime).fromNow();
		}
		res.json({
			articles: articles
		});
	});
};

exports.getByTitle = function(req, res) {
	Article.getByTitle(req.body.title, Number(req.body.curPage), Number(req.body.perPage), function(err, articles) {
		if (err) return res.json(500);
		for (var i = articles.length; i--;) {
			articles[i].writeTime = moment(articles[i].writeTime).fromNow();
		}
		res.json({
			articles: articles
		});
	});
};