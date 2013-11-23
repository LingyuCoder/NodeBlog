(function($, window) {
	var $uploadZone = $("#uploadZone"),
		$uploadOutput = $("#uploadOutput"),
		$uploadResult = $("#uploadResult"),
		__uploadCancel = function(event) {
			var that = $(this).parent(),
				fileName = that.attr("fileName");
			$.ajax({
				url: "/nor/conf/picture_uploadCancel",
				data: {
					fileName: fileName
				},
				dataType: "json",
				type: "post"
			}).done(function(data) {
				that.fadeOut(function() {
					$(this).remove();
				});
			}).fail(function(err) {
				console.log(err);
			});
		},
		__uploadFile = function(file) {
			var $div = $("<div class='g-preview'><div class='u-process'></div><img class='u-image'></img><div class='u-remove'><span class='glyphicon glyphicon-remove'></span></div></div>"),
				reader = new FileReader(),
				form = new FormData(),
				xhr = new XMLHttpRequest();
			$uploadOutput.prepend($div);
			reader.onload = __parseCallback($div);
			reader.readAsDataURL(file);
			form.append("image", file);
			xhr.open("post", "/nor/conf/picture_upload", true);
			xhr.onreadystatechange = function(event) {
				if (4 == this.readyState) {
					var data = JSON.parse(event.target.response);
					$div.attr("fileName", data.fileName);
					$div.find(".u-remove").click(__uploadCancel);
				}
			};
			xhr.upload.addEventListener("progress", function(event) {
				$div.find(".u-process").text(event.loaded / event.total * 100 + "%");
			}, false);
			xhr.send(form);
		},
		__parseCallback = function($div) {
			return function(event) {
				$div.find("img").attr("src", event.target.result);
			};
		};

	$.event.props.push("dataTransfer");

	$uploadZone.bind("dragover", function(event) {
		event.stopPropagation();
		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';
	});

	$uploadZone.bind("drop", function(event) {
		event.stopPropagation();
		event.preventDefault();
		var files = event.dataTransfer.files;

		for (var i = files.length; i--;) {
			if (!files[i].type.match(/image*/)) {
				continue;
			}
			__uploadFile(files[i]);
		}
	});

	$("#uploadBtn").bind("click", function(event) {
		var imgs = [];
		$uploadOutput.find("div").each(function() {
			if ($(this).attr("fileName")) {
				imgs.push($(this).attr("fileName"));
			}
		});
		$uploadResult.removeClass("alert-success alert-danger").hide();
		if (imgs.length > 0) {
			$.ajax({
				url: "/nor/conf/picture_confirm",
				type: "post",
				dataType: "json",
				data: {
					images: imgs
				}
			}).done(function(data) {
				$uploadOutput.find(".g-preview").fadeOut(function() {
					$uploadOutput.find(".g-preview").remove();
				});
				$uploadResult.addClass("alert-success").text("上传" + imgs.length + "张图片成功！").slideDown();
			}).fail(function(err) {
				$uploadResult.addClass("alert-danger").text("上传图片失败！").slideDown();
			});
		} else {
			$uploadResult.addClass("alert-danger").text("没有选择图片！").slideDown();
		}
	});
}(jQuery, window));