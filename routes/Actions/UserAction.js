var User = require("../Model/User.js"),
  async = require("async"),
  Bookmark = require("../Model/Bookmark.js"),
  Admire = require("../Model/Admire.js"),
  Article = require("../Model/Article.js"),
  Comment = require("../Model/Comment.js"),
  moment = require("moment");
exports.loginPage = function(req, res) {
  res.render('login');
};

exports.registPage = function(req, res) {
  res.render('regist');
};

exports.login = function(req, res) {
  User.get(req.body.username, function(err, user) {
    if (err) return req.render("error", {
      message: "发生错误，请稍后重试..."
    });
    if (user && user.password === req.body.password) {
      req.session.user = user;
      res.redirect("/index");
    } else {
      res.render("login", {
        message: "用户名或密码错误..."
      });
    }
  });
};

exports.logout = function(req, res) {
  if (typeof req.session.user !== "undefined") {
    delete req.session.user;
  }
  res.redirect("index");
};

exports.loadDetail = function(req, res) {
  res.render("userDetail", {
    user: req.session.user
  });
};

exports.getDetail = function(req, res) {
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
};

exports.modify = function(req, res) {
  var tags = JSON.parse(req.body.tags);
  User.get(req.session.user.username, function(err, user) {
    if (err) return res.render("error", {
      message: err.message
    });
    if (user) {
      user.nickname = req.body.nickname;
      user.tags = tags;
      if (req.body.password) {
        user.password = req.body.password;
      }
      user.avatar = req.body.avatar || "/images/default_avatar.jpg";
      user.update(function(err) {
        req.session.user = user;
        res.render("userDetail", {
          user: req.session.user,
          success: true,
          message: "修改成功..."
        });
      });
    } else {
      res.render("userDetail", {
        user: req.session.user,
        success: false,
        message: "修改失败，用户不存在..."
      });
    }
  });
};

exports.regist = function(req, res) {
  User.get(req.body.username, function(err, user) {
    if (err) return res.render("error", {
      message: err.message
    });
    if (user) {
      return res.render("regist", {
        message: "用户名已被注册..."
      });
    } else {
      user = new User({
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
    }
  });
};