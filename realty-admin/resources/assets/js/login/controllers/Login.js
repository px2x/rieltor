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
