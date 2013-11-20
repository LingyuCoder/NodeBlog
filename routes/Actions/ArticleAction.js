var Article = require("../Model/Article.js"),
	User = require("../Model/User.js"),
	Comment = require("../Model/Comment.js"),
	Admire = require("../Model/Admire.js"),
	Bookmark = require("../Model/Bookmark.js"),
	async = require("async"),
	markdown = require("markdown").markdown,
	moment = require("moment");

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

exports.updateArticle = function(req, res) {
	Article.get(req.body.articleId, function(err, article) {
		if (err) return res.json(500, {
			message: err.message
		});
		article.title = req.body.title;
		article.content = req.body.content;
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

exports.saveArticle = function(req, res) {
	var article = new Article({
		writer: req.session.user.username,
		content: req.body.content,
		title: req.body.title
	});
	article.save(function(err, art) {
		if (err) return res.render("err", {
			message: "保存文章失败"
		});
		res.redirect("/article_load?articleId=" + art.id);
	});
};

exports.deleteArticle = function(req, res) {
	Article.get(req.query.articleId, function(err, article) {
		if (err) return res.json(500, {
			message: err.message
		});
		article.remove(function(err) {
			if (err) return res.json(500, {
				message: err.message
			});
			res.json({
				success: true
			});
		});
	});
};

exports.loadArticle = function(req, res) {
	async.waterfall([

		function(callback) {
			Article.get(req.query.articleId, function(err, article) {
				if (err) return callback(err);
				callback(err, article);
			});
		},
		function(article, callback) {
			Bookmark.countByArticle(article.id, function(err, total) {
				if (err) return callback(err);
				article.bookCount = total;
				callback(err, article);
			});
		},
		function(article, callback) {
			if (req.session.user) {
				Bookmark.checkBooked(req.session.user.username, article.id, function(err, booked) {
					if (err) return callback(err);
					article.booked = booked;
					callback(err, article);
				});
			} else {
				article.booked = false;
				callback(null, article);
			}
		},
		function(article, callback) {
			User.get(article.writer, function(err, user) {
				if (err) return callback(err);
				callback(err, article, user);
			});
		},
		function(article, user, callback) {
			Comment.getByArticle(article.id, function(err, comments) {
				if (err) return callback(err);
				callback(err, article, user, comments);
			});
		},
		function(article, user, comments, callback) {
			async.map(comments, function(comment, callback) {
				User.get(comment.username, function(err, user) {
					if (err) return callback(err);
					comment.user = user;
					callback(err, comment);
				});
			}, function(err, comments) {
				if (err) return callback(err);
				callback(err, article, user, comments);
			});
		},
		function(article, user, comments, callback) {
			async.map(comments, function(comment, callback) {
				Admire.countByComment(comment.id, function(err, total) {
					if (err) return callback(err);
					comment.admire = total;
					callback(err, comment);
				});
			}, function(err, comments) {
				if (err) return callback(err);
				callback(err, article, user, comments);
			});
		},
		function(article, user, comments, callback) {
			async.map(comments, function(comment, callback) {
				if (req.session.user) {
					Admire.checkAdmired(req.session.user.username, comment.id, function(err, admired) {
						if (err) return callback(err);
						comment.admired = admired;
						callback(err, comment);
					});
				} else {
					comment.admired = false;
					callback(null, comment);
				}

			}, function(err, comments) {
				if (err) return callback(err);
				callback(err, article, user, comments);
			});
		}
	], function(err, article, writer, comments) {
		var i,
			j,
			exists;
		if (err) return res.render("error", {
			message: err.message
		});
		article.content = markdown.toHTML(article.content);
		article.writeTime = moment(article.writeTime).format("YYYY年MM月DD日");

		for (i = comments.length; i--;) {
			comments[i].time = moment(comments[i].time).format("HH:mm MM月DD日 YYYY年");
			if (comments[i].reply) {
				exists = false;
				for (j = comments.length; j--;) {
					if (comments[j].id === comments[i].reply) {
						comments[i].reply = comments[j];
						exists = true;
					}
				}
				if (!exists) {
					comments[i].reply = "deleted";
				}
			}
		}

		res.render("articleDetail", {
			article: article,
			writer: writer,
			comments: comments
		});
	});
};

exports.listArticlesByPage = function(req, res) {
	var page = (req.query.page || 1) - 1,
		artPerPage = req.query.artPerPage || 10;
	async.waterfall([

		function(callback) {
			Article.getByPage(page, artPerPage, function(err, articles) {
				if (err) return callback(err);
				callback(err, articles);
			});
		},
		function(articles, callback) {
			async.map(articles, function(article, callback) {
				User.get(article.writer, function(err, user) {
					if (err) return callback(err);
					article.writer = user;
					callback(err, article);
				});
			}, function(err, articles) {
				if (err) return callback(err);
				callback(err, articles);
			});
		},
		function(articles, callback) {
			Article.countAll(function(err, total) {
				if (err) return callback(err);
				callback(err, articles, total);
			});
		}
	], function(err, articles, total) {
		var i,
			totalPage,
			curPage,
			startPage,
			endPage;
		if (err) return res.render("error", {
			message: "获取文章列表时发生错误..."
		});
		for (i = articles.length; i--;) {
			articles[i].content = markdown.toHTML(articles[i].content);
			articles[i].writeTime = moment(articles[i].writeTime).format("YYYY年MM月DD日");
		}
		totalPage = Math.ceil(total / artPerPage);
		curPage = page + 1;

		if (curPage <= 2) {
			startPage = 1;
			endPage = totalPage >= 5 ? 5 : totalPage;
		} else if (curPage >= totalPage - 2) {
			endPage = totalPage;
			startPage = totalPage >= 5 ? totalPage - 4 : 1;
		} else {
			startPage = curPage - 2;
			endPage = curPage + 2;
		}
		res.render("listArticle", {
			articles: articles,
			curPage: page + 1,
			artPerPage: artPerPage,
			totalPage: totalPage,
			startPage: startPage,
			endPage: endPage
		});
	});
};