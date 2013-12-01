(function($, window) {
	var destPanel = window.location.href.split('#')[1],
		curUser = $("#curUser").attr("uid"),
		user = $("#user").attr("uid"),
		__changeCount = function(name, that) {
			var $span = $("#chosePanel a[ref='" + name + "'] span");
			$span.text(Number($span.text()) - 1);
			that.parent().parent().slideUp(function() {
				$(this).remove();
				if ($span.text() === "0") {
					$("#" + name).append("<div class='u-noitem'>已没有记录</div>");
				}
			});
		},
		__setRemindsReaded = function(reminds) {
			var remindIds = [];
			for (i = 0, m = reminds.length; i < m; i++) {
				if (!reminds[i].readed) {
					remindIds.push(reminds[i].id);
				}
			}
			if (remindIds.length > 0) {
				$(document).trigger("remind.setReaded", [remindIds]);
			}
		},
		__readMore = function(event) {
			var curPanel = $(this).parent();
			if ($(window).height() + $(window).scrollTop() >= $("body").height()) {
				var type = curPanel.attr("id");
				switch (type) {
					case "getComments":
						__readMoreComments();
						break;
					case "getAdmires":
						__readMoreAdmires();
						break;
					case "getBookmarks":
						__readMoreBookmarks();
						break;
					case "articles":
						__readMoreUserArticles();
						break;
					case "comments":
						__readMoreUserComments();
						break;
					case "bookmarks":
						__readMoreUserBookmarks();
						break;
					case "admires":
						__readMoreUserAdmires();
						break;
				}
			}
		},
		__genCallback = function(remind) {
			return function(err, $row) {
				if (!remind.readed) {
					$row.find(".g-info").append("<span class='label label-danger a-fliker'>new</span>");
				}
			};
		},
		__genRemoveFun = function(remind, container) {
			return function(event) {
				$(document).trigger("remind.remove", [remind.id,
					function() {
						container.fadeOut(function() {
							$(this).remove();
						});
					}
				]);
			};
		},
		__readMoreComments = function() {
			var $getComments = $("#getComments"),
				commentContainer = $getComments.find(".g-container"),
				perPage = 10,
				page = Number($getComments.attr("cur")),
				$more = $getComments.find(".u-more");
			$more.text("正在努力加载中").unbind("click", __readMore);
			$(document).trigger("remind.getByType", ["comment", page, perPage,
				function(err, reminds) {
					var i, m,
						container,
						__genDetailFun = function() {
							return function(event) {
								window.location.href = "/article_load?articleId=" + $(this).data("comment").articleId + "#comments";
							};
						};
					for (i = 0, m = reminds.length; i < m; i++) {
						container = $("<div></div>").appendTo(commentContainer);
						$(document).trigger("comment.drawOne", [reminds[i].ref, container, [{
							html: "删除提醒<span class='glyphicon glyphicon-remove'></span>",
							click: __genRemoveFun(reminds[i], container)
						}, {
							html: "详细<span class='glyphicon glyphicon-eye-open'></span>",
							click: __genDetailFun()
						}], __genCallback(reminds[i])]);
					}
					$getComments.attr("cur", page + 1);
					__setRemindsReaded(reminds);
					if (reminds.length < perPage) {
						$more.text("已经没有更多消息了");
					} else {
						$more.text("点击加载更多").bind("click", __readMore);
					}
				}
			]);
		},
		__readMoreAdmires = function() {
			var $getAdmires = $("#getAdmires"),
				admireContainer = $getAdmires.find(".g-container"),
				perPage = 10,
				page = Number($getAdmires.attr("cur")),
				$more = $getAdmires.find(".u-more");
			$more.text("正在努力加载中").unbind("click", __readMore);
			$(document).trigger("remind.getByType", ["admire", page, perPage,
				function(err, reminds) {
					var i, m,
						container,
						__genDetailFun = function() {
							return function(event) {
								window.location.href = "/article_load?articleId=" + $(this).data("admire").commentId + "#comments";
							};
						};
					for (i = 0, m = reminds.length; i < m; i++) {
						container = $("<div></div>").appendTo(admireContainer);
						$(document).trigger("admire.drawDetail", [reminds[i].ref, container, [{
							html: "删除提醒<span class='glyphicon glyphicon-remove'></span>",
							click: __genRemoveFun(reminds[i], container)
						}], __genCallback(reminds[i])]);
					}
					$getAdmires.attr("cur", page + 1);
					__setRemindsReaded(reminds);
					if (reminds.length < perPage) {
						$more.text("已经没有更多消息了");
					} else {
						$more.text("点击加载更多").bind("click", __readMore);
					}
				}
			]);
		},
		__readMoreBookmarks = function() {
			var $getBookmarks = $("#getBookmarks"),
				bookmarkContainer = $getBookmarks.find(".g-container"),
				perPage = 10,
				page = Number($getBookmarks.attr("cur")),
				$more = $getBookmarks.find(".u-more");
			$more.text("正在努力加载中").unbind("click", __readMore);
			$(document).trigger("remind.getByType", ["bookmark", page, perPage,
				function(err, reminds) {
					var i, m,
						container,
						__genDetailFun = function() {
							return function(event) {
								window.location.href = "/article_load?articleId=" + $(this).data("bookmark").articleId;
							};
						};
					for (i = 0, m = reminds.length; i < m; i++) {
						container = $("<div></div>").appendTo(bookmarkContainer);
						$(document).trigger("bookmark.drawDetail", [reminds[i].ref, container, [{
							html: "删除提醒<span class='glyphicon glyphicon-remove'></span>",
							click: __genRemoveFun(reminds[i], container)
						}, {
							html: "详细<span class='glyphicon glyphicon-eye-open'></span>",
							click: __genDetailFun()
						}], __genCallback(reminds[i])]);
					}
					$getBookmarks.attr("cur", page + 1);
					__setRemindsReaded(reminds);
					if (reminds.length < perPage) {
						$more.text("已经没有更多消息了");
					} else {
						$more.text("点击加载更多").bind("click", __readMore);
					}
				}
			]);
		},
		__readMoreUserArticles = function() {
			var $articles = $("#articles"),
				articleContainer = $articles.find(".g-container"),
				perPage = 10,
				page = Number($articles.attr("cur")),
				$more = $articles.find(".u-more");
			$more.text("正在努力加载中").unbind("click", __readMore);
			$(document).trigger("article.getByUser", [curUser, page, perPage,
				function(err, articles) {
					var i, m,
						container,
						__genDetailFun = function() {
							return function(event) {
								window.location.href = "/article_load?articleId=" + $(this).data("article").id;
							};
						},
						__genDelete = function(container) {
							return function(event) {
								var article = $(this).data("article");
								$(document).trigger("article.remove", [article.id,
									function(err) {
										if (!err) {
											container.fadeOut(function() {
												container.remove();
											});
										}
									}
								]);
							};
						},
						__hideDelete = function(err, container) {
							if (user !== container.data("article").writer) {
								container.find("span[type='delete']").parent().remove();
							}
						};
					for (i = 0, m = articles.length; i < m; i++) {
						container = $("<div></div>").appendTo(articleContainer);
						$(document).trigger("article.drawSummary", [articles[i], container, [{
								html: "详细<span class='glyphicon glyphicon-eye-open'></span>",
								click: __genDetailFun()
							}, {
								html: "刪除<span class='glyphicon glyphicon-remove' type='delete'></span>",
								click: __genDelete(container)
							}],
							__hideDelete
						]);
					}
					$articles.attr("cur", page + 1);
					if (articles.length < perPage) {
						$more.text("已经没有更多消息了");
					} else {
						$more.text("点击加载更多").bind("click", __readMore);
					}
				}
			]);
		},
		__readMoreUserComments = function() {
			var $comments = $("#comments"),
				commentContainer = $comments.find(".g-container"),
				perPage = 10,
				page = Number($comments.attr("cur")),
				$more = $comments.find(".u-more");
			$more.text("正在努力加载中").unbind("click", __readMore);
			$(document).trigger("comment.getByUser", [curUser, page, perPage,
				function(err, comments) {
					var i, m,
						container,
						__genDetailFun = function() {
							return function(event) {
								window.location.href = "/article_load?articleId=" + $(this).data("comment").articleId + "#comments";
							};
						},
						__genDelete = function(container) {
							return function(event) {
								var comment = $(this).data("comment");
								$(document).trigger("comment.remove", [comment.id,
									function(err) {
										if (!err) {
											container.fadeOut(function() {
												container.remove();
											});
										}
									}
								]);
							};
						},
						__hideDelete = function(err, container) {
							if (user !== container.data("comment").username) {
								container.find("span[type='delete']").parent().remove();
							}
						};
					for (i = 0, m = comments.length; i < m; i++) {
						container = $("<div></div>").appendTo(commentContainer);
						$(document).trigger("comment.drawOne", [comments[i], container, [{
							html: "详细<span class='glyphicon glyphicon-eye-open'></span>",
							click: __genDetailFun()
						}, {
							html: "刪除<span class='glyphicon glyphicon-remove' type='delete'></span>",
							click: __genDelete(container)
						}], __hideDelete]);
					}
					$comments.attr("cur", page + 1);
					if (comments.length < perPage) {
						$more.text("已经没有更多消息了");
					} else {
						$more.text("点击加载更多").bind("click", __readMore);
					}
				}
			]);
		},
		__readMoreUserBookmarks = function() {
			var $bookmarks = $("#bookmarks"),
				bookmarkContainer = $bookmarks.find(".g-container"),
				perPage = 10,
				page = Number($bookmarks.attr("cur")),
				$more = $bookmarks.find(".u-more");
			$more.text("正在努力加载中").unbind("click", __readMore);
			$(document).trigger("bookmark.getByUser", [curUser, page, perPage,
				function(err, bookmarks) {
					var i, m,
						container,
						__genDetailFun = function() {
							return function(event) {
								window.location.href = "/article_load?articleId=" + $(this).data("bookmark").articleId;
							};
						},
						__genDelete = function(container) {
							return function(event) {
								var bookmark = $(this).data("bookmark");
								$(document).trigger("bookmark.remove", [bookmark.id,
									function(err) {
										if (!err) {
											container.fadeOut(function() {
												container.remove();
											});
										}
									}
								]);
							};
						},
						__hideDelete = function(err, container) {
							if (user !== container.data("bookmark").username) {
								container.find("span[type='delete']").parent().remove();
							}
						};
					for (i = 0, m = bookmarks.length; i < m; i++) {
						container = $("<div></div>").appendTo(bookmarkContainer);
						$(document).trigger("bookmark.drawDetail", [bookmarks[i], container, [{
							html: "详细<span class='glyphicon glyphicon-eye-open'></span>",
							click: __genDetailFun()
						}, {
							html: "刪除<span class='glyphicon glyphicon-remove' type='delete'></span>",
							click: __genDelete(container)
						}], __hideDelete]);
					}
					$bookmarks.attr("cur", page + 1);
					if (bookmarks.length < perPage) {
						$more.text("已经没有更多消息了");
					} else {
						$more.text("点击加载更多").bind("click", __readMore);
					}
				}
			]);
		},
		__readMoreUserAdmires = function() {
			var $admires = $("#admires"),
				admireContainer = $admires.find(".g-container"),
				perPage = 10,
				page = Number($admires.attr("cur")),
				$more = $admires.find(".u-more");
			$more.text("正在努力加载中").unbind("click", __readMore);
			$(document).trigger("admire.getByUser", [curUser, page, perPage,
				function(err, admires) {
					var i, m,
						container,
						__genDelete = function(container) {
							return function(event) {
								var admire = $(this).data("admire");
								$(document).trigger("admire.remove", [admire.id,
									function(err) {
										if (!err) {
											container.fadeOut(function() {
												container.remove();
											});
										}
									}
								]);
							};
						},
						__hideDelete = function(err, container) {
							if (user !== container.data("admire").username) {
								container.find("span[type='delete']").parent().remove();
							}
						};
					for (i = 0, m = admires.length; i < m; i++) {
						container = $("<div></div>").appendTo(admireContainer);
						$(document).trigger("admire.drawDetail", [admires[i], container, [{
							html: "刪除<span class='glyphicon glyphicon-remove' type='delete'></span>",
							click: __genDelete(container)
						}], __hideDelete]);
					}
					$admires.attr("cur", page + 1);
					if (admires.length < perPage) {
						$more.text("已经没有更多消息了");
					} else {
						$more.text("点击加载更多").bind("click", __readMore);
					}
				}
			]);
		};
	$("#chosePanel a").click(function(event) {
		var $that = $(this),
			$dest = $("#" + $that.attr("ref"));
		event.stopPropagation();
		event.preventDefault();
		if ($that.hasClass("active")) {
			return false;
		}
		$(".panel-body").hide().addClass("g-hide");
		$dest.slideDown(function() {
			$dest.removeClass("g-hide");
			curPanel = $dest;
			$dest.find(".u-more").click();
		});
		$("#chosePanel a").removeClass("active");
		$that.addClass("active");
	});

	$(".u-avatar").each(function() {
		$(document).trigger("user.draw", [curUser, $(this)]);
	});

	$(document).trigger("tag.drawUserTags", [curUser, $("#tags")]);

	$(".remind-count").each(function() {
		var that = $(this);
		$(document).trigger("remind.countByType", [that.attr("type"),
			function(err, total) {
				that.text(total + " new");
			}
		]);
	});

	$(".article-count").each(function() {
		var that = $(this);
		$(document).trigger("article.countByUser", [curUser,
			function(err, total) {
				that.text(total);
			}
		]);
	});

	$(".bookmark-count").each(function() {
		var that = $(this);
		$(document).trigger("bookmark.countByUser", [curUser,
			function(err, total) {
				that.text(total);
			}
		]);
	});

	$(".admire-count").each(function() {
		var that = $(this);
		$(document).trigger("admire.countByUser", [curUser,
			function(err, total) {
				that.text(total);
			}
		]);
	});

	$(".comment-count").each(function() {
		var that = $(this);
		$(document).trigger("comment.countByUser", [curUser,
			function(err, total) {
				that.text(total);
			}
		]);
	});

	$(".u-more").click(__readMore);

	if (destPanel) {
		$("#chosePanel a[ref='" + destPanel + "']").click();
	} else {
		$("#chosePanel a:first").click();
	}


}(jQuery, window));