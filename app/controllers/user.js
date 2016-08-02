var User = require('../models/user.js');
var bcrypt = require('bcrypt-nodejs');
//signup page
exports.showSignup = function(req, res) {
  res.render('signup', {
    title: '注册页面'
  })
};

//signin page
exports.showSignin = function(req, res) {
  res.render('signin', {
    title: '登录页面'
  })
};

//signin
exports.signin = function(req, res) {
  var _user = req.body;
  var name = _user.name;
  var password = _user.password;

  User.findOne({
    name: name
  }, function(err, user) {
    if (err) {
      console.log(err);
    }

    if (!user) {
      return res.send({
        state: '用户不存在'
      });
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log(err);
      }
      if (isMatch) {
        console.log('Password is match');
        return res.send({
          state: '密码匹配',
          user: user
        });
      } else {
        console.log('Password is not match');
        return res.send({
          state: '密码不匹配',
          user: user
        })
      }
    })
  })
};

//signup page
exports.signup = function(req, res) {
  var _user = req.body;
  User.findOne({
    name: _user.name
  }, function(err, user) {
    //find返回的是 '列表'，没找到就是[], findOne返回的是单个对象，没找到匹配就是null
    if (err) {
      console.log(err);
    }
    if (user) {
      return res.send('请登录');
    } else {
      var user = new User(_user);

      user.save(function(err, user) {
        if (err) {
          console.log(err);
        }
        console.log('用户注册成功');
        return res.send({
          status: 'Saved'
        });
      });
    }
  })
};

//logout page
exports.logout = function(req, res) {
  delete req.session.user;
  // delete app.locals.user;//登出之后不能够清除“欢迎您,XX”

  res.redirect('/');
};

//userlist page
exports.list = function(req, res) {
  User.fetch(function(err, users) {
    if (err) {
      console.log(err);
    }
    res.render('userlist', {
      title: '用户列表页',
      users: users
    })
  });
};

//check duplicated
exports.check = function(req, res) {
  return User.findByName(req.params.name, function(err, user) {
    if (!user) {
      return res.send({
        status: 'Duplicate'
      });
    } else {
      return res.send({
        status: 'OK',
        user: user
      });
    }
  })
}

// update password
exports.update = function(req, res) {
  var _user = req.body;
  var name = _user.name;
  var oldPassword = _user.oldPassword;
  var newPassword = _user.newPassword;
  User.findOne({
    name: name
  }, function(err, user) {
    if (err) {
      console.log(err);
    }

    if (!user) {
      return res.send({
        status: '用户不存在'
      });
    }

    user.comparePassword(oldPassword, function(err, isMatch) {
      if (err) {
        console.log(err);
      }
      if (isMatch) {
        console.log('Password is match');
        bcrypt.hash(newPassword, null, null, function(err, hash) {
          if (err) {
            console.log(err);
          }
          User.findOneAndUpdate({
            'name': name
          }, {
            'password': hash
          }, function(err, user) {
            if (err) {
              return res.send({
                status: 'ERROR'
              });
            } else {
              return res.send({
                status: 'OK',
                user: user
              })
            }
          });
        });
      } else {
        console.log('Password is not match');
        return res.send({
          status: '密码不匹配',
        })
      }
    })
  })
};

//query all info
exports.query = function(req, res) {
  return User.fetch(function(err, user) {
    if(err){
      return res.send({
        status:'fail'
      })
    }else{
      if (!user) {
        return res.send({
          status: 'nobody'
        });
      } else {
        return res.send({
          status: 'got',
          user: user
        });
      }
    }
  })
}
