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