// 创建appServer模块
var appServer = angular.module('appServer', []);

// 使用Module.factory返回服务对象Auth
appServer.factory('Auth', ['$window', function($window) {
  var _user = {};
  _user.role = 0;
  var setUser = function(user, deferred) {
    _user = user;
    var Days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 0.5 * 60 * 60 * 1000);
    // 添加cookie
    document.cookie = "name=" + user.name + ";expires=" + exp.toGMTString();
    document.cookie = "role=" + user.role + ";expires=" + exp.toGMTString();
    deferred.resolve('成功生成cookie');
  }

  var getUser = function() {
    var name = document.cookie.match(/(^| )name=([^;]*)(;|$)/);
    if (name) {
      name = name[2]
    }
    return name;
  }

  var getUserRole = function(){
    var role = document.cookie.match(/(^| )role=([^;]*)(;|$)/);
    if(role){
      role = role[2];
    }
    return role;
  }

  var logOut = function() {
    //删除cookie中的name项
    var name = getUser().split('=')[1];
    var date = new Date();
    //删除cookie只需把过期时间设置为已经过去的时间即可
    date.setTime(date.getTime() - 10000);
    document.cookie = "name=" + name + ";expires=" + date.toGMTString();
    console.log('cookie删除成功');
  }

  var isAuthorized = function(lvl){
    return _user.role >= lvl;
  }

  return {
    isAuthorized:function(lvl){
      return isAuthorized(lvl);
    },
    setUser: function(user, deferred) {
      return setUser(user, deferred);
    },
    isLoggedIn: function() {
      return getUser() ? true : false;
    },
    logOut: function() {
      return logOut();
    },
    getUser: function() {
      return getUser();
    },
    getUserRole:function(){
      return getUserRole();
    }
  }
}])

// 使用Module.factory返回服务对象articleStorage
appServer.factory('articleStorage', ['$window', function($window) {
  //检测浏览器是否支持h5的localStorage
  var isSupportLocalStorage = function() {
    if ($window.localStorage == 'undefined') {
      return 'false';
    } else {
      return 'true';
    }
  }

  // 检查本地是否存有article数据
  var hasArticleStorage = function() {
    if ($window.localStorage['article']) {
      return 'true';
    } else {
      return 'false';
    }
  }

  // 保存article至本地
  var setArticleStorage = function(data) {
    $window.localStorage['article'] = JSON.stringify(data);
    console.log('文章已保存在本地了');
  }

  // 从本地取出article
  var getArticleStorage = function() {
    console.log('从本地取出文章');
    return JSON.parse($window.localStorage['article']);
  }

  // 清空本地内容
  var clearArticleStorage = function() {
    console.log('清空本地内容');
    return $window.localStorage.removeItem('article');
  }

  // 通过文章名查询本地是否存有数据，查到返回
  var getArticleByName = function(articleName, deferred) {
    console.log('查询' + articleName);
    var articleData = JSON.parse($window.localStorage['article']);
    for (var i = 0; i < articleData.length; i++) {
      (function() {
        var index = i;
        if (articleData[index].title == articleName) {
          deferred.resolve(articleData[index]);
          return articleData[index];
        }
      }())
    }
  }

  return {
    isSupportLocalStorage: function() {
      return isSupportLocalStorage();
    },
    hasArticleStorage: function() {
      return hasArticleStorage();
    },
    setArticleStorage: function(data) {
      return setArticleStorage(data);
    },
    getArticleStorage: function() {
      return getArticleStorage();
    },
    clearArticleStorage: function() {
      return clearArticleStorage();
    },
    getArticleByName: function(articleName, deferred) {
      return getArticleByName(articleName, deferred);
    }
  }
}])

// 使用Module.factory返回服务对象eventEmmiter
appServer.factory('eventEmmiter',['$rootScope','$timeout',function($rootScope,$timeout){
  var toBroadCast = function(eventType,arg1,arg2,arg3){
    $timeout(function(){
      console.log('$rootScope发射事件中。。。');
      $rootScope.$broadcast(eventType,arg1,arg2,arg3);
    })
  }
  return {
    toBroadCast: function(eventType, arg1,arg2,arg3) {
      return toBroadCast(eventType, arg1,arg2,arg3);
    }
  }
}])
