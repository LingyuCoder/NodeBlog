(function($, window) {
	$('pre code').each(function(i, e) {
		hljs.highlightBlock(e);
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