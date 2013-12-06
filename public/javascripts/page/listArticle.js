(function($, window) {
	var curPage = 0,
		MAX_PANELS = $(window).width() >= 992?3:2,
		__draw = function(article) {
			var $row = $(".g-row:last"),
				$arts = $(".g-arts"),
				$art;
			if ($(".g-art", $row).length === MAX_PANELS || $row.length === 0) {
				$row = $("<div></div>").addClass("g-row");
				$arts.append($row);
			}

			$art = $("<div></div>").addClass("u-panel g-art");
			$art.append("<div class='u-time'>" + article.writeTime + "</div>")
				.append("<div class='u-avatar'></div>")
				.append("<div class='u-title'>" + article.title + "</div>")
				.click(function(event) {
					window.location.href = "/article_load?articleId=" + article.id;
				});
			$(document).trigger("user.getInfo", [article.writer,
				function(err, user) {
					if (err) return;
					$(".u-avatar", $art).append("<img src='" + user.avatar + "'></img>");
				}
			]);
			$row.append($art);
		},
		__readMore = function(event) {
			$(document).unbind("scroll", __readMore);
			$(".u-more").text("正在加载...");
			var perPage = 10;
			if ($(window).height() + $(window).scrollTop() >= $('body').height()) {
				$(document).trigger("article.getAll", [curPage, perPage,
					function(err, articles) {
						if (err) {
							return;
						}
						var i, m;
						for (i = 0, m = articles.length; i < m; i++) {
							__draw(articles[i]);
						}
						curPage++;
						if (articles.length < perPage) {
							$(".u-more").text("已经没有更多文章了");
						} else {
							$(document).bind("scroll", __readMore);
							$(".u-more").text("向下滚动加载更多");
							$(document).scroll();
						}
					}
				]);
			}
		};
	$("pre code").each(function(i, e) {
		hljs.highlightBlock(e);
	});
	$("#articles tbody tr").click(function(event) {
		var that = $(this);
		window.location.href = "article_load?articleId=" + that.attr("aid");
	});
	$(document).scroll(__readMore);
	$(document).scroll();
}(jQuery, window));