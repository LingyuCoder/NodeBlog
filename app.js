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
	remind = require('./routes/Actions/RemindAction.js'),
	http = require('http'),
	path = require('path'),
	setting = require('./routes/setting.js'),
	fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon(path.join(__dirname, './public/images/favicon.ico')));
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
app.use(function(err, req, res, next) {
	res.redirect("/404/404.html");
});

app.get('/', routes.index);
app.get('/index', routes.index);
app.get('/advicePage', routes.advicePage);
app.get('/userCenter', routes.userCenter);
//用户
app.get('/user_loginPage', user.loginPage);
app.get('/user_registPage', user.registPage);
app.get('/nor/user_detail', user.loadDetail);
app.post('/user_getDetail', user.getDetail);
app.post('/user_regist', user.regist);
app.post('/user_login', user.login);
app.post('/nor/user_modify', user.modify);
app.get('/user_logout', user.logout);
//文章
app.get('/nor/conf/article_write', article.writePage);
app.get('/nor/conf/article_edit', article.editPage);
app.post('/nor/conf/article_remove', article.remove);
app.get('/article_load', article.load);
app.post('/nor/conf/article_save', article.save);
app.post('/nor/conf/article_update', article.update);
app.get('/article_list', article.listByPage);
app.post('/article_getOne', article.getOne);
app.post('/article_getByUser', article.getByUser);
app.post('/article_countByUser', article.countByUser);
app.post('/article_getAll', article.listAll);
//图片墙
app.get('/gallary', gallary.gallaryPage);
app.get('/gallary_list', gallary.listByPage);
//图片墙图片上传
//上传时进行图片压缩，需要imageMagick
//app.post('/nor/conf/picture_uploadDirect', picture.uploadDirect);
//不经过有损压缩的版本
app.post('/nor/conf/picture_uploadDirect', picture.uploadDirectNoCompress);
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
app.post('/nor/comment_remove', comment.remove);
app.post('/comment_countByArticle', comment.countByArticle);
app.post('/comment_getOne', comment.getOne);
app.post('/comment_countByUser', comment.countByUser);
app.post('/comment_getByUser', comment.getByUser);
//点赞
app.post('/nor/admire_checkAdmired', admire.checkAdmired);
app.post('/nor/admire_add', admire.add);
app.post('/nor/admire_remove', admire.remove);
app.post('/admire_getOne', admire.getOne);
app.post('/admire_getByUser', admire.getByUser);
app.post('/admire_countByUser', admire.countByUser);
app.post('/admire_countByComment', admire.countByComment);
//收藏
app.post('/nor/bookmark_add', bookmark.save);
app.post('/nor/bookmark_remove', bookmark.remove);
app.post('/bookmark_countByArticle', bookmark.countByArticle);
app.post('/nor/bookmark_checkBooked', bookmark.checkBooked);
app.post('/bookmark_getOne', bookmark.getOne);
app.post('/bookmark_getByUser', bookmark.getByUser);
app.post('/bookmark_countByUser', bookmark.countByUser);
//提醒
app.post('/nor/remind_remove', remind.remove);
app.post('/nor/remind_setReaded', remind.setReaded);
app.post('/nor/remind_getAll', remind.getAll);
app.post('/nor/remind_getByType', remind.getByType);
app.post('/nor/remind_countAll', remind.countUnreadAll);
app.post('/nor/remind_countByType', remind.countUnreadByType);
http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});