(function($, window) {
	$(".u-delete").click(function(event) {
		var that = $(this);
		$.ajax({
			url: "/nor/conf/article_delete",
			data: {
				articleId: that.attr("aid")
			},
			dataType: "json",
			type: "get",
		}).done(function(data) {
			if(data.success){
				that.parent().parent().remove();
			}
		}).fail(function(err) {
			console.log(err.message);
		});
		event.stopPropagation();
	});
}(jQuery, window));