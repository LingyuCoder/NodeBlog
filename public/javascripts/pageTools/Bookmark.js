(function($, window) {
	var emitter = $(document),
		__bookFn = function(event) {
			var that = $(this);
			emitter.trigger("bookmark.add", [that.attr("aid"),
				function() {
					var cur = Number(that.find(".u-total").text());
					that.unbind("click", __bookFn).bind("click", __bookedFn).removeClass("b-bookmark-book").addClass("b-bookmark-booked");
					that.find(".u-total").text(cur + 1);
				}
			]);
		},
		__bookedFn = function(event) {
			var that = $(this);
			emitter.trigger("bookmark.remove", [that.attr("aid"),
				function() {
					var cur = Number(that.find(".u-total").text());
					that.unbind("click", __bookedFn).bind("click", __bookFn).removeClass("b-bookmark-booked").addClass("b-bookmark-book");
					that.find(".u-total").text(cur - 1);
				}
			]);
		};
	emitter.bind({
		"bookmark.add": function(event, articleId, fnCallback) {
			$.ajax({
				url: "/nor/bookmark_addBookmark",
				type: "post",
				data: {
					articleId: articleId
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") {
					fnCallback();
				}
			}).fail(function(err) {
				console.log(err.message);
			});
		},
		"bookmark.remove": function(event, articleId, fnCallback) {
			$.ajax({
				url: "/nor/bookmark_removeBookmark",
				type: "post",
				data: {
					articleId: articleId
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") {
					fnCallback();
				}
			}).fail(function(err) {
				console.log(err.message);
			});
		},
		"bookmark.countByArticle": function(event, articleId, fnCallback) {
			$.ajax({
				url: "/bookmark_countByArticle",
				type: "post",
				data: {
					articleId: articleId
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") {
					fnCallback(data.total);
				}
			}).fail(function(err) {
				console.log(err.message);
			});
		},
		"bookmark.countByUser": function(event, username, fnCallback) {
			$.ajax({
				url: "/bookmark_countByUser",
				type: "post",
				data: {
					username: username
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") {
					fnCallback(data.total);
				}
			}).fail(function(err) {
				console.log(err.message);
			});
		},
		"bookmark.checkBooked": function(event, articleId, fnCallback) {
			$.ajax({
				url: "/nor/bookmark_checkBooked",
				type: "post",
				data: {
					articleId: articleId
				},
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") {
					fnCallback(data.booked);
				}
			}).fail(function(err) {
				console.log(err.message);
			});
		},
		"bookmark.draw": function(event, articleId, container, curUser, fnCallback) {
			container.attr("aid", articleId).addClass("u-bookmark").append("<span class='u-total'></span>").append("<span class='glyphicon glyphicon-star'></span>");
			emitter.trigger("bookmark.countByArticle", [articleId,
				function(total) {
					container.find(".u-total").text(total);
				}
			]);
			if (curUser) {
				emitter.trigger("bookmark.checkBooked", [articleId,
					function(booked) {
						if (booked) {
							container.addClass("b-bookmark-booked").click(__bookedFn);
						} else {
							container.addClass("b-bookmark-book").click(__bookFn);
						}
						if (fnCallback) fnCallback();
					}
				]);
			} else {
				if (fnCallback) fnCallback();
			}
		}
	});
}(jQuery, window));