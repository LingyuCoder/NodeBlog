(function($, window) {
	var emitter = $(document),
		__bookFn = function(event) {
			var that = $(this);
			emitter.trigger("bookmark.add", [that.attr("aid"),
				function(err) {
					if (err) {
						return;
					}
					var cur = Number(that.find(".u-total").text());
					that.unbind("click", __bookFn).bind("click", __bookedFn).removeClass("b-bookmark-book").addClass("b-bookmark-booked");
					that.find(".u-total").text(cur + 1);
				}
			]);
		},
		__bookedFn = function(event) {
			var that = $(this);
			emitter.trigger("bookmark.remove", [that.attr("aid"),
				function(err) {
					if (err) {
						return;
					}
					var cur = Number(that.find(".u-total").text());
					that.unbind("click", __bookedFn).bind("click", __bookFn).removeClass("b-bookmark-booked").addClass("b-bookmark-book");
					that.find(".u-total").text(cur - 1);
				}
			]);
		},
		__drawDetail = function(bookmark, container, opts) {
			var $bookmark = $("<div class='g-bookmark-row'></div>"),
				$info = $("<div class='g-info'></div>"),
				$nick = $("<span class='u-nick'></span>"),
				$time = $("<span class='u-time'>" + bookmark.time + "</span>"),
				$avatar = $("<div class='u-avatar'></div>"),
				$comment = $("<div class='u-comment'></div>"),
				$operate = $("<div class='g-operate'></div>"),
				i, opt, defaultClick = function() {};
			for (i = opts.length; i--;) {
				$("<span class='u-opt'></span>").append(opts[i].html).data("bookmark", bookmark).click(opts[i].click || defaultClick).appendTo($operate);
			}
			$info.append($nick).append($time);

			emitter.trigger("user.draw", [bookmark.username, $avatar,
				function(err, $user) {
					if (err) {
						return;
					}
					var user = $user.data("user");
					$nick.text(user.nickname);
				}
			]);

			emitter.trigger("article.drawSummary", [bookmark.articleId, $comment, [],
				function(err, $article) {
					if (err) {
						return;
					}
					$article.find("hr").remove();
					$article.find(".g-operate").remove();
				}
			]);

			$bookmark.append($avatar).append($info).append($comment).append($operate);
			container.append($bookmark).append("<hr/>");
			return $bookmark;
		};
	emitter.bind({
		"bookmark.drawDetail": function(event, boo, container, opts, fnCallback) {
			container.addClass("b-bookmark-loading");
			if (typeof boo === "string") {
				emitter.trigger("bookmark.getOne", [boo,
					function(err, bookmark) {
						if (err) {
							if (err.status === 404) {
								var i, opt, defaultClick = function() {};
								container.removeClass("b-bookmark-loading").append("<div class='g-bookmark-row'>书签已被删除<div class='g-operate'></div><hr/></div>");
								for (i = opts.length; i--;) {
									$("<span class='u-opt'></span>").append(opts[i].html).click(opts[i].click || defaultClick).appendTo(container.find(".g-operate"));
								}
							}
							if (typeof fnCallback === "function") fnCallback(err, container);
							return;
						}
						var $bookmark = __drawDetail(bookmark, container, opts);
						container.removeClass("b-bookmark-loading").data("bookmark", bookmark);
						if (typeof fnCallback === "function") fnCallback(null, container);
					}
				]);
			} else {
				var $bookmark = __drawDetail(boo, container, opts);
				container.removeClass("b-bookmark-loading").data("bookmark", boo);
				if (typeof fnCallback === "function") fnCallback(null, container);
			}

		},
		"bookmark.add": function(event, articleId, fnCallback) {
			$.ajax({
				url: "/nor/bookmark_add",
				type: "post",
				data: {
					articleId: articleId
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"bookmark.remove": function(event, articleId, fnCallback) {
			$.ajax({
				url: "/nor/bookmark_remove",
				type: "post",
				data: {
					articleId: articleId
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"bookmark.countByArticle": function(event, articleId, fnCallback) {
			$.ajax({
				url: "/bookmark_countByArticle",
				type: "post",
				data: {
					articleId: articleId
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.total);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"bookmark.countByUser": function(event, username, fnCallback) {
			$.ajax({
				url: "/bookmark_countByUser",
				type: "post",
				data: {
					username: username
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.total);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"bookmark.getByUser": function(event, username, curPage, perPage, fnCallback) {
			$.ajax({
				url: "/bookmark_getByUser",
				type: "post",
				data: {
					username: username,
					curPage: curPage,
					perPage: perPage
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.bookmarks);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"bookmark.checkBooked": function(event, articleId, fnCallback) {
			$.ajax({
				url: "/nor/bookmark_checkBooked",
				type: "post",
				data: {
					articleId: articleId
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.booked);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"bookmark.getOne": function(event, bookmarkId, fnCallback) {
			$.ajax({
				url: "/bookmark_getOne",
				type: "post",
				data: {
					bookmarkId: bookmarkId
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.bookmark);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"bookmark.draw": function(event, articleId, container, curUser, fnCallback) {
			container.attr("aid", articleId).addClass("u-bookmark").append("<span class='u-total'></span>").append("<span class='glyphicon glyphicon-star'></span>");
			emitter.trigger("bookmark.countByArticle", [articleId,
				function(err, total) {
					if (err) {
						if (typeof fnCallback === "function") fnCallback(err, container);
						return;
					}
					container.find(".u-total").text(total);
					if (curUser) {
						emitter.trigger("bookmark.checkBooked", [articleId,
							function(err, booked) {
								if (err) {
									if (typeof fnCallback === "function") fnCallback(err, container);
									return;
								}
								if (booked) {
									container.addClass("b-bookmark-booked").click(__bookedFn);
								} else {
									container.addClass("b-bookmark-book").click(__bookFn);
								}
							}
						]);
					}
					container.data("total", total);
					if (typeof fnCallback === "function") fnCallback(null, container);
				}
			]);
		}
	});
}(jQuery, window));