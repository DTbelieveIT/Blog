//创建appDirective模块
var appDirective = angular.module('appDirective', [])

// 创建指令
appDirective.directive('checkLoginName', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, ele, attrs, ctrl) {
      scope.$watch('login.showTip1', function(n, o) {
        if (n) {
          ctrl.$setValidity('checkLoginName', false);
        }
      });
      scope.$watch('login.username', function(n, o) {
        ctrl.$setValidity('checkLoginName', true);
        scope.login.showTip1 = false;
      })
    }
  }
})

appDirective.directive('checkLoginPassword', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, ele, attrs, ctrl) {
      scope.$watch('login.isPasswordMatch', function(n, o) {
        if (!n) {
          ctrl.$setValidity('checkLoginPassword', false);
        }
      })
      scope.$watch('login.password', function(n, o) {
        ctrl.$setValidity('checkLoginPassword', true);
        scope.login.showTip2 = false;
      })
    }
  }
})

appDirective.directive('contenteditable', function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) {
        return;
      } // do nothing if no ng-model
      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html(ngModel.$viewValue || '');
      };
      // Listen for change events to enable binding
      element.on('blur keyup change', function() {
        scope.$apply(readViewText);
      });
      // No need to initialize, AngularJS will initialize the text based on ng-model attribute
      // Write data to the model
      function readViewText() {
        var html = element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if (attrs.stripBr && html === '<br>') {
          html = '';
        }
        ngModel.$setViewValue(html);
      }
    }
  };
});

// 检测是否重复
appDirective.directive('isRepeat', function($resource) {
  return {
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      //根据不同对象进行不同的检查
      switch (attrs['repeatType']) {
        case 'user':
          {
            scope.$watch('reg.nameIsValid', function(newVal) {
              if (!newVal) {
                ctrl.$setValidity('checkName', false);
              } else {
                ctrl.$setValidity('checkName', true);
              }
            })
          }
          break;
        default:
          console.log('不需要检查');
      }

      //检查用户名是否重复
      scope.$watch('reg.name', function(newValue, oldValue) {
        //用户名非空
        if (element.val()) {
          console.log('checking....');
          //生成一个resource
          var resource = $resource(attrs['isRepeat'], {
            name: '@name'
          })

          resource.get({
            name: element.val()
          }, function(data) {
            console.log(data);
            if (data.user) {
              console.log('用户名重复');
              scope.reg.nameIsValid = false;
              scope.reg.showTips = true;
            } else {
              console.log('用户名没有重复');
              scope.reg.nameIsValid = true;
              scope.reg.showTips = false;
            }
          }, function(err) {
            console.log(err);
          })
        }
      })
    }
  }
})
