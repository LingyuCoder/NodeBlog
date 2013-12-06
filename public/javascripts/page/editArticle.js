(function($, window) {
	var converter = new Showdown.converter(),
		formValidate = $("#formValidate"),
		$articleTags = $("#articleTags"),
		$allTags = $("#allTags"),
		getWindowHeight = function() {
			if (window.innerHeight)
				return window.innerHeight;
			else if (document.documentElement && document.documentElement.clientHeight)
				return document.documentElement.clientHeight;
			else if (document.body)
				return document.body.clientHeight;
		},
		__addToArticleTags = function(event) {
			var tag = event.data,
				$div = $("<div class='a-label-rotateX'><span class='label u-label' style='background-color:" + tag.color + "' tid='" + tag.id + "'>" + tag.name + "</span></div>"),
				$existTag = $articleTags.find("span[tid='" + tag.id + "']");
			$div.click(__removeFromArticleTags);
			if ($existTag.length === 0) {
				$articleTags.append($div);
			} else {
				$existTag.parent().removeClass("a-label-strike");
				setTimeout(function() {
					$existTag.parent().addClass("a-label-strike");
				}, 0);
			}
		},
		__removeFromArticleTags = function(event) {
			$(this).remove();
		};

	$("#inputArticle").bind("keyup", function(event) {
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
		var that = $(this),
			articleTags = $articleTags.find("span"),
			tags = [],
			i, m;
		formValidate.hide();
		if (!$("#inputTitle").val() || $("#inputTitle").val() === "") {
			formValidate.text("标题不能为空").slideDown();
			return false;
		}
		for (i = articleTags.length; i--;) {
			tags.push($(articleTags[i]).attr("tid"));
		}
		$.ajax({
			url: "/nor/conf/article_update",
			data: {
				articleId: that.attr("aid"),
				title: $("#inputTitle").val(),
				content: $("#inputArticle").val(),
				tags: JSON.stringify(tags)
			},
			type: "POST",
			dataType: "json"
		}).done(function(data) {
			window.location.href = "/article_load?articleId=" + that.attr("aid");
		}).error(function(data) {
			console.log(data);
		});
	});

	$(document).trigger("tag.drawAllTags", [$allTags, __addToArticleTags]);

	$(document).trigger("tag.drawArticleTags", [$articleTags.attr("aid"), $articleTags, __removeFromArticleTags]);

	$("#createTag").click(function(event) {
		var name = $("#newTagInput").val(),
			color = $("#newTagInput").attr("color");
		if (!name) {
			$("#newTagInput").addClass("has-error");
			return false;
		}

		$(document).trigger("tag.createTag", [name, color, $allTags, __addToArticleTags,
			function(event) {
				$("#newTagInput").val("");
			}
		]);
	});

	$(".u-label-picker").click(function(event) {
		$("#newTag").attr("class", "label b-label-" + $(this).attr("value")).find("input").attr("color", $(this).attr("color"));
	});

}(jQuery, window));