书签 [Bookmark]
===
***
#构造函数
```js
function Bookmark(bookmark) {
	this.username = bookmark.username;
	this.articleId = bookmark.articleId;
	this.time = bookmark.time;
	this.id = bookmark.id;
}
```
#属性
> **id** [string] : uuid v4生成的字符串

> **username** [string] : 书签拥有者的用户名

> **articleId** [string] : 书签所属文章的id

> **time** [number] : 创建书签的时间，为毫秒数

#原型上的方法
***
##save
###说明
> 保存当前书签对象

###参数
> **callback** [function] : 保存完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **result** [Bookmark] ：持久化后的Bookmark对象

###实例
```js
var bookmark = new Bookmark({
	articleId: req.body.articleId,
	username: req.session.user.username
});
bookmark.save(function(err, bookmark) {
	//TODO
});
```

##remove
###说明
> 移除当前书签对象

###参数
> **callback** [function] : 移除完成后的回调函数，一个参数

>> **err** [object]： 若未发生错误，为null

###实例
```js
bookmark.remove(function(err) {
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
###说明
> 根据书签id获取一个书签

###参数
> **bookmarkId** [string] : 书签的id

> **callback** [function] : 移除完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **bookmark** [Bookmark] : 获取到的书签对象，若失败，则为null

###实例
```js
Bookmark.get(req.body.bookmarkId, function(err, bookmark) {
	if (err) return res.json(500);
	if (!bookmark) return res.status(404).send("not found");
	bookmark.time = moment(bookmark.time).format("HH:mm MM月DD日 YYYY年");
	res.json({
		bookmark: bookmark
	});
});
```
##checkBooked
###说明
> 判断一个用户是否收藏了某篇文章

###参数
> **username** [string] : 用户的用户名

> **articleId** [string] : 文章的id

> **callback** [function] : 移除完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **booked** [boolean] : 若已经加入收藏，则为true，否则为false

###实例
```js
Bookmark.checkBooked(req.session.user.username, req.body.articleId, function(err, booked) {
	if (err) return res.json(500, {
		message: err.message
	});
	res.json({
		booked: booked
	});
});
```

##countByArticle
###说明
> 统计一篇文章的被收藏次数

###参数
> **articleId** [string] : 文章的id

> **callback** [function] : 移除完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **total** [number] : 文章被收藏次数

###实例
```js
Bookmark.countByArticle(req.body.articleId, function(err, total) {
	if (err) return res.json(500, {
		message: err.message
	});
	res.json({
		total: total
	});
});
```

##countByUser
###说明
> 统计一个用户的书签总个数

###参数
> **username** [string] :用户的用户名

> **callback** [function] : 移除完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **total** [number] : 用户的书签总个数

###实例
```js
Bookmark.countByUser(req.body.username, function(err, total) {
	if (err) return res.json(500);
	res.json({
		total: total
	});
});
```
##getByUser
###说明
> 分页获取一个用户的所有书签

###参数
> **username** [string] :用户的用户名

> **curPage** [integer] : 当前页，从0开始

> **perPage** [integer] : 每页的书签个数

> **callback** [function] : 查询完成后的回调函数

>> **err** [object]： 若未发生错误，为null

>> **bookmarks** [array:Bookmark] : 获取到的书签对象的数组

###实例
```js
Bookmark.getByUser(req.body.username, Number(req.body.curPage), Number(req.body.perPage), function(err, bookmarks) {
	if (err) return res.json(500);
	for (var i = bookmarks.length; i--;) {
		bookmarks[i].time = moment(bookmarks[i].time).format("HH:mm MM月DD日 YYYY年");
	}
	res.json({
		bookmarks: bookmarks
	});
});
```
