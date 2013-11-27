(function($, window) {
	var emitter = $(document);
	emitter.bind({
		"remind.countAll": function(event, fnCallback) {
			$.ajax({
				url: "/nor/remind_countAll",
				type: "post",
				dataType: "json"
			}).done(function(data) {
				if (fnCallback) fnCallback(data.total);
			}).fail(function(err) {
				console.log(err);
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
				if (fnCallback) fnCallback(data.total);
			}).fail(function(err) {
				console.log(err);
			});
		},
		"remind.getAll": function(event, fnCallback) {
			$.ajax({
				url: "/nor/remind_getAll",
				type: "post",
				dataType: "json",
				data: {
					type: type
				}
			}).done(function(data) {
				if (fnCallback) fnCallback(data.reminds);
			}).fail(function(err) {
				console.log(err);
			});
		},
		"remind.getByType": function(event, type, fnCallback) {
			$.ajax({
				url: "/nor/remind_getByType",
				type: "post",
				dataType: "json",
				data: {
					type: type
				}
			}).done(function(data) {
				if (fnCallback) fnCallback(data.reminds);
			}).fail(function(err) {
				console.log(err);
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
				if (fnCallback) fnCallback();
			}).fail(function(err) {
				console.log(err);
			});
		},
		"remind.draw": function(event, $container, fnCallback) {
			var i,
				__countComment = function(total) {
					var $li = $("<li></li>");
					if (total) {
						$li.append("<a href='#'>您收到 " + total + " 条新回复</a>");
						$container.append($li);
					}
					emitter.trigger("remind.countByType", ["bookmark", __countBookmark]);

				},
				__countBookmark = function(total) {
					var $li = $("<li></li>");
					if (total) {
						$li.append("<a href='#'>您收到 " + total + " 条新收藏消息</a>");
						$container.append($li);
					}
					emitter.trigger("remind.countByType", ["admire", __countAdmire]);
				},
				__countAdmire = function(total) {
					var $li = $("<li></li>");
					if (total) {
						$li.append("<a href='#'>您收到 " + total + " 条赞</a>");
						$container.append($li);
					}
					if (fnCallback) fnCallback();
				};
			emitter.trigger("remind.countByType", ["comment", __countComment]);
		}
	});
}(jQuery, window));