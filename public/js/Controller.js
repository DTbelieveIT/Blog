// 创建appController模块
var appController = angular.module('appController', []);

//signupCtrl控制器
appController.controller('signupCtrl', ['$scope', '$resource', '$uibModal', '$location', function($scope, $resource, $uibModal, $location) {
  $scope.reg = {};
  $scope.postReg = function() {
    var User = $resource('/user/signup');
    User.save({}, {
      name: $scope.reg.name,
      password: $scope.reg.password
    }, function(data) {
      console.log('新用户添加成功');
      $location.path('/Welcome/index')
    }, function(err) {
      console.log(err);
    })
  }
}])


// indexCtrl控制器
appController.controller('indexCtrl', ['$scope', '$uibModal', '$location', function($scope, $uibModal, $location) {
  $scope.signin = function(size) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'signin.html',
      controller: 'ModalLogIn',
      size: 'size',
      resolve: {}
    });
    modalInstance.result.then(function(data) {
      console.log(data);
    }, function() {
      console.log('open fail!');
    })
  }
  $scope.signup = function(size) {
    $location.path('/Welcome/signup');
  }
}]);

//signinCtrl控制器
appController.controller('signinCtrl', ['$scope', '$resource', '$uibModal', '$rootScope', 'Auth', function($scope, $resource, $uibModal, $rootScope, Auth) {
  $scope.signin = function(size) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'signin.html',
      controller: 'ModalLogIn',
      size: 'size',
      resolve: {}
    });
    modalInstance.result.then(function() {
      console.log('open success!');
    }, function() {
      console.log('open fail!');
    })
  }

  $scope.logout = function() {
    console.log('登出中...');
    //session logout
    Auth.logOut();
    console.log('登出成功');
    $rootScope.rootCtrlScope.username = null;
  }
}])

// ModalLogIn控制器
appController.controller('ModalLogIn', ['$scope', '$uibModalInstance', '$resource', '$location', '$q', '$rootScope', 'Auth', function($scope, $uibModalInstance, $resource, $location, $q, $rootScope, Auth) {
  // 初始化登录项
  $scope.login = {};
  $scope.login.isLoggin = false;
  $scope.login.title = '登录';
  $scope.login.showTip1 = false;
  $scope.login.showTip2 = false;
  $scope.login.isPasswordMatch = true;
  // 提交请求
  $scope.submit = function() {
    // 配置resource服务
    var User = $resource('/user/signin');
    console.log($scope.login.name);
    console.log($scope.login.password);
    //User.save(params, payload, successFn, errorFn);相当于POST请求
    User.save({}, {
      name: $scope.login.name,
      password: $scope.login.password
    }, function(data) {
      if (data.state == '用户不存在') {
        console.log('用户不存在');
        $scope.login.showTip1 = true;
        // $location.path('Welcome/signup');
      } else {
        $scope.login.showTip1 = false;
        if (data.state == '密码匹配') {
          console.log('登录成功');
          // 使用承诺
          var deferred = $q.defer();
          var promise = deferred.promise;
          Auth.setUser(data.user, deferred);
          promise.then(function(data1) {
            console.log(data1);
            $scope.login.isLoggin = true;
            //根作用域
            $rootScope.rootCtrlScope.username = data.user.name;
            $uibModalInstance.dismiss();
            $location.path('Welcome/index');
          }, function(err) {
            console.log(err);
          })
        } else if (data.state == '密码不匹配') {
          console.log('密码不匹配');
          $scope.login.isPasswordMatch = false;
          $scope.login.showTip2 = true;
          // $location.path('Welcome/signup');
        }
      }
    }, function(err) {
      console.log(err);
    });
  }

  //取消模态框
  $scope.cancel = function() {
    $uibModalInstance.dismiss();
  }
}]);


