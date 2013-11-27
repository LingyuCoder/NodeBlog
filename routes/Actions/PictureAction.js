var setting = require("../setting.js"),
	fs = require("fs"),
	async = require("async"),
	gm = require("gm"),
	path = require("path"),
	imageMagick = gm.subClass({
		imageMagick: true
	}),
	uuid = require("node-uuid"),
	util = require("util"),
	__copyFile = function copyFile(file, toDir, callback) {
		var reads = fs.createReadStream(file);
		var writes = fs.createWriteStream(path.join(path.dirname(toDir), path.basename(file)));
		reads.pipe(writes);
		//don't forget close the  when  all the data are read  
		reads.on("end", function() {
			writes.end();
			callback(null);
		});
		reads.on("error", function(err) {
			console.log("error occur in reads");
			callback(true, err);
		});
	};

exports.remove = function(req, res) {
	var fileName = req.body.fileName,
		smallFile = "public/" + setting.gallary.small + "/" + fileName,
		orignFile = "public/" + setting.gallary.name + "/" + fileName;
	try {
		fs.unlinkSync(smallFile);
		fs.unlinkSync(orignFile);
	} catch (e) {
		return res.json(500, {
			message: e.message
		});
	}
	res.json({
		success: true
	});

};

exports.uploadDirect = function(req, res) {
	var inputFile = req.files.image.path,
		fileName = new RegExp('^' + setting.uploadDir + '\\\\([\\w-\\.]+)$').exec(inputFile)[1],
		resizeFile = "public/" + setting.gallary.small + "/" + fileName,
		outputFile = "public/" + setting.gallary.name + "/" + fileName;
	async.waterfall([

		function(callback) {
			imageMagick(inputFile).write(outputFile, function(err) {
				if (err) return callback(err);
				callback(null);
			});
		},
		function(callback) {
			imageMagick(inputFile).resize(400).write(resizeFile, function(err) {
				if (err) return callback(err);
				callback(null);
			});
		},
		function(callback) {
			if (fs.existsSync(inputFile)) {
				fs.unlink(inputFile, function(err) {
					if (err) return callback(err);
					callback(null);
				});
			} else {
				callback(new Error("未找到文件"));
			}
		}
	], function(err) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			success: true,
			fileName: fileName,
			gallary: setting.gallary.name,
			gallary_small: setting.gallary.small
		});
	});
};

exports.uploadDirectNoCompress = function(req, res) {
	var inputFile = req.files.image.path,
		fileName = (/^upload_tmp\/([\w\-\.]+)$/.exec(inputFile) || /^upload_tmp\\([\w\-\.]+)$/.exec(inputFile))[1],
		resizeFile = "public/" + setting.gallary.small + "/" + fileName,
		outputFile = "public/" + setting.gallary.name + "/" + fileName;
	async.waterfall([

		function(callback) {
			__copyFile(inputFile, resizeFile, callback);
		},
		function(callback) {
			__copyFile(inputFile, outputFile, callback);
		},
		function(callback) {
			if (fs.existsSync(inputFile)) {
				fs.unlink(inputFile, function(err) {
					if (err) return callback(err);
					callback(null);
				});
			} else {
				callback(new Error("未找到文件"));
			}
		}
	], function(err) {
		if (err) return res.json(500, {
			message: err.message
		});
		res.json({
			success: true,
			fileName: fileName,
			gallary: setting.gallary.name,
			gallary_small: setting.gallary.small
		});
	});
};
