(function($, window) {
	var __changeCount = function(name, that) {
		var $span = $("#chosePanel a[ref='" + name + "'] span");
		$span.text(Number($span.text()) - 1);
		that.parent().parent().slideUp(function() {
			$(this).remove();
			if ($span.text() === "0") {
				$("#" + name).append("<div class='u-noitem'>已没有记录</div>");
			}
		});
	};
	$("#chosePanel a").click(function(event) {
		var $that = $(this),
			$dest = $("#" + $that.attr("ref"));
		event.stopPropagation();
		event.preventDefault();
		if ($that.hasClass("active")) {
			return false;
		}
		$(".panel-body").hide().addClass("g-hide");
		$dest.slideDown(function() {
			$dest.removeClass("g-hide");
		});
		$("#chosePanel a").removeClass("active");
		$that.addClass("active");
	});
	$(".u-del-art").click(function(event) {
		var that = $(this);
		event.stopPropagation();
		event.preventDefault();
		console.log($(this).attr("aid"));
		$.ajax({
			url: "/nor/conf/article_delete",
			data: {
				articleId: $(this).attr("aid")
			},
			dataType: "json",
			method: "get"
		}).done(function(data) {
			__changeCount("articles", that);
		}).fail(function(error) {
			console.log(error);
		});
	});
	$(".u-del-book").click(function(event) {
		var that = $(this);
		event.stopPropagation();
		event.preventDefault();
		console.log($(this).attr("aid"));
		$.ajax({
			url: "/nor/bookmark_removeBookmark",
			data: {
				articleId: $(this).attr("aid")
			},
			dataType: "json",
			method: "get"
		}).done(function(data) {
			__changeCount("bookmarks", that);
		}).fail(function(error) {
			console.log(error);
		});
	});
	$(".u-del-com").click(function(event) {
		var that = $(this);
		event.stopPropagation();
		event.preventDefault();
		console.log($(this).attr("cid"));
		$.ajax({
			url: "/nor/comment_delete",
			data: {
				commentId: $(this).attr("cid")
			},
			dataType: "json",
			method: "get"
		}).done(function(data) {
			__changeCount("comments", that);
		}).fail(function(error) {
			console.log(error);
		});
	});
	$(".u-del-adm").click(function(event) {
		var that = $(this);
		event.stopPropagation();
		event.preventDefault();
		$.ajax({
			url: "/nor/admire_removeAdmire",
			data: {
				commentId: $(this).attr("cid"),
				articleId: $(this).attr("aid")
			},
			dataType: "json",
			method: "get"
		}).done(function(data) {
			__changeCount("admires", that);
		}).fail(function(error) {
			console.log(error);
		});
	});

	$(".u-avatar").each(function(){
		$(document).trigger("user.drawUserInfo", [$(this).attr("uid"), {
			container: $(this)
		}]);
	});

	$(".u-nopop-avatar").each(function(){
		$(document).trigger("user.drawUserInfo", [$(this).attr("uid"), {
			container: $(this),
			popover : false
		}]);
	});

	$(document).trigger("tag.drawUserTags", [$("#tags").attr("uid"), {
		container: $("#tags")
	}]);
}(jQuery, window));