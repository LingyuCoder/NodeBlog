(function($, window) {
	var emitter = $(document);
	emitter.bind({
		"user.draw": function(event, username, container, fnCallback) {
			if (container) {
				container.addClass("b-user-loading");
			}
			emitter.trigger("user.getInfo", [username,
				function(user) {
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
					container.removeClass("b-user-loading");
					if (fnCallback) fnCallback(user);
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
				if (fnCallback) {
					fnCallback(data);
				}
			}).fail(function(err) {
				console.log(err);
			});
		}
	});
}(jQuery, window));