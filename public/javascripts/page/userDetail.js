(function($, window) {
	var formValidate = $("#formValidate"),
		$allTags = $("#allTags"),
		$myTags = $("#myTags"),
		__addToMyTags = function(event) {
			var tag = event.data,
				$div = $("<div class='a-label-rotateX'><span class='label u-label' style='background-color:" + tag.color + "' tid='" + tag.id + "'>" + tag.name + "</span></div>"),
				$existTag = $myTags.find("span[tid='" + tag.id + "']");
			$div.click(__removeFromMyTags);
			if ($existTag.length === 0) {
				$myTags.append($div);
			} else {
				$existTag.parent().removeClass("a-label-strike");
				setTimeout(function() {
					$existTag.parent().addClass("a-label-strike");
				}, 0);
			}
		},
		__removeFromMyTags = function(event) {
			$(this).remove();
		};
	$("#inputAvatar").change(function(event) {
		$("#avatarPreview").attr("src", $(this).val());
	});
	$("#detail").submit(function(event) {
		var that = $(this),
			mytags = $myTags.find("span"),
			tags = [],
			i, m;
		formValidate.hide();
		if (!this.nickname.value) {
			formValidate.text("昵称不能为空").slideDown();
			return false;
		}

		if (!this.nickname.value.match(/^[\w\-\u4e00-\u9fa5]{3,12}$/)) {
			formValidate.text("昵称必须为长度为3~12的中文、字母、数字、下划线").slideDown();
			$(this.nickname).focus();
			return false;
		}
		if (!this.password.value && this.password.value !== "") {
			if (!this.password.value.match(/^[a-zA-Z0-9]{5,15}$/)) {
				formValidate.text("密码必须为长度为5~15的字母或数字").slideDown();
				$(this.password).focus();
				return false;
			}
			if (this.password.value != this.passwordAgain.value) {
				formValidate.text("密码验证不正确，请重新填写").slideDown();
				return false;
			}
		}
		for (i = mytags.length; i--;) {
			tags.push($(mytags[i]).attr("tid"));
		}
		this.tags.value = JSON.stringify(tags);
	});

	$("#newTagInput").change(function() {
		$(this).removeClass("has-error");
	});

	$("#createTag").click(function(event) {
		var name = $("#newTagInput").val(),
			color = $("#newTagInput").attr("color");
		if (!name) {
			$("#newTagInput").addClass("has-error");
			return false;
		}
		$(document).trigger("tag.createTag", [name, color, $allTags,__addToMyTags,function(event) {
			$("#newTagInput").val("");
		}]);
	});

	$(document).trigger("tag.drawAllTags", [$allTags,__addToMyTags]);

	$(document).trigger("tag.drawUserTags", [$("#inputUsername").val(), $myTags, __removeFromMyTags]);

	$(".u-label-picker").click(function(event) {
		$("#newTag").attr("class", "label b-label-" + $(this).attr("value")).find("input").attr("color", $(this).attr("color"));
	});
}(jQuery, window));