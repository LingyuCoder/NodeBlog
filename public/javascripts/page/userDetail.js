(function($, window){
	$("#inputAvatar").change(function(event){
		$("#avatarPreview").attr("src", $(this).val());
	});
}(jQuery, window));