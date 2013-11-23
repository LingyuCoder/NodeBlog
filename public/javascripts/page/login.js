(function($, window) {
	var formValidate = $("#formValidate");
	$("#loginForm").submit(function(event){
		formValidate.hide();
		if (!this.username.value) {
			formValidate.text("请输入用户名").slideDown();
			$(this.username).focus();
			return false;
		}
		if (!this.password.value.match(/^[\w\-\u4e00-\u9fa5]{3,12}$/)) {
			formValidate.text("请输入密码").slideDown();
			$(this.password).focus();
			return false;
		}
		$(this).find("button[type='submit']").text("登陆中...").attr("disabled","disabled");
	});
}(jQuery, window));