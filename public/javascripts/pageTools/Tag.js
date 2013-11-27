(function($, window) {
	var __prependTag = function(tag, $div, fnClick) {
		var $tag = $("<div class='a-label-rotateX'><span class='label u-label' style='background-color:" + tag.color + "' tid='" + tag.id + "'>" + tag.name + "</span></div>");
		if (typeof fnClick !== "function") {
			$tag.click(function(event) {
				//TODO: 跳转根据Tag查找资源界面
			});
		} else {
			$tag.click(tag, fnClick);
		}
		$div.prepend($tag);
	},
		emitter = $(document);
	emitter.bind({
		"tag.drawUserTags": function(event, username, container, fnClick, fnCallback) {
			if (container) {
				container.addClass("b-label-loading");
			}
			emitter.trigger("tag.getByUser", [username,
				function(tags) {
					var i,
						m;
					if (tags.length === 0) container.append("<div style='text-align'>目前尚未添加标签</div>");
					else container.html("");
					for (i = 0, m = tags.length; i < m; i++) {
						__prependTag(tags[i], container, fnClick);
					}
					container.removeClass("b-label-loading");
					if (fnCallback) fnCallback(data.tags);
				}
			]);
		},
		"tag.drawArticleTags": function(event, articleId, container, fnClick, fnCallback) {
			if (container) {
				container.addClass("b-label-loading");
			}
			emitter.trigger("tag.getByArticle", [articleId,
				function(tags) {
					var i,
						m;
					if (tags.length === 0) container.append("<div style='text-align'>目前尚未添加标签</div>");
					else container.html("");
					for (i = 0, m = tags.length; i < m; i++) {
						__prependTag(tags[i], container, fnClick);
					}
					container.removeClass("b-label-loading");
					if (fnCallback) fnCallback(tags);
				}
			]);
		},
		"tag.drawAllTags": function(event, container, fnClick, fnCallback) {
			if (container) {
				container.addClass("b-label-loading");
			}
			emitter.trigger("tag.getAll", [

				function(tags) {
					var i,
						m;
					if (container) {
						if (tags.length === 0) container.append("<div style='text-align'>目前尚未添加标签</div>");
						else container.html("");
						for (i = 0, m = tags.length; i < m; i++) {
							__prependTag(tags[i], container, fnClick);
						}
						container.removeClass("b-label-loading");
					}
					if (fnCallback) fnCallback(tags);
				}
			]);
		},
		"tag.createTag": function(event, name, color, container, fnClick, fnCallback) {
			if (container) {
				container.addClass("b-label-loading");
			}
			emitter.trigger("tag.create", [name, color,
				function(tag) {
					__prependTag(tag, container, fnClick);
					container.removeClass("b-label-loading");
					if (fnCallback) fnCallback(tag);
				}
			]);
		},
		"tag.create": function(event, name, color, fnCallback) {
			$.ajax({
				url: "/nor/tag_create",
				data: {
					name: name,
					color: color
				},
				dataType: "json",
				type: "post"
			}).done(function(data) {
				if (fnCallback) fnCallback(data.tag);
			}).fail(function(err) {
				console.log(err);
			});
		},
		"tag.getAll": function(event, fnCallback) {
			$.ajax({
				url: "/tag_listAll",
				type: "post",
				dataType: "json"
			}).done(function(data) {
				if (fnCallback) fnCallback(data.tags);
			}).fail(function(err) {
				console.log(err);
			});
		},
		"tag.getByUser": function(event, username, fnCallback) {
			$.ajax({
				url: "/tag_listUserTags",
				type: "post",
				dataType: "json",
				data: {
					username: username
				}
			}).done(function(data) {
				if (fnCallback) fnCallback(data.tags);
			}).fail(function(err) {
				console.log(err);
			});
		},
		"tag.getByArticle": function(event, articleId, fnCallback) {
			$.ajax({
				url: "/tag_listArticleTags",
				type: "post",
				dataType: "json",
				data: {
					articleId: articleId
				}
			}).done(function(data) {
				if (fnCallback) fnCallback(data.tags);
			}).fail(function(err) {
				console.log(err);
			});
		}
	});
}(jQuery, window));