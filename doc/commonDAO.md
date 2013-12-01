公用数据库连接层 [CommonDAO.js]
===
***
使用[node-mongodb-native](https://github.com/mongodb/node-mongodb-native)直接与mongodb数据库相连

提供以下方法：

 1. [save](#save)
 2. [findOne](#findone)
 3. [find](#find)
 4. [count](#count)
 5. [update](#update)
 6. [remove](#remove)

## save<a name="save"></a>
***
### 说明
> 用于将一个对象保存到mongodb数据库中

### 参数
> **collectionName** [string]：mongodb的collection名称

> **obj** [object] : 需要保存到collection中的对象

> **callback** [function]：保存完毕后执行的回调函数

>> **err** [object]： 若未发生错误，为null

>> **result** [array:object] ：result[0]为存入数据库的对象，若长度为0则保存失败

### 实例
```js
    commonDao.save("article", {
        id: uuid.v4,
        content: "hello world"
    }, function(err, result) {
        if (err) return callback(err);
        if (!result[0]) return callback(new Error("保存失败"));
        callback(err, new Article(result[0]));
    });
```

## findOne<a name="findone"></a>
***
### 说明
> 根据特定条件在数据库中查找一个匹配的对象

### 参数
> **collectionName** [string]： mongodb的collection名称

> **oArgs** [object]： mongodb查询时的条件

> **callback** [function]： 查询执行完后的回调函数，两个参数：

>> **err** [object]: 若未发生错误，则为null

>> **result** [object]:  查询结果

### 实例
根据文章id查找文章
```js
	commonDao.findOne("article", {
		id: id
	}, callback);
```

## find<a name="find"></a>
***
### 说明
> 根据特定条件和配置在数据库中查找所有匹配的对象

### 参数
> **collectionName** [string] : mongodb的collection名称

> **oArgs** [object] : mongodb查询的条件及分页、排序设置

>> **condition** [object] : mongodb查询的条件

>> **page** [object] : 查询的分页设置
> 
>>> **curPage** [integer] : 查询的页数，从0开始
> 
>>> **perPage** [integer] : 查询每页的个数
> 	
>> **sort** [object] : 查询的排序方式，键为排序的字段名称，值为**1**表示**正序**，值为**-1**表示倒序
>
> **callback** [function] : 查询完成之后的回调函数，有两个参数:
> 
>> **err** [object]: 若未发生错误，则为null
>
>> **results** [array:object]:  查询结果数组

### 实例
以创作时间为倒序，每页10个结果，查询第二页的所有文章
```js
	commonDao.find("article", {
		sort: {
			writeTime: -1
		},
		page: {
			curPage: 1,
			perPage: 10
		}
	}, callback);
```

## count<a name="count"></a>
***
### 说明
> 统计数据库中符合条件的对象个数

### 参数
> **collectionName** [string] : mongodb的collection名称
>
> **oArgs** [object] : 统计的条件
> 
> **callback** [function] : 统计完成后的回调函数，两个参数：
> > **err** [object] : 若未发生错误，则为null
> 
> > **total** [number] : 统计的结果 

### 实例
通过作者用户名查询文章
```js
	commonDao.count("article", {
		writer: username
	}, callback);
```
## update<a name="update"></a>
***
### 说明
> 更新所有符合条件的对象

### 参数
> **collectionName** [string] : mongodb的collection名称

> **oArgs** [object] : 查找需要被更新对象的条件

> **change** [object] : 需要被更新的数据，键为更新的字段名称，值为需要被更新的值

> **callback** [function] : 更新完成后的回调函数，一个参数：

>> **err** [object] : 若未发生错误，则为null

### 实例
更新一个文章的主题，内容，修改时间，及标签
```js
	commonDao.update("article", {
		id: this.id
	}, {
		content: this.content,
		title: this.title,
		lastModifyTime: new Date().getTime(),
		tags: this.tags
	}, callback);
```
## remove<a name="remove"></a>
***
### 说明
> 移除所有符合条件的对象

### 参数
> **collectionName** [string] : mongodb的collection名称

> **oArgs** [object] : 查找需要被删除对象的条件

> **callback** [function] : 删除完成后的回调函数，一个参数：

>> **err** [object] : 若未发生错误，则为null

### 实例
根据文章id删除一篇文章
```js
	commonDao.remove("article", {
		id: articleId
	}, callback);
```