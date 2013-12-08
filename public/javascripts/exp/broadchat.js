(function($, window) {
	var ws,
		$chat = $("#chat"),
		$users = $("#users"),
		$logs = $("#logs"),
		curUser = $chat.attr("nick");
	if (window.WebSocket === undefined) {
		$chat.text("您的浏览器不支持WebSocket！");
	}
	if (window.ws) {
		ws.close();
	}
	ws = new WebSocket("ws://localhost:3001");
	ws.onopen = function(event) {
		$("#nickname").val("游客");
		$logs.append("<div class='alert alert-success'>您已加入版聊</div>");
	};
	ws.onclose = function(event) {
		$logs.append("<div class='alert alert-danger'>您已断开版聊</div>");
	};
	ws.onmessage = function(event) {
		var data = JSON.parse(event.data);
		if (data.type === "message") {
			$chat.append("<p>" + data.nick + "(" + data.time + "): " + data.message + "</p>");
		} else if (data.type === "join") {
			if ($("p[uid='" + data.uid + "']", $users).length === 0) {
				$users.append("<p uid='" + data.uid + "'>" + data.nick + "</p>");
				$logs.append("<div class='alert alert-warning'>" + data.nick + "加入了版聊</div>");
			}
		} else if (data.type === "exit") {
			$("p[uid='" + data.uid + "']", $users).remove();
			$logs.append("<div class='alert alert-warning'>" + data.nick + "离开了版聊</div>");
		} else if (data.type === "nickname") {
			$("#nickname").val(data.nick);
			$("p[uid='" + data.uid + "']", $users).text(data.nick);
			$logs.append("<div class='alert alert-warning'>" + data.oldnick + " 修改昵称为 " + data.nick + "</div>");
		}
	};
	$("#send").click(function(event) {
		var message = $("#message").val();
		if (message.trim() !== "") {
			ws.send(JSON.stringify({
				time: new Date().getTime(),
				message: message,
				type: "message"
			}));
			$("#message").val("");
		}
	});
	$("#changeNick").click(function(event) {
		var nick = $("#nickname").val();
		if (nick.trim() !== "") {
			ws.send(JSON.stringify({
				nick: nick,
				type: "nickname"
			}));
		}
	});
	$("#message").bind("keypress", function(event) {
		if ((event.keyCode || event.which) == 13) {
			$("#send").click();
		}
	}).focus();
}(jQuery, window));