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
	}).trigger("change");

	$(window).bind("resize", function(event) {
		$("body").height(getWindowHeight() - 150);
		$(".panel").height(getWindowHeight() - 350);
	}).trigger("resize");

	$("#saveArtBtn").click(function(event) {
		var that = $(this);
		$.ajax({
			url: "/nor/conf/article_update",
			data: {
				articleId: that.attr("aid"),
				title: $("#inputTitle").val(),
				content: $("#inputArticle").val()
			},
			type: "POST",
			dataType: "json"
		}).done(function(data) {
			window.location.href = "/article_load?articleId=" + that.attr("aid");
		}).error(function(data) {
			console.log(data);
		});
	});

}(jQuery, window));