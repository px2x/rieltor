angular.module('realty-admin')

.controller('DistrictForm', ['$scope', '$i18n', '$http', '$storage', '$location', '$routeParams', 
        function ($scope, $i18n, $http, $storage, $location, $routeParams) {
    $scope.saveButton = $i18n('buttons.save');
    $scope.id = $routeParams.id;
    $scope.saving = false;
    $scope.type = $i18n('districts.type');

    $http.get('/api/cities/').then(function(response){
        if (response.data.success)
        {
            $scope.cities = response.data.data;
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
    
    if ($scope.id)
    {
        $http.get('/api/districts/' + $scope.id).then(function(response){
            if (response.data.success)
            {
                $scope.district = response.data.district;
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
        $http[($scope.id ? 'put' : 'post')]('/api/districts' + ($scope.id ? '/' + $scope.id : ''), $scope.district).then(
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                if (!response.data.success)
                {
                    $scope.showAlert(response.data.message||$i18n('errors.internal'));
                    return false;
                }
                $scope.showMessage($i18n('messages.district.success_' + ($scope.id ? 'updated' : 'created')));
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