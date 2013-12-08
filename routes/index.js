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
			Article.getAll(page, artPerPage, function(err, articles) {
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
			articles[i].writeTime = moment(articles[i].writeTime).fromNow();
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
	var username = req.query.username || req.session.user.username;
	User.get(username, function(err, user) {
		if (err) return res.render("error", {
			message: err.message
		});
		res.render("userCenter", {
			curUser: user
		});
	});
};

exports.advicePage = function(req, res) {
	res.render("advice");
};

exports.searchPage = function(req, res) {
	res.render("search");
};

exports.articleListPage = function(req, res){
	res.render("listArticle");
};