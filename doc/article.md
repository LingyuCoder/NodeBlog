文章 [Article]
===
***
# 构造函数
***
```js
	function Article(article) {
		this.content = article.content;
		this.title = article.title;
		this.writer = article.writer;
		this.id = article.id;
		this.writeTime = article.writeTime;
		this.lastModifyTime = article.lastModifyTime;
		this.tags = article.tags;
	}
```

# 属性
***
> **id** [string] : uuid的v4生成的字符串

> **title** [string] : 文章的标题

> **writer** [string] : 文章作者的用户名

> **content** [string] : 文章的内容，未转换为html

> **writeTime** [number] : 文章写作时间，为1970到现在的毫秒数

> **lastModifyTime** [number] : 文章最后修改的时间，为1970到现在的毫秒数

> **tags** [array:string] : 文章的标签列表，元素为标签的id

# 原型上的方法
***
## save
### 说明
> 保存当前文章对象

### 参数
> **callback** [function] : 保存完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **result** [Article] ：持久化后的Article对象


### 实例
```js
	var article = new Article({
		writer: req.session.user.username,
		content: req.body.content,
		title: req.body.title,
		tags: JSON.parse(req.body.tags)
	});
	article.save(function(err, art) {
		if (err) return res.render("err", {
			message: "保存文章失败"
		});
		res.redirect("/article_load?articleId=" + art.id);
	});
```

## update
### 说明
> 更新当前对象

### 参数
> **callback** [function] : 更新完成后的回调函数，一个参数

>> **err** [object]： 若未发生错误，为null

###实例
```js
	Article.get(articleId, function(err, article) {
		if (err) return res.json(500, {
			message: err.message
		});
		article.title = req.body.title;
		article.content = req.body.content;
		article.tags = JSON.parse(req.body.tags);
		article.update(function(err) {
			if (err) return res.json(500, {
				message: err.message
			});
			res.json("editArticle", {
				success: true
			});
		});
	});
```
## remove
### 说明
> 删除当前对象

### 参数
> **callback** [function] : 删除完成后的回调函数，一个参数

>> **err** [object]： 若未发生错误，为null

###实例
```js
	Article.get(req.query.articleId, function(err, article) {
		if (err) return res.json(500, {
			message: err.message
		});
		article.remove(function(err) {
			if (err) return res.json(500, {
				message: err.message
			});
			res.json({
				success: true
			});
		});
	});
```

# 方法
***
## get
### 说明
> 根据文章id获取一个文章

### 参数
> **articleId** [string] : 文章的id

> **callback** [function] : 获取后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **article** [Article] : 获取到的文章对象，没有则为null

### 实例
```js
	Article.get(req.query.articleId, function(err, article) {
		//balabala
	});
```

## countAll
### 说明
> 统计所有用户的所有文章个数

### 参数
> **callback** [function] : 获取到文章总数后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **total** [Article] : 文章总数

### 实例
```js
	Article.countAll(function(err, total) {
		if (err) return callback(err);
		callback(err, articles, total);
	});
```
##getAll
### 说明
> **分页**获取所有用户的文章

### 参数
> **curPage** [integer] : 当前页，从0开始

> **perPage** [integer] : 每页的文章数量

> **callback** [function] : 获取到文章后的回调函数，两个参数：

>> **err** [object]： 若未发生错误，为null

>> **articles** [array:Article]： 获取到的文章对象列表

### 实例
```js
	Article.getAll(page, artPerPage, function(err, articles) {
		if (err) return callback(err);
		callback(err, articles);
	}); 
```
##countByUser
### 说明
> 统计某一用户的所有文章个数

### 参数
> **username** [string] : 需要获取文章的用户名

> **callback** [function] : 获取到文章总数后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **total** [Article] : 文章总数

### 实例
```js
	Article.countByUser(req.body.username, function(err, total) {
		if (err) return res.json(500);
		res.json({
			total: total
		});
	});
```
##getByUser
### 说明
> **分页**获取某一用户的文章

### 参数
> **username** [string] : 需要获取文章的用户名

> **curPage** [integer] : 当前页，从0开始

> **perPage** [integer] : 每页的文章数量

> **callback** [function] : 获取到文章后的回调函数，两个参数：

>> **err** [object]： 若未发生错误，为null

>> **articles** [array:Article]： 获取到的文章对象列表

### 实例
```js
	Article.getByUser(req.body.username, Number(req.body.curPage), Number(req.body.perPage), function(err, articles) {
		if (err) return res.json(500);
		for (var i = articles.length; i--;) {
			articles[i].writeTime = moment(articles[i].writeTime).format("YYYY年MM月DD日");
		}
		res.json({
			articles: articles
		});
	});
```