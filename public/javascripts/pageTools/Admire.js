(function($, window) {
	var emitter = $(document),
		__removeAdmireFun = function(event) {
			var that = $(this),
				commentId = that.attr("cid");
			$(document).trigger("admire.remove", [commentId,
				function() {
					var count = Number(that.find("span.u-total").text());
					that.find("span.u-total").text(count - 1);
					that.addClass("admire").removeClass("admired").unbind("click", __removeAdmireFun).bind("click", __addAdmireFun);
				}
			]);
		},
		__addAdmireFun = function(event) {
			var that = $(this),
				commentId = that.attr("cid");
			$(document).trigger("admire.add", [commentId,
				function() {
					var count = Number(that.find("span.u-total").text());
					that.find("span.u-total").text(count + 1);
					that.removeClass("admire").addClass("admired").unbind("click", __addAdmireFun).bind("click", __removeAdmireFun);
				}
			]);
		};
	emitter.bind({
		"admire.draw": function(event, commentId, container, fnCallback) {
			container.append("<span class='u-total'></span>").append("<span class='glyphicon glyphicon-thumbs-up'></span>");
			emitter.trigger("admire.checkAdmire", [commentId,
				function(admired) {
					if (admired) {
						container.removeClass("admire").addClass("admired").unbind("click", __addAdmireFun).bind("click", __removeAdmireFun);
					} else {
						container.addClass("admire").removeClass("admired").unbind("click", __removeAdmireFun).bind("click", __addAdmireFun);
					}
					emitter.trigger("admire.count", [commentId,
						function(total) {
							container.find("span.u-total").text(total);
							if (fnCallback) fnCallback();
						}
					]);
				}
			]);
		},
		"admire.checkAdmire": function(event, commentId, fnCallback) {
			$.ajax({
				url: "/nor/admire_checkAdmire",
				type: "post",
				data: {
					commentId: commentId
				},
				dataType: "json"
			}).done(function(data) {
				if (fnCallback) fnCallback(data.admired);
			}).fail(function(err) {
				console.log(err.message);
			});
		},
		"admire.count": function(event, commentId, fnCallback) {
			$.ajax({
				url: "/nor/admire_countByComment",
				type: "post",
				data: {
					commentId: commentId
				},
				dataType: "json"
			}).done(function(data) {
				if (fnCallback) fnCallback(data.total);
			}).fail(function(err) {
				console.log(err.message);
			});
		},
		"admire.add": function(event, commentId, fnCallback) {
			$.ajax({
				url: "/nor/admire_addAdmire",
				type: "get",
				data: {
					commentId: commentId
				},
				dataType: "json"
			}).done(function(data) {
				if (fnCallback) fnCallback();
			}).fail(function(err) {
				console.log(err.message);
			});
		},
		"admire.remove": function(event, commentId, fnCallback) {
			$.ajax({
				url: "/nor/admire_removeAdmire",
				type: "get",
				data: {
					commentId: commentId
				},
				dataType: "json"
			}).done(function(data) {
				if (fnCallback) fnCallback();
			}).fail(function(err) {
				console.log(err.message);
			});
		}
	});
}(jQuery, window));