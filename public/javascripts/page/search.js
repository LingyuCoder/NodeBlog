(function($, window) {
	var $tags = $("#tags"),
		$chosenTags = $("#chosenTags"),
		$articles = $("#articles"),
		tags = [],
		curPage = 0,
		perPage = 10,
		title = "",
		searchType,
		__chooseTag = function(event) {
			var that = $(this);
			$chosenTags.append(that);
			that.unbind("click", __chooseTag).bind("click", __unChooseTag);
		},
		__unChooseTag = function(event) {
			var that = $(this);
			$tags.append(that);
			that.unbind("click", __unChooseTag).bind("click", __chooseTag);
		},
		__drawArticle = function(article) {
			var $row = $('<div class="g-row"></div>'),
				$avatar = $('<div class="u-avatar"></div>'),
				$time = $('<div class="u-time"></div>').text(article.writeTime),
				$title = $('<div class="u-title"></div>').text(article.title);
			$row.append($avatar).append($time).append($title).click(function(event) {
				window.location.href = "/article_load?articleId=" + article.id;
			});
			$(document).trigger("user.getInfo", [article.writer,
				function(err, user) {
					if (err) return;
					if (user) {
						$avatar.append('<img src="' + user.avatar + '" alt="头像无法显示"/>');
					}
				}
			]);
			$articles.append($row);
		},
		__getMore = function(event) {
			var that = $(this),
				__searchCallback = function(err, articles) {
					if (err) {
						that.text("搜索发生错误");
						return;
					}
					for (var i = 0, m = articles.length; i < m; i++) {
						__drawArticle(articles[i]);
					}
					if (articles.length < perPage) {
						that.text("已经没有更多的结果了");
					} else {
						that.text("点击搜索更多").bind("click", __getMore);
						curPage++;
					}
				};
			if (searchType === "tags") {
				if (tags.length > 0) {
					that.text("搜索中，请稍后").unbind("click", __getMore);
					$(document).trigger("article.getByTags", [tags, curPage, perPage, __searchCallback]);
				}
			} else if (searchType === "title") {
				console.log(title);
				if (title.trim()) {
					that.text("搜索中，请稍后").unbind("click", __getMore);
					$(document).trigger("article.getByTitle", [title, curPage, perPage, __searchCallback]);
				}
			}
		};
	$(document).trigger("tag.drawAllTags", [$tags, __chooseTag]);
	$("#more").click(__getMore);

	$("#tagSearchBtn").click(function(event) {
		$articles.html("");
		tags = [];
		$chosenTags.find(".label").each(function() {
			tags.push($(this).attr("tid"));
		});
		curPage = 0;
		searchType = "tags";
		$("#more").unbind("click", __getMore).bind("click", __getMore).click();
	});

	$("#titleSearchBtn").click(function(event) {
		$articles.html("");
		title = $("#titleSearchInput").val();
		curPage = 0;
		searchType = "title";
		$("#more").unbind("click", __getMore).bind("click", __getMore).click();
	});
}(jQuery, window));