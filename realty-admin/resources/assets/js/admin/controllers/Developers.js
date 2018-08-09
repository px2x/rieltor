angular.module('realty-admin')

.controller('DeveloperForm', ['$scope', '$i18n', '$http', '$storage', '$location', '$routeParams', 
        function ($scope, $i18n, $http, $storage, $location, $routeParams) {
    $scope.saveButton = $i18n('buttons.save');
    $scope.id = $routeParams.id;
    $scope.saving = false;
    
    if ($scope.id)
    {
        $http.get('/api/developers/' + $scope.id).then(function(response){
            if (response.data.success)
            {
                $scope.developer = response.data.developer;
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
        $http[($scope.id ? 'put' : 'post')]('/api/developers' + ($scope.id ? '/' + $scope.id : ''), $scope.developer).then(
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                if (!response.data.success)
                {
                    $scope.showAlert(response.data.message||$i18n('errors.internal'));
                    return false;
                }
                $scope.showMessage($i18n('messages.developer.success_' + ($scope.id ? 'updated' : 'created')));
                $location.path('/settings');
            },
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                $scope.showAlert(response.data.message||$i18n('errors.internal'));
            }
        );
    };
            
}])
.controller('Developers', ['$scope', '$i18n', '$http', '$storage', '$httpParamSerializer', 
        function ($scope, $i18n, $http, $storage, $queryBuilder) {
    var filter = $storage.get('list.developers');
       
    if( !filter )
    {
        filter = {
            page: 1,
            search: '',
            type: '',
            limit: 10
        };
    }
    $scope.filter = filter;
    $scope.loading = true;
    $scope.total = 0;
    $scope.items = [];
    var limitChanged = false;

    $scope.selectType = function() {
        $scope.loadData(true);
    }

    $scope.loadData = function (page, limit) {
        if (page)
        {
            $scope.filter.page = page;
        }
        if (limit)
        {
            limitChanged = true;
            $scope.filter.limit = limit;
        }
        $storage.set('list.developers', $scope.filter);
        $http.get('/api/developers?' + $queryBuilder($scope.filter)).then(
            function (response) {
                if (response.data.success)
                {
                    $scope.items = response.data.data;
                    if (response.data.total !== undefined && (response.data.total != $scope.total || limitChanged))
                    {
                        limitChanged = false;
                        $scope.total = response.data.total;
                    }
                }
                else
                {
                    $scope.showMessage(response.data.message||$i18n('errors.internal'), 'error');
                }
                $scope.loading = false;
                $scope.$emit('$pageReady');
            },
            function (response) {
                $scope.loading = false;
                $scope.$emit('$pageReady');
            }
        );
    };
    $scope.loadData();

    $scope.deleteItem = function (id) {
        if( $scope.loading )
        {
            return false;
        }
        $scope.$root.showConfirm('Вы уверены что хотите удалить этого застройщика?', 'Удалить застройщика?', function(){
            $scope.loading = true;
            $http.delete('/api/developers/' + id).then(
                function (response) {
                    if (response.data.success)
                    {
                        $scope.showMessage($i18n('messages.order.success_deleted'));
                        $scope.loadData();
                    }
                    else
                    {
                        $scope.showAlert(response.message||$i18n('errors.internal'), 'error');
                        $scope.loading = false;
                    }
                },
                function () {
                    $scope.loading = false;
                }
            );
        });
    };
}]);