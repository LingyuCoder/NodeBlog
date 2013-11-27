var fs = require("fs"),
	gallary = require("../setting.js").gallary;

exports.gallaryPage = function(req, res) {
	res.render("gallary");
};

exports.listByPage = function(req, res) {
	var curPage = req.query.curPage || 0,
		perPage = Number(req.query.perPage) || 10;
	path = "public/" + gallary.name;
	fs.readdir(path, function(err, files) {
		var i,
			start = curPage * perPage,
			end,
			total;
		if (err) return res.json(500, {
			message: err.message
		});
		if (start > files.length) {
			res.json({
				files: [],
				total: files.length,
				gallary: gallary.name,
				gallary_small: gallary.small
			});
		} else {
			end = start + perPage > files.length ? files.length : start + perPage;
			res.json({
				files: files.slice(start, end),
				total: files.length,
				start: start,
				end: end,
				gallary_small: gallary.small,
				gallary: gallary.name
			});
		}
	});
};