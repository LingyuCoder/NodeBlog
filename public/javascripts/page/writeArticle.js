(function($, window) {
	var formValidate = $("#formValidate"),
		converter = new Showdown.converter({
			extensions: 'twitter'
		}),
		$articleTags = $("#articleTags"),
		$allTags = $("#allTags"),
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

	getWindowHeight = function() {
		if (window.innerHeight)
			return window.innerHeight;
		else if (document.documentElement && document.documentElement.clientHeight)
			return document.documentElement.clientHeight;
		else if (document.body)
			return document.body.clientHeight;
	};

	$("#inputArticle").bind("keyup", function(event) {
		$("#outputArticle").html(converter.makeHtml(this.value));
		$('pre code').each(function(i, e) {
			hljs.highlightBlock(e);
		});
	});

	$(window).bind("resize", function(event) {
		$("body").height(getWindowHeight() - 150);
		$(".panel").height(getWindowHeight() - 350);
	}).trigger("resize");

	$(document).trigger("tag.drawAllTags", [$allTags, __addToArticleTags]);

	$("#createTag").click(function(event) {
		var name = $("#newTagInput").val(),
			color = $("#newTagInput").attr("color");
		if (!name) {
			$("#newTagInput").addClass("has-error");
			return false;
		}

		$(document).trigger("tag.createTag", [name, color, $allTags, __addToArticleTags,
			function(err, $tag) {
				if (err) {
					alert("创建标签失败");
					return;
				}
				$("#newTagInput").val("");
			}
		]);
	});

	$(".u-label-picker").click(function(event) {
		$("#newTag").attr("class", "label b-label-" + $(this).attr("value")).find("input").attr("color", $(this).attr("color"));
	});

	$("#articleForm").submit(function(event) {
		var that = $(this),
			articleTags = $articleTags.find("span"),
			tags = [],
			i, m;
		formValidate.hide();
		if (!this.title.value) {
			formValidate.text("标题不能为空").slideDown();
			return false;
		}
		for (i = articleTags.length; i--;) {
			tags.push($(articleTags[i]).attr("tid"));
		}
		this.tags.value = JSON.stringify(tags);
	});
}(jQuery, window));