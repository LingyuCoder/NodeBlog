(function($, window) {
	var __addBookFun = function(event) {
		var that = $(this);
		$.ajax({
			url: "/nor/bookmark_addBookmark",
			data: {
				articleId: that.attr("aid")
			}
		}).done(function(data) {
			if (data.success) {
				that.addClass("u-booked")
					.removeClass("u-book")
					.unbind("click", __addBookFun)
					.bind("click", __removeBookFun);
				that.find("span:first").text(Number(that.find("span:first").text()) + 1);
			}
		}).fail(function(error) {
			console.err(error);
		});
	},
		__removeBookFun = function(event) {
			var that = $(this);
			$.ajax({
				url: "/nor/bookmark_removeBookmark",
				data: {
					articleId: that.attr("aid")
				}
			}).done(function(data) {
				if (data.success) {
					that.removeClass("u-booked")
						.addClass("u-book")
						.unbind("click", __removeBookFun)
						.bind("click", __addBookFun);
					that.find("span:first").text(Number(that.find("span:first").text()) - 1);
				}
			}).fail(function(error) {
				console.err(error);
			});
		};
	$('pre code').each(function(i, e) {
		hljs.highlightBlock(e);
	});
	$(".u-book").click(__addBookFun);
	$(".u-booked").click(__removeBookFun);
	$(".u-comment").click(function(event) {
		window.location.href = "/article_load?articleId=" + $(this).attr("aid") + "#comments";
	});

	$(".m-tags").each(function() {
		var that = $(this),
			articleId = that.attr("aid");
		$(document).trigger("tag.drawArticleTags", [articleId, that]);
	});

	$(".u-avatar").each(function() {
		var that = $(this);
		$(document).trigger("user.draw", [that.attr("uid"), that]);
	});

	$(".u-comment").each(function() {
		$(document).trigger("comment.drawCount", [$(this).attr("aid"), $(this)]);
	});

	$(".u-book").each(function() {
		$(document).trigger("bookmark.draw", [$(this).attr("aid"), $(this), $(this).attr("cur")]);
	});
}(jQuery, window));