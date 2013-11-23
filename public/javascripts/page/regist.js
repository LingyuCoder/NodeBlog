(function($, window) {
	var formValidate = $("#formValidate");
	$("#registForm input:first").focus();
	$("#registForm").submit(function(event) {
		formValidate.hide();
		if (!this.username.value.match(/^[\w]{5,15}$/)) {
			formValidate.text("用户名必须为长度为5~15的字母、数字或下划线").slideDown();
			$(this.username).focus();
			return false;
		}
		if (!this.nickname.value.match(/^[\w\-\u4e00-\u9fa5]{3,12}$/)) {
			formValidate.text("昵称必须为长度为3~12的中文、字母、数字、下划线").slideDown();
			$(this.nickname).focus();
			return false;
		}
		if (!this.password.value.match(/^[a-zA-Z0-9]{5,15}$/)) {
			formValidate.text("密码必须为长度为5~15的字母或数字").slideDown();
			$(this.password).focus();
			return false;
		}
		if (this.password.value !== this.passAgain.value) {
			formValidate.text("两次输入密码不一致，请检查").slideDown();
			$(this.password).focus();
			return false;
		}
		$(this).find("button[type='submit']").text("注册中...").attr("disabled","disabled");
	});
}(jQuery, window));