(function($, window) {
	$("pre code").each(function(i, e) {
		hljs.highlightBlock(e);
	});
	$("#articles tbody tr").click(function(event) {
		var that = $(this);
		window.location.href = "article_load?articleId=" + that.attr("aid");
	});
}(jQuery, window));