(function($, window) {
	var converter = new Showdown.converter(),
		getWindowHeight = function() {
			if (window.innerHeight)
				return window.innerHeight;
			else if (document.documentElement && document.documentElement.clientHeight)
				return document.documentElement.clientHeight;
			else if (document.body)
				return document.body.clientHeight;
		};

	$("#inputArticle").bind("change", function(event) {
		$("#outputArticle").html(converter.makeHtml(this.value));
		$('pre code').each(function(i, e) {
			hljs.highlightBlock(e);
		});
	});

	$(window).bind("resize", function(event) {
		$("body").height(getWindowHeight() - 150);
		$(".panel").height(getWindowHeight() - 350);
	}).trigger("resize");
}(jQuery, window));