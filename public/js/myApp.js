// 创建app模块
var app = angular.module('myApp', [
  'appController',
  'appServer',
  'appDirective',
  'ui.router',
  'ngResource',
  'ui.bootstrap',
  'ngAnimate'
]);

// 设置访问者级别
app.constant('ACCESS_LEVELS', {
  tourist: 0,
  user: 1
})

// 注册加载时对模块app进行配置的函数
app.config(function($stateProvider, $urlRouterProvider, $locationProvider, ACCESS_LEVELS) {
  $locationProvider.html5Mode(false);
  $urlRouterProvider.otherwise('/Welcome/index');
  $stateProvider
    .state('Welcome', {
      url: '/Welcome',
      views: {
        'main': {
          templateUrl: 'middle.html',
          access_level: ACCESS_LEVELS.tourist
        }
      }
    })
    .state('Welcome.Index', {
      url: '/index',
      views: {
        'middle': {
          templateUrl: 'index.html',
          access_level: ACCESS_LEVELS.tourist
        }
      }
    })
    .state('Welcome.Blog', {
      url: '/blog',
      views: {
        'middle': {
          templateUrl: 'blog.html',
          access_level: ACCESS_LEVELS.tourist
        }
      }
    })
    .state('Welcome.Add', {
      url: '/add',
      views: {
        'middle': {
          templateUrl: 'add.html',
          access_level: ACCESS_LEVELS.user
        }
      }
    })
    .state('Welcome.admin', {
      url: '/admin',
      views: {
        'middle': {
          templateUrl: 'admin.html',
           access_level: ACCESS_LEVELS.user
        }
      }
    })
    .state('Welcome.personal', {
      url: '/personal',
      views: {
        'middle': {
          templateUrl: 'personal.html',
           access_level: ACCESS_LEVELS.user
        }
      }
    })
    .state('Welcome.signin', {
      url: '/signin',
      views: {
        'middle': {
          templateUrl: 'signin.html',
           access_level: ACCESS_LEVELS.tourist
        }
      }
    })
    .state('Welcome.signup', {
      url: '/signup',
      views: {
        'middle': {
          templateUrl: 'signup.html',
           access_level: ACCESS_LEVELS.tourist
        }
      }
    })
    .state('ReadArticle', {
      url: '/ReadArticle',
      views: {
        'main': {
          templateUrl: function() {
            return 'middle.html';
          },
          access_level: ACCESS_LEVELS.tourist
        }
      }
    })
    .state('ReadArticle.Movie', {
      url: '/:articleTitle',
      views: {
        'middle': {
          templateUrl: function() {
            return 'readArticle.html'
          },
          access_level: ACCESS_LEVELS.tourist
        }
      }
    })
});

// 注册在所有AngularJS加载完毕后对所有模块进行配置的函数
app.run(function($rootScope, Auth, articleStorage,$location) {
  //初始化全局对象
  $rootScope.rootCtrlScope = {};
  $rootScope.rootCtrlScope.username = null;

  // 初始化
  // 清空article localStorage
  articleStorage.clearArticleStorage();

  // 保持登录状态
  if (Auth.isLoggedIn()) {
    $rootScope.rootCtrlScope.username = Auth.getUser();
    console.log('当前登录的用户是: ' + $rootScope.rootCtrlScope.username);
  } else {
    console.log('没有登录');
    $rootScope.rootCtrlScope.username = null;
  }

  // 路由监听
  // $rootScope.$on('$stateChangeStart',function(event,next,cur){
  //   var nextAuth = next.views.middle.access_level;
  //   if(Auth.isLoggedIn()){
  //     console.log('当前用户等级：' + Auth.getUserRole() + "当前路由等级：" + nextAuth)
  //   }else{
  //     console.log('当前用户等级：' + '还没有登录' + "当前路由等级：" + nextAuth)
  //   }
  //   if(!Auth.isAuthorized(nextAuth)){
  //     // 没有访问权限
  //      console.log('没有访问权限');
  //      if(Auth.isLoggedIn()){
  //       $location.path('/');
  //      }else{
  //       // 如果没有登录
  //       $location.path('/');
  //      }
  //   }
  // })
})
