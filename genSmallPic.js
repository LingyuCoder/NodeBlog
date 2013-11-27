var fs = require("fs"),
	gm = require("gm"),
	inputPath = "./public/gallary/",
	outputPath = "./public/gallary_sm/",
	async = require("async"),
	imageMagick = gm.subClass({
		imageMagick : true
	});

console.log("start:");

fs.readdir(inputPath, function(err, files){
	console.log(files.length);
	async.each(files, function(file, callback){
		var inputFile = inputPath + file,
			outputFile = outputPath + file;
		console.log(inputFile);
		imageMagick(inputFile).resize(200).write(outputFile, function(err){
			if(err) return console.log(file + "转换失败 ：" + err.message);
			console.log(file + "转换成功!");
		});
	}, function(err){
		if(err) return console.log(err.message);
		console.log("end.");
	});
});