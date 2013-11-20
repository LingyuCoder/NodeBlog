var Article = require("./Model/Article.js"),
	User = require("./Model/User.js"),
	Comment = require("./Model/Comment.js"),
	Admire = require("./Model/Admire.js"),
	Bookmark = require("./Model/Bookmark.js"),
	markdown = require("markdown").markdown,
	async = require("async"),
	moment = require("moment");

exports.index = function(req, res) {
	var page = (req.query.page || 1) - 1,
		artPerPage = req.query.artPerPage || 5;
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
			async.map(articles, function(article, callback) {
				Comment.countByArticle(article.id, function(err, total) {
					if (err) return callback(err);
					article.comment = total;
					callback(err, article);
				});
			}, function(err, articles) {
				if (err) return callback(err);
				callback(err, articles);
			});
		},
		function(articles, callback) {
			async.map(articles, function(article, callback) {
				Bookmark.countByArticle(article.id, function(err, total) {
					if (err) return callback(err);
					article.bookCount = total;
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
			articles[i].writeTime = moment(articles[i].writeTime).format("YYYY年MM月DD日 HH:mm");
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
		res.render("index", {
			articles: articles,
			curPage: page + 1,
			artPerPage: artPerPage,
			totalPage: totalPage,
			startPage: startPage,
			endPage: endPage
		});
	});
};

exports.userCenter = function(req, res) {
	var user = req.session.user;
	async.waterfall([

		function(callback) {
			Bookmark.getByUser(user.username, function(err, bookmarks) {
				if (err) return callback(err);
				async.waterfall([

					function(callback) {
						async.map(bookmarks, function(bookmark, callback) {
							Article.get(bookmark.articleId, function(err, article) {
								if (err) return callback(err);
								bookmark.article = article;
								callback(err, bookmark);
							});
						}, function(err, bookmarks) {
							if (err) return callback(err);
							callback(err, bookmarks);
						});
					},
					function(bookmarks, callback) {
						async.map(bookmarks, function(bookmark, callback) {
							if (bookmark.article) {
								User.get(bookmark.article.writer, function(err, user) {
									if (err) return callback(err);
									bookmark.article.writer = user;
									callback(err, bookmark);
								});
							} else {
								callback(err, bookmark);
							}
						}, function(err, bookmarks) {
							if (err) return callback(err);
							callback(err, bookmarks);
						});
					}
				], function(err, bookmarks) {
					if (err) return callback(err);
					callback(err, bookmarks);
				});
			});
		},
		function(bookmarks, callback) {
			Admire.getByUser(user.username, function(err, admires) {
				if (err) return callback(err);
				async.waterfall([

					function(callback) {
						async.map(admires, function(admire, callback) {
							Comment.get(admire.commentId, function(err, comment) {
								if (err) return callback(err);
								admire.comment = comment;
								callback(err, admire);
							});
						}, function(err, admires) {
							if (err) return callback(err);
							callback(err, admires);
						});
					},
					function(admires, callback) {
						async.map(admires, function(admire, callback) {
							if (admire.comment) {
								User.get(admire.comment.username, function(err, user) {
									if (err) return callback(err);
									admire.comment.user = user;
									callback(err, admire);
								});
							} else {
								callback(err, admire);
							}
						}, function(err, admires) {
							if (err) return callback(err);
							callback(err, admires);
						});
					}
				], function(err, admires) {
					callback(err, bookmarks, admires);
				});
			});
		},
		function(bookmarks, admires, callback) {
			Article.getByUser(user.username, function(err, articles) {
				if (err) return callback(err);
				callback(err, bookmarks, admires, articles);
			});
		},
		function(bookmarks, admires, articles, callback) {
			Comment.getByUser(user.username, function(err, comments) {
				if (err) return callback(err);
				callback(err, bookmarks, admires, articles, comments);
			});
		}
	], function(err, bookmarks, admires, articles, comments) {
		var i;
		if (err) return res.render("error", {
			message: err.message
		});
		for (i = bookmarks.length; i--;) {
			bookmarks[i].time = moment(bookmarks[i].time).format("HH:mm MM月DD日 YYYY年");
			if (bookmarks[i].article) bookmarks[i].article.writeTime = moment(bookmarks[i].article.writeTime).format("YYYY年MM月DD日");
		}
		for (i = admires.length; i--;) {
			admires[i].time = moment(admires[i].time).format("HH:mm MM月DD日 YYYY年");
			if(admires[i].comment) admires[i].comment.time = moment(admires[i].comment.time).format("HH:mm MM月DD日 YYYY年");
		}

		for (i = articles.length; i--;) {
			articles[i].writeTime = moment(articles[i].writeTime).format("YYYY年MM月DD日");
			articles[i].lastModifyTime = moment(articles[i].lastModifyTime).format("YYYY年MM月DD日");
		}

		for (i = comments.length; i--;) {
			comments[i].time = moment(comments[i].time).format("HH:mm MM月DD日 YYYY年");
		}

		res.render("userCenter", {
			user: user,
			bookmarks: bookmarks,
			admires: admires,
			articles: articles,
			comments: comments
		});
	});
};