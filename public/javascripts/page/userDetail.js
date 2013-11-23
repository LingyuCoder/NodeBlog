(function($, window) {
	var formValidate = $("#formValidate");
	$("#inputAvatar").change(function(event) {
		$("#avatarPreview").attr("src", $(this).val());
	});
	$("#detail").submit(function(event) {
		var that = $(this);
		formValidate.hide();
		if (!this.nickname.value) {
			formValidate.text("昵称不能为空").slideDown();
			return false;
		}
		if (this.password.value != this.passwordAgain.value) {
			formValidate.text("密码验证不正确，请重新填写").slideDown();
			return false;
		}
	});
}(jQuery, window));