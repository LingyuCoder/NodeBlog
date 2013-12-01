(function($, window) {
	var emitter = $(document),
		__removeAdmireFun = function(event) {
			var that = $(this),
				commentId = that.attr("cid");
			$(document).trigger("admire.remove", [commentId,
				function(err) {
					if (err) {
						return;
					}
					var count = Number(that.find("span.u-total").text());
					that.find("span.u-total").text(count - 1);
					that.addClass("admire").removeClass("admired").unbind("click", __removeAdmireFun).bind("click", __addAdmireFun);
				}
			]);
		},
		__addAdmireFun = function(event) {
			var that = $(this),
				commentId = that.attr("cid");
			$(document).trigger("admire.add", [commentId,
				function(err) {
					if (err) {
						return;
					}
					var count = Number(that.find("span.u-total").text());
					that.find("span.u-total").text(count + 1);
					that.removeClass("admire").addClass("admired").unbind("click", __addAdmireFun).bind("click", __removeAdmireFun);
				}
			]);
		},
		__drawAdmireDetail = function(admire, container, opts) {
			var $admire = $("<div class='g-admire-row'></div>"),
				$info = $("<div class='g-info'></div>"),
				$nick = $("<span class='u-nick'></span>"),
				$time = $("<span class='u-time'>" + admire.time + "</span>"),
				$avatar = $("<div class='u-avatar'></div>"),
				$comment = $("<div class='u-comment'></div>"),
				$operate = $("<div class='g-operate'></div>"),
				i, opt, defaultClick = function() {};
			for (i = opts.length; i--;) {
				$("<span class='u-opt'></span>").append(opts[i].html).data("admire", admire).click(opts[i].click || defaultClick).appendTo($operate);
			}
			$info.append($nick).append($time);

			$(document).trigger("user.draw", [admire.username, $avatar,
				function(err, $user) {
					if (err) {
						return;
					}
					var user = $user.data("user");
					$nick.text(user.nickname);
				}
			]);
			$(document).trigger("comment.drawOne", [admire.commentId, $comment, [{
					html: "<a class='u-opt'>详细<span class='glyphicon glyphicon-eye-open'></span></a>",
					click: function(event) {
						window.location.href = "/article_load?articleId=" + $(this).data("comment").articleId + "#comments";
					}
				}],
				function(err, $comment) {
					if (err) {
						return;
					}
					var comment = $comment.data("comment");
					$comment.find("hr").remove();
				}
			]);
			$admire.append($avatar).append($info).append($comment).append($operate);
			container.append($admire).append("<hr/>");
			return $admire;
		};
	emitter.bind({
		"admire.draw": function(event, commentId, container, fnCallback) {
			container.append("<span class='u-total'></span>").append("<span class='glyphicon glyphicon-thumbs-up'></span>");
			container.attr("cid", commentId);
			emitter.trigger("admire.checkAdmired", [commentId,
				function(err, admired) {
					if (!err) {
						if (admired) {
							container.removeClass("admire").addClass("admired").unbind("click", __addAdmireFun).bind("click", __removeAdmireFun);
						} else {
							container.addClass("admire").removeClass("admired").unbind("click", __removeAdmireFun).bind("click", __addAdmireFun);
						}
					}
					emitter.trigger("admire.count", [commentId,
						function(err, total) {
							if (err) {
								if (typeof fnCallback === "function") fnCallback(err, container);
								return;
							}
							container.find("span.u-total").text(total).data("admired", admired);
							if (typeof fnCallback === "function") fnCallback(null, container);
						}
					]);
				}
			]);
		},
		"admire.drawDetail": function(event, adm, container, opts, fnCallback) {
			container.addClass("b-admire-loading");
			if (typeof adm === "string") {
				emitter.trigger("admire.getOne", [adm,
					function(err, admire) {
						if (err) {
							if (err.status === 404) {
								var i, opt, defaultClick = function() {};
								container.removeClass("b-admire-loading").append("<div class='g-admire-row'>点赞已被取消<div class='g-operate'></div><hr/></div>");
								for (i = opts.length; i--;) {
									$("<span class='u-opt'></span>").append(opts[i].html).click(opts[i].click || defaultClick).appendTo(container.find(".g-operate"));
								}
							}
							if (typeof fnCallback === "function") fnCallback(err, container);
							return;
						}
						var $admire = __drawAdmireDetail(admire, container, opts);
						container.removeClass("b-admire-loading").data("admire", admire);
						if (typeof fnCallback === "function") fnCallback(null, container);
					}
				]);
			} else {
				var $admire = __drawAdmireDetail(adm, container, opts);
				container.removeClass("b-admire-loading").data("admire", adm);
				if (typeof fnCallback === "function") fnCallback(null, container);
			}

		},
		"admire.checkAdmired": function(event, commentId, fnCallback) {
			$.ajax({
				url: "/nor/admire_checkAdmired",
				type: "post",
				data: {
					commentId: commentId
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.admired);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"admire.count": function(event, commentId, fnCallback) {
			$.ajax({
				url: "/admire_countByComment",
				type: "post",
				data: {
					commentId: commentId
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.total);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"admire.add": function(event, commentId, fnCallback) {
			$.ajax({
				url: "/nor/admire_add",
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
		"admire.remove": function(event, commentId, fnCallback) {
			$.ajax({
				url: "/nor/admire_remove",
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
		"admire.getOne": function(event, admireId, fnCallback) {
			$.ajax({
				url: "/admire_getOne",
				type: "post",
				data: {
					admireId: admireId
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.admire);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"admire.countByUser": function(event, username, fnCallback) {
			$.ajax({
				url: "/admire_countByUser",
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
		"admire.getByUser": function(event, username, curPage, perPage, fnCallback) {
			$.ajax({
				url: "/admire_getByUser",
				type: "post",
				data: {
					username: username,
					curPage: curPage,
					perPage: perPage
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.admires);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		}
	});
}(jQuery, window));