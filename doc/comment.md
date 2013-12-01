评论 [Comment]
===
***
#构造函数
***
```js
function Comment(comment) {
	this.comment = comment.comment;
	this.username = comment.username;
	this.reply = comment.reply;
	this.articleId = comment.articleId;
	this.time = comment.time;
	this.id = comment.id;
}
```
#属性
***
> **id** [string] : 评论的id，uuid的v4生成

> **articleId** [string] : 评论所属文章的id

> **username** [string] : 创建这条评论的用户名

> **comment** [string] : 评论的内容

> **time** [number] : 评论的时间，为毫秒数

> **reply** [string] : 若本评论回复了其他评论，则reply的值为被回复的评论的id，否则为null

#原型上的方法
***
##save
### 说明
> 保存当前评论对象

### 参数
> **callback** [function] : 保存完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **result** [Comment] ：持久化后的Comment对象


### 实例
```js
var comment = new Comment({
	articleId: req.body.articleId,
	username: req.session.user.username,
	comment: req.body.comment,
	reply: req.body.replyId
});
comment.save(function(err, comment) {
	if (err) return callback(err);
	callback(err, comment);
});
```

##remove
### 说明
> 删除当前评论

### 参数
> **callback** [function] : 删除完成后的回调函数，一个参数

>> **err** [object]： 若未发生错误，为null


### 实例
```js
comment.remove(function(err) {
	if (err) return res.json(500, {
		message: err.message
	});
	res.json({
		success: true
	});
});
```
#方法
***
##get
### 说明
> 根据评论id获取一个评论

### 参数
> **commentId** [string] : 需要获取的评论的id

> **callback** [function] : 获取完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **comment** [Comment]: 获取的评论对象，没有则为null


### 实例
```js
Comment.get(req.body.commentId, function(err, comment) {
	//TODO
});
```

##countByArticle
###说明
> 统计一篇文章的评论个数

###参数
> **articleId** [string]: 文章的id

> **callback** [function] : 统计完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **total** [number]: 该文章的评论总数

###实例
```js
Comment.countByArticle(req.body.articleId, function(err, total) {
	if (err) return res.json(500, {
		message: err.message
	});
	res.json({
		total: total
	});
});
```

##getByArticle
### 说明
> 分页获取一篇文章的评论

### 参数
> **articleId** [string] : 文章的id

> **curPage** [integer] : 当前页，从0开始

> **perPage** [integer] : 每页的文章个数

> **callback** [function] : 获取完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **comments** [array:Comment]: 获取的评论对象列表

### 实例
```js
Comment.getByArticle(req.body.articleId, Number(req.body.curPage), Number(req.body.perPage), function(err, comments) {
	var i;
	if (err) return res.json(500, {
		message: err.message
	});
	for (i = comments.length; i--;) {
		comments[i].time = moment(comments[i].time).format("HH:mm MM月DD日 YYYY年");
	}
	res.json({
		comments: comments
	});
});
```

##countByUser
###说明
> 统计一个用户的评论个数

###参数
>  **username** [string]: 用户的用户名

> **callback** [function] : 统计完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **total** [number]: 该用户的评论总数

###实例
```js
Comment.countByUser(req.body.username, function(err, total) {
	if (err) return res.json(500, {
		message: err.message
	});
	res.json({
		total: total
	});
});
```

##getByUser
### 说明
> 分页获取一个用户的评论

### 参数
> **username** [string]: 用户的用户名

> **curPage** [integer] : 当前页，从0开始

> **perPage** [integer] : 每页的文章个数

> **callback** [function] : 获取完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **comments** [array:Comment]: 获取的评论对象列表

### 实例
```js
Comment.getByUser(req.body.username, Number(req.body.curPage), Number(req.body.perPage), function(err, comments) {
	if (err) return res.json(500, {
		message: err.message
	});
	for (var i = comments.length; i--;) {
		comments[i].time = moment(comments[i].time).format("HH:mm MM月DD日 YYYY年");
	}
	res.json({
		comments: comments
	});
});
```

