(function($, window) {
	var __addBookFun = function(event) {
		var that = $(this);
		$.ajax({
			url: "/nor/bookmark_addBookmark",
			data: {
				articleId: that.attr("aid")
			}
		}).done(function(data) {
			console.log(data);
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
	$(".u-comment").click(function(event){
		window.location.href = "/article_load?articleId=" + $(this).attr("aid") +"#comments";
	});
}(jQuery, window));