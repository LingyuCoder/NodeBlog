(function($, window) {
	var $replyComment = $("#replyComment"),
		$comments = $("#comments"),
		$bookmark = $("#bookmark");
	$('pre code').each(function(i, e) {
		hljs.highlightBlock(e);
	});

	$("#clearComment").click(function(event) {
		$("#newComments textarea").val("");
	});

	$(document).trigger("tag.drawArticleTags", [$("#tags").attr("aid"), $("#tags")]);

	$(".u-avatar").each(function() {
		$(document).trigger("user.drawUserInfo", [$(this).attr("uid"), $(this)]);
	});

	$(document).trigger("comment.draw", [$comments.attr("aid"), $comments.attr("cur"), $comments,{
		replyClick: function(event){
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
		},
		deleteClick: function(event) {
			console.log("deleted");
		}
	}]);

	$(document).trigger("bookmark.draw", [$bookmark.attr("aid"), $bookmark]);
}(jQuery, window));