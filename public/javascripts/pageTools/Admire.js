(function($, window) {
	var emitter = $(document),
		__removeAdmireFun = function(event) {
			var that = $(this),
				commentId = that.attr("cid");
			$(document).trigger("admire.remove", [commentId, {
				container: that
			}]);
		},
		__addAdmireFun = function(event) {
			var that = $(this),
				commentId = that.attr("cid");
			$(document).trigger("admire.add", [commentId, {
				container: that
			}]);
		};
	emitter.bind("admire.draw", function(event, commentId, container, fnCallback) {
		container.append("<span class='u-total'></span>").append("<span class='glyphicon glyphicon-thumbs-up'></span>");
		emitter.trigger("admire.checkAdmire", [commentId, {
			container: container
		}]);
		emitter.trigger("admire.count", [commentId, {
			container: container
		}]);
	}).bind("admire.checkAdmire", function(event, commentId, oArgs) {
		if (oArgs.container) {
			oArgs.container.addClass("b-admire-loading");
		}
		$.ajax({
			url: "/nor/admire_checkAdmire",
			type: "post",
			data: {
				commentId: commentId
			},
			dataType: "json"
		}).done(function(data) {
			if (oArgs.container) {
				if (data.admired) {
					oArgs.container.removeClass("admire").addClass("admired").unbind("click", __addAdmireFun).bind("click", __removeAdmireFun);
				} else {
					oArgs.container.addClass("admire").removeClass("admired").unbind("click", __removeAdmireFun).bind("click", __addAdmireFun);
				}
				oArgs.container.removeClass("b-admire-loading");
			}
			if (typeof oArgs.fnCallback === "function") {
				oArgs.fnCallback(data.admired);
			}
		}).fail(function(err) {
			console.log(err.message);
		});
	}).bind("admire.count", function(event, commentId, oArgs) {
		if (oArgs.container) {
			oArgs.container.addClass("b-admire-loading");
		}
		$.ajax({
			url: "/nor/admire_countByComment",
			type: "post",
			data: {
				commentId: commentId
			},
			dataType: "json"
		}).done(function(data) {
			if (oArgs.container) {
				oArgs.container.find("span.u-total").text(data.total).removeClass("b-admire-loading");
			}
			if (typeof oArgs.fnCallback === "function") {
				oArgs.fnCallback(data.total);
			}
		}).fail(function(err) {
			console.log(err.message);
		});
	}).bind("admire.add", function(event, commentId, oArgs) {
		if (oArgs.container) {
			oArgs.container.addClass("b-admire-loading");
		}
		$.ajax({
			url: "/nor/admire_addAdmire",
			type: "get",
			data: {
				commentId: commentId
			},
			dataType: "json"
		}).done(function(data) {
			if (oArgs.container) {
				var count = Number(oArgs.container.find("span.u-total").text());
				oArgs.container.find("span.u-total").text(count + 1);
				oArgs.container.removeClass("admire").addClass("admired").unbind("click", __addAdmireFun).bind("click", __removeAdmireFun).removeClass("b-admire-loading");
			}
			if (typeof oArgs.fnCallback === "function") {
				fnCallback();
			}
		}).fail(function(err) {
			console.log(err.message);
		});
	}).bind("admire.remove", function(event, commentId, oArgs) {
		if (oArgs.container) {
			oArgs.container.addClass("b-admire-loading");
		}
		$.ajax({
			url: "/nor/admire_removeAdmire",
			type: "get",
			data: {
				commentId: commentId
			},
			dataType: "json"
		}).done(function(data) {
			if (oArgs.container) {
				var count = Number(oArgs.container.find("span.u-total").text());
				oArgs.container.find("span.u-total").text(count - 1);
				oArgs.container.addClass("admire").removeClass("admired").unbind("click", __removeAdmireFun).bind("click", __addAdmireFun).removeClass("b-admire-loading");
			}
			if (typeof oArgs.fnCallback === "function") {
				fnCallback();
			}
		}).fail(function(err) {
			console.log(err.message);
		});
	});
}(jQuery, window));