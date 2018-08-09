angular.module('realty-login', ['ngRoute', 'ngMaterial'])

//config route
.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/login', {
            controller:'Login',
            templateUrl:'/html/login.html'
        })
        .otherwise({
            redirectTo:'/login'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}])

.run(['$rootScope', '$i18n', '$http', '$mdDialog',
    function ($rootScope, $i18n, $http, $mdDialog) {
    $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $http.defaults.transformResponse.push(function(response, callback, status){
        if (status === 401)
        {
            $rootScope.showAlert($i18n('errors.unauthorized'));
            setTimeout(function(){
                location.href = '/redirect';
            }, 1000);
            return false;
        } else if (status !== 200) {
            $rootScope.showAlert($i18n('errors.internal'));
        }
        return response;
    });
    
    $rootScope.showAlert = function (text, title) {
        $mdDialog.show(
            $mdDialog
                .alert()
                .parent(angular.element(document.querySelector('body')))
                .clickOutsideToClose(true)
                .title(title || $i18n('common.error'))
                .textContent(text)
                .ok($i18n('common.close'))
        );
        return false;
    };
    
    $rootScope.$on('$routeChangeSuccess', function () {
        var h1 = $i18n('h1.login', false),
            title = $i18n('titles.login', false);
        $rootScope.h1 = h1;
        document.title = title;
    });
}]);
angular.module('realty-login')

.controller('Login', ['$scope', '$i18n', '$http', function ($scope, $i18n, $http) {
    $scope.buttonText = $i18n('buttons.login');
    $scope.loading = false;
    $scope.auth = {
        email: '',
        password: ''
    };

    $scope.submit = function () {
        if ($scope.loading)
        {
            return false;
        }
        $scope.loading = true;
        $scope.buttonText = $i18n('buttons_process.login');
        $http.post('/login', $scope.auth)
            .then(function (response) {
                if (response.data.success)
                {
                    location.href = '/redirect';
                    return false;
                }
                $scope.showAlert(response.data.message||$i18n('errors.internal'));
                $scope.loading = false;
                $scope.buttonText = $i18n('buttons.login');
            }, function(){
                $scope.showAlert($i18n('errors.internal'));
                $scope.loading = false;
                $scope.buttonText = $i18n('buttons.login');
            });
    };
}]);

//Multilanguage
var I18n = window.I18n;
angular.module('realty-login').factory('$i18n', function () {
    return function (key, params) {
        if (key.length > 0)
        {
            var keys = key.split('.');
            if (I18n[keys[0]] !== undefined)
            {
                var str = '';
                if (keys.length > 1)
                {
                    var temp = I18n[keys[0]];
                    for (var i = 1; i < keys.length; i++)
                    {
                        if (typeof (temp[keys[i]]) !== 'undefined')
                        {
                            temp = temp[keys[i]];
                            continue;
                        }
                        break;
                    }

                    if (typeof (temp) === 'string')
                    {
                        str = temp;
                    }
                    else if (typeof (temp) === 'object')
                    {
                        if (params === false)
                        {
                            return false;
                        }
                        return temp;
                    }
                }
                else
                {
                    if (params === false)
                    {
                        return false;
                    }
                    str = I18n[keys[0]];
                }

                if (str.length > 0)
                {
                    if (params && params.length)
                    {
                        for (var k in params)
                        {
                            str = str.replace(':param' + k, params[k]);
                        }
                    }
                    return str;
                }
            }
            return key;
        }
        return false;
    };
})
.directive('i18n', ['$rootScope', '$i18n', function ($rootScope, $i18n) {
    return {
        restrict : 'A',
        scope : {
            key : '=',
            params : '=',
            pl : '='
        },
        link: function (scope, element, attrs) {
            if( attrs.pl ) //placehoder
            {
                element.attr('placeholder', $i18n(attrs.pl, attrs.params));
            }
            else if( attrs.key )
            {
                element.html($i18n(attrs.key, attrs.params));
            }
        }
    };
}]);
