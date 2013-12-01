(function($, window) {
	var emitter = $(document);
	emitter.bind({
		"remind.remove": function(event, remindId, fnCallback) {
			$.ajax({
				url: "/nor/remind_remove",
				type: "post",
				dataType: "json",
				data: {
					remindId: remindId
				}
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"remind.countAll": function(event, fnCallback) {
			$.ajax({
				url: "/nor/remind_countAll",
				type: "post",
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.total);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"remind.countByType": function(event, type, fnCallback) {
			$.ajax({
				url: "/nor/remind_countByType",
				type: "post",
				dataType: "json",
				data: {
					type: type
				}
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.total);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"remind.getAll": function(event, curPage, perPage, fnCallback) {
			$.ajax({
				url: "/nor/remind_getAll",
				type: "post",
				dataType: "json",
				data: {
					curPage: curPage,
					perPage: perPage
				}
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.reminds);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"remind.getByType": function(event, type, curPage, perPage, fnCallback) {
			$.ajax({
				url: "/nor/remind_getByType",
				type: "post",
				dataType: "json",
				data: {
					type: type,
					curPage: curPage,
					perPage: perPage
				}
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data.reminds);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"remind.setReaded": function(event, remindIds, fnCallback) {
			$.ajax({
				url: "/nor/remind_setReaded",
				type: "post",
				dataType: "json",
				data: {
					remindIds: remindIds
				}
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		},
		"remind.draw": function(event, container, fnCallback) {
			container.addClass("b-remind-loading");
			var i,
				__countComment = function(err, total) {
					if (err) {
						if (typeof fnCallback === "function") fnCallback(err);
						return;
					}
					var $li = $("<li></li>");
					if (total) {
						$li.append("<a href='/userCenter#getComments'> " + total + " 条新回复</a>");
						container.append($li);
					}
					container.data("commentTotal", total);
					emitter.trigger("remind.countByType", ["bookmark", __countBookmark]);
				},
				__countBookmark = function(err, total) {
					if (err) {
						if (typeof fnCallback === "function") fnCallback(err);
						return;
					}
					var $li = $("<li></li>");
					if (total) {
						$li.append("<a href='/userCenter#getBookmarks'> " + total + " 条新收藏消息</a>");
						container.append($li);
					}
					container.data("bookmarkTotal", total);
					emitter.trigger("remind.countByType", ["admire", __countAdmire]);
				},
				__countAdmire = function(err, total) {
					if (err) {
						if (typeof fnCallback === "function") fnCallback(err);
						return;
					}
					var $li = $("<li></li>");
					if (total) {
						$li.append("<a href='/userCenter#getAdmires'> " + total + " 条赞</a>");
						container.append($li);
					}
					container.data("admireTotal", total);
					container.removeClass("b-remind-loading");
					if (typeof fnCallback === "function") fnCallback(null, container);
				};
			emitter.trigger("remind.countByType", ["comment", __countComment]);
		}
	});
}(jQuery, window));