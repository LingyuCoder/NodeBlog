(function($, window) {
	var emitter = $(document),
		__drawReadOnlyComment = function(comment, container, opts, replying) {
			var $comment = $("<div class='g-comment-row'></div>"),
				$avatar = $("<div class='u-avatar'></div>"),
				$info = $("<div class='g-info'></div>"),
				$operate = $("<div class='g-operate'></div>"),
				$time = $("<div class='u-time'>" + comment.time + "</div>"),
				$content = $("<div class='u-content'><div>" + comment.comment + "</div></div>"),
				i, opt, defaultClick = function() {};
			$info.append($time);
			for (i = opts.length; i--;) {
				$("<span class='u-opt'>" + opts[i].html + "</span>").data("comment", comment).click(opts[i].click || defaultClick).appendTo($operate);
			}
			$(document).trigger("user.draw", [comment.username, $avatar,
				function(err, $user) {
					if (err) {
						return;
					}
					var user = $user.data("user");
					$info.prepend("<span class='u-nick'>" + user.nickname + "</span>");
				}
			]);

			if (comment.reply && !replying) {
				$(document).trigger("comment.getOne", [comment.reply,
					function(err, comment) {
						if (err) {
							if (err.status === 404) {
								$content.removeClass("b-comment-loading").prepend("<div class='g-comment-row b-comment-reply'>评论已被删除</div>");
							}
							return;
						}
						var $comment;
						$content.prepend("<div class='g-comment-row b-comment-reply'></div>");
						$comment = __drawReadOnlyComment(comment, $content.find(".b-comment-reply"), [], true);
						$content.find(".b-comment-reply").find("hr").remove();
					}
				]);
			}

			$comment.append($avatar).append($info).append($content);
			if (!replying) {
				$comment.append($operate);
			}
			container.append($comment).append("<hr/>");
			return $comment;
		};
	emitter.bind({
		"comment.drawOne": function(event, com, container, opts, fnCallback) {
			container.addClass("b-loading");
			if (typeof com === "string") {
				emitter.trigger("comment.getOne", [com,
					function(err, comment) {
						if (err) {
							if (err.status === 404) {
								var i, opt, defaultClick = function() {};
								container.removeClass("b-loading").append("<div class='g-comment-row'>评论已被删除<div class='g-operate'></div><hr/></div>");
								for (i = opts.length; i--;) {
									$("<span class='u-opt'></span>").append(opts[i].html).click(opts[i].click || defaultClick).appendTo(container.find(".g-operate"));
								}
							}
							if (typeof fnCallback === "function") fnCallback(err, container);
							return;
						}
						var $comment = __drawReadOnlyComment(comment, container, opts);
						container.removeClass("b-loading").data("comment", comment);
						if (typeof fnCallback === "function") fnCallback(null, container);
					}
				]);
			} else {
				var $comment = __drawReadOnlyComment(com, container, opts);
				container.removeClass("b-loading").data("comment", com);
				if (typeof fnCallback === "function") fnCallback(null, container);
			}

		},
		"comment.drawCount": function(event, articleId, container, fnCallback) {
			container.addClass("u-comment-count").append("<a href='/article_load?articleId=" + articleId + "#comments'><span class='u-count'></span><span class='glyphicon glyphicon-comment'></span></a>");
			emitter.trigger("comment.countByArticle", [articleId,
				function(err, total) {
					if (err) {
						if (typeof fnCallback === "function") fnCallback(err, container);
						return;
					}
					container.find(".u-count").text(total).data("total", total);
					if (typeof fnCallback === "function") fnCallback(null, container);
				}
			]);
		},
		"comment.getByArticle": function(event, articleId, curPage, perPage, fnCallback) {
			$.ajax({
				url: "/comment_getByArticle",
				type: "post",
				dataType: "json",
				data: {
					articleId: articleId,
					curPage: curPage,
					perPage: perPage
				}
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.comments);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"comment.countByArticle": function(event, articleId, fnCallback) {
			$.ajax({
				url: "/comment_countByArticle",
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
		"comment.countByUser": function(event, username, fnCallback) {
			$.ajax({
				url: "/comment_countByUser",
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
		"comment.getByUser": function(event, username, curPage, perPage, fnCallback) {
			$.ajax({
				url: "/comment_getByUser",
				type: "post",
				data: {
					username: username,
					curPage: curPage,
					perPage: perPage
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.comments);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"comment.remove": function(event, commentId, fnCallback) {
			$.ajax({
				url: "/nor/comment_remove",
				type: "post",
				data: {
					commentId: commentId
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"comment.getOne": function(event, commentId, fnCallback) {
			$.ajax({
				url: "/comment_getOne",
				type: "post",
				data: {
					commentId: commentId
				},
				dataType: "json",
			}).done(function(data, status, xhr) {
				if (typeof fnCallback === "function") fnCallback(null, data.comment);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		}
	});
}(jQuery, window));