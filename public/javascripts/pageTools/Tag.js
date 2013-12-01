(function($, window) {
	var emitter = $(document),
		__prependTag = function(tag, $div, fnClick) {
			var $tag = $("<div class='a-label-rotateX'><span class='label u-label' style='background-color:" + tag.color + "' tid='" + tag.id + "'>" + tag.name + "</span></div>");
			if (typeof fnClick !== "function") {
				$tag.click(function(event) {
					//TODO: 跳转根据Tag查找资源界面
				});
			} else {
				$tag.click(tag, fnClick);
			}
			$tag.data("tag", tag);
			$div.prepend($tag);
			return $tag;
		};
	emitter.bind({
		"tag.drawUserTags": function(event, username, container, fnClick, fnCallback) {
			container.addClass("b-label-loading");
			emitter.trigger("tag.getByUser", [username,
				function(err, tags) {
					if (err) {
						if (typeof fnCallback === "function") fnCallback(err);
						return;
					}
					var i,
						m,
						$tag;
					if (tags.length === 0) container.append("<div style='text-align'>目前尚未添加标签</div>");
					else container.html("");
					for (i = 0, m = tags.length; i < m; i++) {
						__prependTag(tags[i], container, fnClick);
					}
					container.removeClass("b-label-loading").data("tags", tags);
					if (fnCallback) fnCallback(null, container);
				}
			]);
		},
		"tag.drawArticleTags": function(event, articleId, container, fnClick, fnCallback) {
			container.addClass("b-label-loading");
			emitter.trigger("tag.getByArticle", [articleId,

				function(err, tags) {
					if (err) {
						if (typeof fnCallback === "function") fnCallback(err);
						return;
					}
					var i,
						m;
					if (tags.length === 0) container.append("<div style='text-align'>目前尚未添加标签</div>");
					else container.html("");
					for (i = 0, m = tags.length; i < m; i++) {
						__prependTag(tags[i], container, fnClick);
					}
					container.removeClass("b-label-loading").data("tags", tags);
					if (fnCallback) fnCallback(err, container);
				}
			]);
		},
		"tag.drawAllTags": function(event, container, fnClick, fnCallback) {
			container.addClass("b-label-loading");
			emitter.trigger("tag.getAll", [

				function(err, tags) {
					if (err) {
						if (typeof fnCallback === "function") fnCallback(err);
						return;
					}
					var i,
						m;
					if (container) {
						if (tags.length === 0) container.append("<div style='text-align'>目前尚未添加标签</div>");
						else container.html("");
						for (i = 0, m = tags.length; i < m; i++) {
							__prependTag(tags[i], container, fnClick);
						}
						container.removeClass("b-label-loading").data("tags", tags);
					}
					if (fnCallback) fnCallback(null, container);
				}
			]);
		},
		"tag.createTag": function(event, name, color, container, fnClick, fnCallback) {
			container.addClass("b-label-loading");
			emitter.trigger("tag.create", [name, color,
				function(err, tag) {
					var $tag;
					if (err) {
						if (typeof fnCallback === "function") fnCallback(err);
						return;
					}
					$tag = __prependTag(tag, container, fnClick);
					container.removeClass("b-label-loading").data("tag", tag);
					if (typeof fnCallback === "function") fnCallback(null, container);
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
				if (typeof fnCallback === "function") fnCallback(null, data.tag);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"tag.getAll": function(event, fnCallback) {
			$.ajax({
				url: "/tag_listAll",
				type: "post",
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.tags);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
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
				if (typeof fnCallback === "function") fnCallback(null, data.tags);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
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
				if (typeof fnCallback === "function") fnCallback(null, data.tags);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		}
	});
}(jQuery, window));