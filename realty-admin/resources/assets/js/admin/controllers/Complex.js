angular.module('realty-admin')

.controller('ComplexForm', ['$scope', '$i18n', '$http', '$storage', '$location', '$routeParams', 
        function ($scope, $i18n, $http, $storage, $location, $routeParams) {
    $scope.saveButton = $i18n('buttons.save');
    $scope.id = $routeParams.id;
    $scope.saving = false;
    
    if ($scope.id)
    {
        $http.get('/api/complex/' + $scope.id).then(function(response){
            if (response.data.success)
            {
                $scope.complex = response.data.complex;
            }
            else
            {
                $scope.showAlert(response.data.message||$i18n('errors.internal'), 'error');
                $location.path('/settings');
                return false;
            }
            $scope.loading = false;
            $scope.$emit('$pageReady');
        }, function(){
            $location.path('/settings');
        });
    }
    else
    {
        $scope.loading = false;
        $scope.$emit('$pageReady');
    }
    
    $scope.submit = function(){
        
        $scope.saving = true;
        $scope.saveButton = $i18n('buttons_process.save');
        $http[($scope.id ? 'put' : 'post')]('/api/complex' + ($scope.id ? '/' + $scope.id : ''), $scope.complex).then(
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                if (!response.data.success)
                {
                    $scope.showAlert(response.data.message||$i18n('errors.internal'));
                    return false;
                }
                $scope.showMessage($i18n('messages.complex.success_' + ($scope.id ? 'updated' : 'created')));
                $location.path('/settings');
            },
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                $scope.showAlert(response.data.message||$i18n('errors.internal'));
            }
        );
    };
}]);