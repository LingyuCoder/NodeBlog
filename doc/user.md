用户 [User]
===
***
#构造函数
```js
function User(user) {
	this.username = user.username;
	this.nickname = user.nickname;
	this.password = user.password;
	this.owner = user.owner;
	this.avatar = user.avatar;
	this.tags = user.tags;
}
```
# 属性
***
> **username** [string] : 用户名，需手动保持唯一

> **nickname** [string] : 用户昵称

> **password** [string] : 用户密码

> **owner** [boolean] : 用户是否为博客管理员

> **avatar** [string] : 用户头像的url

> **tags** [array:string] : 用户的标签列表，元素为标签的id  

# 原型上的方法
***
## save
### 说明
> 保存当前用户

### 参数
> **callback** [function] : 保存完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **result** [Article] ：持久化后的User对象

### 实例
```js
var user = new User({
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    avatar: "/images/default_avatar.jpg",
    owner: false,
    tags: []
});
user.save(function(err) {
    if (err) {
      return res.render("regist", {
        message: "发生错误，请稍后重试..."
      });
    } else {
      req.session.user = user;
      res.redirect("/index");
    }
});
```
## update
### 说明
> 更新当前用户

### 参数
> **callback** [function] : 更新完成后的回调函数，一个参数

>> **err** [object]： 若未发生错误，为null

### 实例
```js
user.update(function(err) {
	req.session.user = user;
	res.render("userDetail", {
		user: req.session.user,
		success: true,
		message: "修改成功..."
	});
});
```
## remove
### 说明
> 删除当前用户

### 参数
> **callback** [function] : 删除完成后的回调函数，一个参数

>> **err** [object]： 若未发生错误，为null


### 实例
```js
user.remove(function(err) {
    if(err){
        return res.render("error", {
             message: err.message
	});
    }
    //do something after removing
});
```
# 方法
***
## get
### 说明
> 根据用户的用户名，获取用户详细信息

### 参数
> **username** [string] : 需要获取的用户的id

> **callback** [function] : 获取完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **user** [User] : 该用户对象，没有则为null


### 实例
```js
User.get(req.body.username, function(err, user) {
	if (err) return res.render("error", {
		message: err.message
	});
	res.json({
		username: user.username,
		nickname: user.nickname,
		owner: user.owner,
		tags: user.tags,
		avatar: user.avatar
	});
});
```

## countAll
### 说明
> 统计系统中所有用户个数

### 参数
> **callback** [function] : 删除完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **total** [number] : 系统中的用户总数


### 实例
```js
User.count(function(err, total) {
	if(err) return res.json(500);
	return res.json({
		total: total
	});
});
```
## getAll
### 说明
> 分页获取系统中所有用户

### 参数
> **curPage** [integer] : 当前页，从0开始

> **perPage** [integer] : 每页用户个数

> **callback** [function] : 删除完成后的回调函数，两个参数

>> **err** [object]： 若未发生错误，为null

>> **users** [array:User] : 获取的用户对象数组


### 实例
```js
User.getAll(1, 10, function(err, useres) {
	if(err) return res.render("error");
	return res.render("showUsers",{
		useres: useres
	});
});
```
