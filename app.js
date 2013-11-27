/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/Actions/UserAction.js'),
	article = require('./routes/Actions/ArticleAction.js'),
	comment = require('./routes/Actions/CommentAction.js'),
	admire = require('./routes/Actions/AdmireAction.js'),
	bookmark = require('./routes/Actions/BookmarkAction.js'),
	tag = require('./routes/Actions/TagAction.js'),
	gallary = require('./routes/Actions/GallaryAction.js'),
	picture = require('./routes/Actions/PictureAction.js'),
	http = require('http'),
	path = require('path'),
	setting = require('./routes/setting.js'),
	fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({
	keepExtensions: true,
	uploadDir: setting.uploadDir
}));
app.use(express.methodOverride());
app.use(express.cookieParser('wly'));
app.use(express.session({
	secret: "lingyucoder"
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
	if (req.session.user) {
		res.locals({
			user: req.session.user
		});
	}
	next();
});

app.use('/nor/', function(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		return res.render("login", {
			message: "请登录后进行该操作..."
		});
	}
});

app.use('/nor/conf/', function(req, res, next) {
	if (req.session.user && req.session.user.owner) {
		next();
	} else {
		return res.render("error", {
			message: "该操作需要管理员权限"
		});
	}
});
app.use(app.router);
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}



app.get('/', routes.index);
app.get('/index', routes.index);
app.get('/advicePage', routes.advicePage);
app.get('/userCenter', routes.userCenter);

app.get('/user_loginPage', user.loginPage);
app.get('/user_registPage', user.registPage);
app.get('/nor/user_detail', user.loadDetail);
app.post('/user_getDetail', user.getDetail);
app.post('/user_regist', user.regist);
app.post('/user_login', user.login);
app.post('/nor/user_modify', user.modify);
app.get('/user_logout', user.logout);
app.get('/nor/conf/article_write', article.writePage);
app.get('/nor/conf/article_edit', article.editPage);
app.get('/nor/conf/article_delete', article.deleteArticle);
app.get('/article_load', article.loadArticle);
app.post('/nor/conf/article_save', article.saveArticle);
app.post('/nor/conf/article_update', article.updateArticle);
app.get('/article_list', article.listArticlesByPage);

app.get('/nor/admire_addAdmire', admire.addAdmire);
app.get('/nor/admire_removeAdmire', admire.removeAdmire);

app.get('/gallary', gallary.gallaryPage);
app.get('/gallary_list', gallary.listByPage);

app.get('/nor/conf/picture_uploadPage', picture.uploadPage);
app.post('/nor/conf/picture_upload', picture.upload);
//上传时进行图片压缩，需要imageMagick
//app.post('/nor/conf/picture_uploadDirect', picture.uploadDirect);
app.post('/nor/conf/picture_uploadDirect', picture.uploadDirectNoCompress);
app.post('/nor/conf/picture_uploadCancel', picture.uploadCancel);
app.post('/nor/conf/picture_confirm', picture.confirm);
app.post('/nor/conf/picture_delete', picture.remove);
//标签
app.post('/nor/tag_create', tag.create);
app.post('/tag_listAll', tag.listAll);
app.post('/tag_listFuzzy', tag.listFuzzy);
app.post('/tag_listUserTags', tag.listUserTags);
app.post('/tag_listArticleTags', tag.listArticleTags);
//评论
app.post('/comment_getByArticle', comment.getByArticle);
app.post('/nor/comment_addComment', comment.save);
app.post('/nor/comment_delete', comment.remove);
//点赞
app.post('/nor/admire_checkAdmire', admire.checkAdmire);
app.post('/nor/admire_countByComment', admire.countByComment);
//收藏
app.post('/nor/bookmark_addBookmark', bookmark.save);
app.post('/nor/bookmark_removeBookmark', bookmark.remove);
app.post('/bookmark_countByArticle', bookmark.countByArticle);
app.post('/nor/bookmark_checkBooked', bookmark.checkBooked);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});