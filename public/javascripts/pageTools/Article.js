(function($, window) {
	var emitter = $(document),
		__drawArticleSummary = function(article, container, opts) {
			var $article = $("<div class='g-article-row'></div>"),
				$info = $("<div class='g-info'></div>"),
				$nick = $("<span class='u-nick'></span>"),
				$time = $("<span class='u-time'></span>"),
				$avatar = $("<div class='u-avatar'></div>"),
				$operate = $("<div class='g-operate'></div>"),
				$content = $("<div class='u-title'></div>"),
				i, opt, defaultClick = function() {};
			$time.text(article.writeTime);
			for (i = opts.length; i--;) {
				$("<span class='u-opt'>" + opts[i].html + "</span>").data("article", article).click(opts[i].click || defaultClick).appendTo($operate);
			}
			$info.append($nick).append($time);
			emitter.trigger("user.draw", [article.writer, $avatar,
				function(err, $user) {
					if (!err) {
						$nick.text($user.data("user").nickname);
					}
				}
			]);
			$content.append("<a href='/article_load?articleId=" + article.id + "'>" + article.title + "</a>");
			$article.append($avatar).append($info).append($content).append($operate).append("<hr/>");
			container.append($article);
			return $article;
		};
	emitter.bind({
		"article.getAll": function(event, curPage, perPage, fnCallback) {
			$.ajax({
				url: "/article_getAll",
				data: {
					curPage: curPage,
					perPage: perPage
				},
				dataType: "json",
				type: "post"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.articles);
			}).fail(function(err) {
				console.log(err);
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"article.getOne": function(event, articleId, fnCallback) {
			$.ajax({
				url: "/article_getOne",
				data: {
					articleId: articleId
				},
				dataType: "json",
				type: "post"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.article);
			}).fail(function(err) {
				console.log(err);
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"article.remove": function(event, articleId, fnCallback) {
			$.ajax({
				url: "/nor/conf/article_remove",
				data: {
					articleId: articleId
				},
				dataType: "json",
				type: "post"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"article.getByUser": function(event, username, curPage, perPage, fnCallback) {
			$.ajax({
				url: "/article_getByUser",
				data: {
					username: username,
					curPage: curPage,
					perPage: perPage
				},
				dataType: "json",
				type: "post"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.articles);
			}).fail(function(err) {
				console.log(err);
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"article.countByUser": function(event, username, fnCallback) {
			$.ajax({
				url: "/article_countByUser",
				data: {
					username: username
				},
				dataType: "json",
				type: "post"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.total);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"article.getByTags": function(event, tags, curPage, perPage, fnCallback) {
			$.ajax({
				url: "/article_getByTags",
				data: {
					tags: tags,
					curPage: curPage,
					perPage: perPage
				},
				dataType: "json",
				type: "post"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.articles);
			}).fail(function(err) {
				console.log(err);
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"article.getByTitle": function(event, title, curPage, perPage, fnCallback) {
			$.ajax({
				url: "/article_getByTitle",
				data: {
					title: title,
					curPage: curPage,
					perPage: perPage
				},
				dataType: "json",
				type: "post"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.articles);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"article.drawSummary": function(event, art, container, opts, fnCallback) {
			container.addClass("b-article-loading");
			if (typeof art === "string") {
				emitter.trigger("article.getOne", [art,
					function(err, article) {
						if (err) {
							if (err.status === 404) {
								container.removeClass("b-article-loading").prepend("<div class='g-article-row'>文章已被删除</div>");
							}
							if (typeof fnCallback === "function") fnCallback(err, container);
							return;
						}
						var $article;
						$article = __drawArticleSummary(article, container, opts);
						container.removeClass("b-article-loading").data("article", article);
						if (typeof fnCallback === "function") fnCallback(null, container);
					}
				]);
			} else {
				$article = __drawArticleSummary(art, container, opts);
				container.removeClass("b-article-loading").data("article", art);
				if (typeof fnCallback === "function") fnCallback(null, container);
			}
		}
	});
}(jQuery, window));