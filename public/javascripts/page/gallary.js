(function(jQuery, window) {
	var curPage = 0,
		footer = $("#scrollFooter"),
		gallaryHeights = [0, 0, 0, 0],
		filler = $("#filler"),
		blocker = $("#blocker"),
		trash = $("#trash"),
		upload = $("#upload"),
		processing = false,
		__uploadFile = function(file) {
			var $div = $("<div draggable='true' class='u-pic'><img></img></div>"),
				reader = new FileReader(),
				form = new FormData(),
				xhr = new XMLHttpRequest();
			$div.append("<div class='b-removing'>上传中</div>");
			$div.find("img").bind("load", function(event) {
				$("#gallary").trigger("addPic", [$div]);
			});
			reader.onload = __parseCallback($div);
			reader.readAsDataURL(file);
			form.append("image", file);
			xhr.open("post", "/nor/conf/picture_uploadDirect", true);
			xhr.onreadystatechange = function(event) {
				if (4 == this.readyState) {
					var data = JSON.parse(event.target.response);
					$div.find("img")
						.attr("fname", data.fileName)
						.attr("gallary", data.gallary);
					$div.find(".b-removing").remove();
				}
			};
			xhr.send(form);
		},
		__parseCallback = function($div) {
			return function(event) {
				$div.find("img").attr("src", event.target.result);
			};
		},
		__preAjax = function() {
			$(".scrollFooter").slideDown();
		},
		__imgClickFun = function(event) {
			processing = true;
			var scrollTop = $(window).scrollTop();
			$("img", filler).attr("src", "/" + $("img", this).attr("gallary") + "/" + $("img", this).attr("fname")).css("width", "auto");
			filler.css({
				top: (scrollTop + 100) + "px"
			}).show();
			blocker.show();
		},
		__deletePic = function(fileName, $div) {
			$.ajax({
				url: "/nor/conf/picture_delete",
				data: {
					fileName: fileName
				},
				dataType: "json",
				type: "post"
			}).done(function(data) {
				if (data.success) {
					$div.fadeOut(function() {
						gallaryHeights[Number($div.parent().attr("index"))] -= $div.height();
						$div.remove();
					});
				}
			}).fail(function(err) {
				console.log(err.message);
			});
		},
		__drawPics = function(data) {
			var i,
				m,
				$gallary = $("#gallary"),
				dir = data.gallary_small,
				files = data.files,
				dfd,
				$div,
				dfds = [],
				__genFun = function(dfd, that) {
					return function(event) {
						$("#gallary").trigger("addPic", [that]);
						dfd.resolve();
					};
				};
			if (files.length > 0) {
				curPage++;
				for (i = 0, m = files.length; i < m; i++) {
					$div = $("<div draggable='true' class='u-pic'><img gallary='" + data.gallary + "' fname='" + files[i] + "' src='/" + dir + "/" + files[i] + "'/></div>");
					dfd = $.Deferred();
					$("img", $div).bind("load", __genFun(dfd, $div));
					dfds.push(dfd);
				}
				$.when.apply(null, dfds).done(function() {
					$(".scrollFooter").slideUp();
					processing = false;
					$(document).trigger("scroll");
				});
			} else {
				$(".scrollFooter").text("已经没有更多的图片了");
			}
		},
		__getMorePics = function(event) {
			if ($(window).height() + $(window).scrollTop() >= $("body").height() && (!processing)) {
				processing = true;
				__preAjax();
				$.ajax({
					url: "/gallary_list",
					data: {
						curPage: curPage,
						perPage: 10
					},
					dataType: "json",
					type: "get"
				}).done(__drawPics).fail(function(error) {
					console.log(error);
				});
			}
		};
	blocker.scroll(function(event) {
		event.stopPropagation();
		event.preventDefault();
	}).click(function(event) {
		event.stopPropagation();
		event.preventDefault();
	});

	filler.find("img").mousewheel(function(event) {
		event.stopPropagation();
		event.preventDefault();
		var that = $(this),
			curWidth = that.width();
		if (event.deltaY > 0) {
			if (curWidth === filler.width())
				return false;
			that.width(curWidth + 20);
		} else {
			if (curWidth === 300)
				return false;
			that.width(curWidth - 20);
		}
	});

	filler.find(".u-close").click(function(event) {
		$("#filler").addClass("a-hide");
		filler.hide();
		blocker.hide();
		processing = false;
	});

	$.event.props.push("dataTransfer");

	$(".u-conf-opt").bind("dragover", function(event) {
		event.stopPropagation();
		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';
		$(this).css({
			color: "orange",
			"border-color": "orange"
		});
	}).bind("dragleave", function(event) {
		event.stopPropagation();
		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';
		$(this).css({
			color: "black",
			"border-color": "black"
		});
	});

	upload.bind("drop", function(event) {
		event.stopPropagation();
		event.preventDefault();
		var files = event.dataTransfer.files;
		for (var i = files.length; i--;) {
			if (!files[i].type.match(/image*/)) {
				continue;
			}
			__uploadFile(files[i]);
		}
		$(this).css({
			color: "black",
			"border-color": "black"
		});
	});

	trash.bind("drop", function(event) {
		event.stopPropagation();
		event.preventDefault();
		var fileName = event.dataTransfer.getData("fileName"),
			$div = $("img[fname='" + fileName + "']").parent();
		$div.append("<div class='b-removing'>删除中</div>");
		$div.find(".b-removing").css({
			"line-height": $div.height() + "px"
		});
		$(this).css({
			color: "black",
			"border-color": "black"
		});
		__deletePic(fileName, $div);
	});

	$("#gallary").bind("addPic", function(event, $div) {
		var i, min = gallaryHeights.length - 1;
		for (i = min; i--;) {
			min = gallaryHeights[i] < gallaryHeights[min] ? i : min;
		}
		$("#col-" + min).append($div);
		gallaryHeights[min] = gallaryHeights[min] + $div.height();
		$div.bind("click", __imgClickFun).bind("dragstart", function(event) {
			event.dataTransfer.setData("fileName", $("img", event.currentTarget).attr("fname"));
		});
	});
	$(document).scroll(__getMorePics);
	$(document).trigger("scroll");

}($, window));