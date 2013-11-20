(function($, window) {
	var $replyComment = $("#replyComment"),
		__removeAdmireFun = function(event) {
			var that = $(this),
				commentId = that.parent().attr("cid");
			$.ajax({
				url: "/nor/admire_removeAdmire",
				type: "get",
				data: {
					commentId: commentId,
					articleId: $("#comments").attr("aid")
				},
				dataType: "json"
			}).done(function(data) {
				that.removeClass("admired").addClass("admire");
				that.unbind("click", __removeAdmireFun).bind("click", __addAdmireFun);
				that.find("span:first").text(Number(that.parent().find("span:first").text()) - 1);
			}).fail(function(err) {
				console.log(err.message);
			});
		},
		__addAdmireFun = function(event) {
			var that = $(this),
				commentId = that.parent().attr("cid");
			$.ajax({
				url: "/nor/admire_addAdmire",
				type: "get",
				data: {
					commentId: commentId,
					articleId: $("#comments").attr("aid")
				},
				dataType: "json"
			}).done(function(data) {
				that.removeClass("admire").addClass("admired");
				that.unbind("click", __addAdmireFun).bind("click", __removeAdmireFun);
				that.find("span:first").text(Number(that.parent().find("span:first").text()) + 1);
			}).fail(function(err) {
				console.log(err.message);
			});
		},
		__removeBookmarkFun = function(event) {
			var that = $(this);
			$.ajax({
				url: "/nor/bookmark_removeBookmark",
				type: "get",
				data: {
					articleId: $("#comments").attr("aid")
				},
				dataType: "json"
			}).done(function(data) {
				that.removeClass("booked").addClass("book");
				that.unbind("click", __removeBookmarkFun).bind("click", __addBookmarkFun);
				that.find("span:first").text(Number(that.parent().find("span:first").text()) - 1);
			}).fail(function(err) {
				console.log(err.message);
			});
		},
		__addBookmarkFun = function(event) {
			var that = $(this);
			$.ajax({
				url: "/nor/bookmark_addBookmark",
				type: "get",
				data: {
					articleId: $("#comments").attr("aid")
				},
				dataType: "json"
			}).done(function(data) {
				that.removeClass("book").addClass("booked");
				that.unbind("click", __addBookmarkFun).bind("click", __removeBookmarkFun);
				that.find("span:first").text(Number(that.parent().find("span:first").text()) + 1);
			}).fail(function(err) {
				console.log(err.message);
			});
		};
	$('pre code').each(function(i, e) {
		hljs.highlightBlock(e);
	});

	$(".delete").click(function(event) {
		var that = $(this),
			commentId = that.parent().attr("cid");
		$.ajax({
			url: "/nor/comment_delete",
			type: "get",
			data: {
				commentId: commentId
			},
			dataType: "json"
		}).done(function(data) {
			that.parent().parent().fadeOut(function() {
				$(this).remove();
			});
		}).fail(function(err) {
			console.log(err);
		});
	});

	$(".reply").click(function(event) {
		var that = $(this),
			commentId = that.parent().attr("cid");
		$("textarea", $replyComment).val("");
		if ($("form input[name='replyId']", $replyComment).val() !== that.parent().attr("cid")) {
			$replyComment.slideUp(function() {
				$("#cmt_" + commentId).append($(this));
				$(this).slideDown(function() {
					$("textarea", $replyComment).focus();
				});
				$("form input[name='replyId']").val(commentId);
			});
		} else {
			if ($replyComment.css("display") === "none") {
				$replyComment.slideDown(function() {
					$("textarea", $replyComment).focus();
				});
			} else {
				$replyComment.slideUp();
			}
		}
	});

	$(".admire").click(__addAdmireFun);

	$(".admired").click(__removeAdmireFun);

	$(".book").click(__addBookmarkFun);

	$(".booked").click(__removeBookmarkFun);

	$("#clearComment").click(function(event) {
		$("#newComments textarea").val("");
	});
}(jQuery, window));