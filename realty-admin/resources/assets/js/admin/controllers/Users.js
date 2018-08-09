angular.module('realty-admin')

.controller('Users', ['$scope', '$i18n', '$http', '$storage', '$httpParamSerializer', 
        function ($scope, $i18n, $http, $storage, $queryBuilder) {
    var filter = $storage.get('list.users');
    if( !filter )
    {
        filter = {
            page: 1,
            search: '',
            limit: 10
        };
    }
    $scope.filter = filter;
    $scope.loading = true;
    $scope.total = 0;
    $scope.items = [];
    var limitChanged = false;
    
    $scope.loadData = function (page, limit) {
        if (page)
        {
            $scope.filter.page = +page;
        }
        if (limit)
        {
            limitChanged = true;
            $scope.filter.limit = limit;
        }
        $storage.set('list.users', $scope.filter);
        $http.get('/api/users?' + $queryBuilder($scope.filter)).then(
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
        $scope.$root.showConfirm('Вы уверены что хотите удалить этого пользователя?', 'Удалить пользователя?', function(){
            $scope.loading = true;
            $http.delete('/api/users/' + id).then(
                function (response) {
                    if (response.data.success)
                    {
                        $scope.showMessage($i18n('messages.user.success_deleted'));
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
}])

.controller('UserView', ['$scope', '$i18n', '$http', '$routeParams', '$location', function ($scope, $i18n, $http, $routeParams, $location) {
    $scope.loading = false;
    $scope.id = $routeParams.id;
    $http.get('/api/users/' + $scope.id).then(function(response){
        if (response.data.success)
        {
            $scope.user = response.data.user;
//            $http.get('/api/user-orders/' + $scope.id).then(function(response){
//                if(response.data.status == true)
//                {
//                    $scope.orders = response.data.orders;
//                }
//            }, function(){
//                $location.path('/users');
//            });
        }
        else
        {
            $scope.showMessage(response.data.message||$i18n('errors.internal'), 'error');
            $location.path('/users');
            return false;
        }
        $scope.loading = false;
        $scope.$emit('$pageReady');
    }, function(){
        $location.path('/users');
    });
    
    $scope.progress = false;
    $scope.deleteItem = function () {
        if( $scope.progress )
        {
            return false;
        }
        $scope.$root.showConfirm('Вы уверены что хотите удалить этого пользователя?', 'Удалить пользователя?', function(){
            $scope.progress = true;
            $http.delete('/api/users/' + $scope.id).then(
                function (response) {
                    if (response.data.success)
                    {
                        $scope.showMessage($i18n('messages.users.success_deleted'));
                        $location.path('/users');
                    }
                    else
                    {
                        $scope.showAlert(response.message||$i18n('errors.internal'), 'error');
                        $scope.progress = false;
                    }
                },
                function (response) {
                    $scope.progress = false;
                    $scope.showAlert(response.message||$i18n('errors.internal'), 'error');
                }
            );
        });
    };
}]);