// ArticleCtrl控制器
appController.controller('ArticleCtrl', ['$scope', '$resource', '$uibModal', '$location', 'articleStorage', function($scope, $resource, $uibModal, $location, articleStorage) {
  $scope.article = {};
  $scope.article.articleRepeat = false;
  $scope.article.add = true;
  $scope.addArticle = function() {
    console.log('添加中。。。');
    var Article = $resource('/article/add');
    Article.save({}, {
      title: $scope.article.title,
      type: $scope.article.type,
      content: $scope.article.content
    }, function(data) {
      console.log(data);
      // 清空article的localStroage
      articleStorage.clearArticleStorage();
      $location.path('/Welcome/index');
    }, function(err) {
      console.log(err);
    })
  }

  $scope.updateArticle = function() {
    console.log('修改中。。。');
    var Article = $resource('/article/update/:title', {
      title: '@title'
    }, {
      update: {
        method: 'PUT'
      }
    });
    Article.update({}, {
      title: $scope.article.title,
      type: $scope.article.type,
      content: $scope.article.content
    }, function(data) {
      console.log(data);
      // 清空article的localStroage
      articleStorage.clearArticleStorage();
      $location.path('/Welcome/index');
    }, function(err) {
      console.log(err);
    })
  }

  $scope.$on('updateArticle', function(event, title, type, content) {
    console.log('收到事件');
    $scope.article.add = false;
    $scope.article.articleRepeat = true;
    $scope.article.title = title;
    $scope.article.type = type;
    $scope.article.content = content;
  })
}])


//ArticleListCtrl控制器
appController.controller('ArticleListCtrl', ['$scope', '$resource', '$location', 'articleStorage', 'eventEmmiter', function($scope, $resource, $location, articleStorage, eventEmmiter) {
  $scope.fileList = {};
  $scope.fileList.articleData = [];
  // 初始化数据
  $scope.fileList.initData = function() {
    if (articleStorage.isSupportLocalStorage()) {
      console.log('支持localStorage');
      // var hasArticle = articleStorage.hasArticleStorage();
      // 没有本地保存的article
      // if (hasArticle == false || hasArticle == 'false') {
      // 查询所有文章
      var Article = $resource('/article/query');
      Article.query(function(data) {
          if (data.length > 0) {
            console.log(data);
            $scope.fileList.articleData = data;
            articleStorage.setArticleStorage(data);
          }
        }, function(err) {
          console.log(err);
        })
        // } else {
        // 有本地保存的article
        // $scope.fileList.articleData = articleStorage.getArticleStorage();
        // }
    } else {
      console.log('不支持localStorage');
      // 查询所有文章
      var Article = $resource('/article/query');
      Article.query(function(data) {
        if (data.length > 0) {
          console.log(data);
          $scope.fileList.articleData = data;
        }
      }, function(err) {
        console.log(err);
      })
    }
  }


  // 读文章
  $scope.fileList.readArticle = function(articleTitle) {
    $location.path('/ReadArticle/' + articleTitle);
  }

  // 更新文章
  $scope.updateArticle = function(articleTitle, articleType, articleContent) {
    eventEmmiter.toBroadCast('updateArticle', articleTitle, articleType, articleContent);
    $location.path('/Welcome/add');
  }

  //删除文章
  $scope.deleteArticle = function(articleTitle) {
    var Article = $resource('/article/del/:title', {
      title: '@title'
    });
    Article.remove({}, {
      title: articleTitle
    }, function(data) {
      console.log(data);
      // 清空本地再重新加载
      $scope.fileList.initData();
      articleStorage.clearArticleStorage();
    }, function(err) {
      console.log(err);
    })
  }
}])

// readArticleCtrl控制器
appController.controller('readArticleCtrl', ['$scope', '$stateParams', '$resource', function($scope, $stateParams, $resource) {
  $scope.article = {};
  $scope.title = $stateParams.articleTitle;
  $scope.article.initArticleData = function() {
    var articleResource = $resource('/article/query/:title', {
      title: '@title'
    })
    articleResource.get({
      title: $scope.title
    }, function(data) {
      console.log(data);
      $scope.article.data = data.article[0];
    }, function(err) {
      console.log(err);
    })
  }
}])
