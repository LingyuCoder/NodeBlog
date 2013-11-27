var fs = require('fs');
if(!fs.existsSync("upload_tmp")){
	fs.mkdirSync("upload_tmp");
}

if(!fs.existsSync("public/gallary_sm")){
	fs.mkdirSync("public/gallary_sm");
}

if(!fs.existsSync("public/gallary")){
	fs.mkdirSync("public/gallary");
}

module.exports = {
	//本地数据库测试
	host : process.env.DB || "mongodb://127.0.0.1:27017/myblog",
	gallary : {
		small : "gallary_sm",
		name : "gallary"
	},
	uploadDir : "upload_tmp"
};