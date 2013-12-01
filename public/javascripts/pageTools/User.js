(function($, window) {
	var emitter = $(document);
	emitter.bind({
		"user.draw": function(event, username, container, fnCallback) {
			container.addClass("b-user-loading");
			emitter.trigger("user.getInfo", [username,
				function(err, user) {
					if (err) {
						if (typeof fnCallback === "function") fnCallback(err);
						return;
					}
					var $a,
						$img,
						$tags;
					container = container;
					$a = $("<a class='u-user-avatar' href='/userCenter?username=" + user.username + "'></a>");
					$img = $("<img src='" + user.avatar + "'></img>");
					$a.append($img);
					container.append($a);
					$tags = $("<div class='u-user-tags'></div>");
					$img.popover({
						title: user.nickname,
						placement: "bottom",
						html: true,
						content: $tags
					}).hover(function(event) {
						$img.popover("show");
					}, function(event) {
						$img.popover("hide");
					}).bind("show.bs.popover", function() {
						$tags.html("");
						$(document).trigger("tag.drawUserTags", [user.username, $tags]);
					});
					container.removeClass("b-user-loading").data("user", user);
					if (typeof fnCallback === "function") fnCallback(null, container);
				}
			]);
		},
		"user.getInfo": function(event, username, fnCallback) {
			$.ajax({
				url: "/user_getDetail",
				data: {
					username: username
				},
				type: "post",
				dataType: "json"
			}).done(function(data) {
				if (typeof fnCallback === "function") fnCallback(null, data);
			}).fail(function(err) {
				if (typeof fnCallback === "function") fnCallback(err);
			});
		}
	});
}(jQuery, window));