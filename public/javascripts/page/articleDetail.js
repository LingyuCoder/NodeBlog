(function($, window) {
	var $replyComment = $("#replyComment"),
		$comments = $("#comments"),
		$bookmark = $("#bookmark"),
		curUser = $comments.attr("curUser"),
		__readMoreComments = function(event) {
			var articleId = $comments.attr("aid"),
				curPage = Number($comments.attr("cur")),
				perPage = 10,
				commentContainer = $comments.find(".g-container");
			$comments.find(".u-more").text("正在努力加载中...").unbind("click", __readMoreComments);
			$(document).trigger("comment.getByArticle", [articleId, curPage, perPage,
				function(err, comments) {
					var i, m, container,
						__deleteFn = function(container) {
							return function(event) {
								var comment = $(this).data("comment");
								$(document).trigger("comment.remove", [comment.id,
									function(err) {
										if (err) return;
										container.fadeOut(function() {
											container.remove();
										});
									}
								]);
							};
						},
						__replyFn = function(container) {
							return function(event) {
								var comment = $(this).data("comment");
								$("textarea", $replyComment).val("");
								if ($("form input[name='replyId']", $replyComment).val() !== comment.id) {
									$replyComment.slideUp(function() {
										container.find(".g-comment-row:first").append($replyComment);
										$replyComment.slideDown(function() {
											$("textarea", $replyComment).focus();
										});
										$("form input[name='replyId']").val(comment.id);
									});
								} else {
									if ($replyComment.css("display") === "none") {
										$replyComment.slideDown(function() {
											$("textarea", $replyComment).focus();
										});
									} else {
										$replyComment.slideUp();
									}
								}
							};
						},
						__commentFn = function(err, $comment) {
							var comment = $comment.data("comment");
							if (comment.username !== curUser) {
								$comment.find("span[type='remove']").parent().remove();
							}
							if (!curUser) {
								$comment.find("span[type='reply']").parent().remove();
							}
							$(document).trigger("admire.draw", [$comment.data("comment").id, $comment.find(".u-admire").parent()]);
						};
					if (err) {
						$comments.find(".u-more").text("获取评论失败");
						return;
					}
					for (i = 0, m = comments.length; i < m; i++) {
						container = $("<div></div>").appendTo(commentContainer);
						$(document).trigger("comment.drawOne", [comments[i], container, [{
								html: "删除<span type='remove' class='glyphicon glyphicon-remove'></span>",
								click: __deleteFn(container)
							}, {
								html: "回复<span type='reply' class='glyphicon glyphicon-comment'></span>",
								click: __replyFn(container)
							}, {
								html: "<span type='admire' class='u-admire'></span>"
							}],
							__commentFn
						]);
					}
					$comments.attr("cur", curPage + 1);
					if (comments.length < perPage) {
						$comments.find(".u-more").text("没有更多评论了");
					} else {
						$comments.find(".u-more").text("点击获取更多评论").bind("click", __readMoreComments);
					}

				}
			]);
		};
	$('pre code').each(function(i, e) {
		hljs.highlightBlock(e);
	});

	$("#clearComment").click(function(event) {
		$("#newComments textarea").val("");
	});

	$(document).trigger("tag.drawArticleTags", [$("#tags").attr("aid"), $("#tags")]);

	$(".g-art-info .u-avatar").each(function() {
		$(document).trigger("user.draw", [$(this).attr("uid"), $(this),
			function(err, $user) {
				if (err) return;
				var user = $user.data("user");
				$(".g-art-info .u-nick").text(user.nickname);
			}
		]);
	});

	$comments.find(".u-more").click(__readMoreComments).click();

	$(document).trigger("bookmark.draw", [$bookmark.attr("aid"), $bookmark, $bookmark.attr("cur")]);

	$("#deleteArticle").click(function(event) {
		$(document).trigger("article.remove", [$(this).attr("aid"), function(err){
			if(err) return;
			window.location.href = "/article_list";
		}]);
	});
}(jQuery, window));