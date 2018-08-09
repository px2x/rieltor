angular.module('realty-admin')

.controller('BlackList', ['$scope', '$i18n', '$http', '$storage', '$httpParamSerializer', '$timeout', '$q', 
        function ($scope, $i18n, $http, $storage, $queryBuilder, $timeout, $q) {
    var filter = $storage.get('list.blacklist');
    $scope.saveButton = $i18n('buttons.save');
    $scope.saving = false;
    $scope.data = [];
    $storage.set('settings.active', 'black_list');

    if( !filter )
    {
        filter = {
            page: 1,
            search: '',
            type: '',
            limit: 40 
        };
    }
    $scope.filter = filter;
    $scope.loading = true;
    $scope.total = 0;
    $scope.items = [];

    $scope.loadData = function (page, limit) {
        if (page)
        {
            $scope.filter.page = +page;
        }
        if (limit)
        {
            $scope.filter.limit = limit;
        }
        $storage.set('list.blacklist', $scope.filter);
        $http.get('/api/blacklist?' + $queryBuilder($scope.filter)).then(
            function (response) {
                if (response.data.success)
                {
                    $scope.items = response.data.data;
                    $scope.total = response.data.total;
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
        $scope.$root.showConfirm('Вы уверены что хотите удалить этот телефон из черного списка?', 'Удалить телефон?', function(){
            $scope.loading = true;
            $http.delete('/api/blacklist/' + id).then(
                function (response) {
                    if (response.data.success)
                    {
                        $scope.showMessage($i18n('messages.bl_phone.success_deleted'));
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
.controller('BlackForm', ['$scope', '$i18n', '$http', '$routeParams', '$location',
        function ($scope, $i18n, $http, $routeParams, $location) {
    $scope.loading = false;
    $scope.id = $routeParams.id;
    $scope.$root.bc = {href: '/blacklist', title: $i18n('h1.blacklist'), icon: 'turned_in'};
    
    $scope.saveButton = $i18n('buttons.save');
    
    $scope.saving = false;
    if ($scope.id)
    {
        $http.get('/api/blacklist/' + $scope.id).then(function(response){
            if (response.data.success)
            {
                $scope.black = response.data.black;
            }
            else
            {
                $scope.showAlert(response.data.message||$i18n('errors.internal'), 'error');
                $location.path('/blacklist');
                return false;
            }
            $scope.loading = false;
            $scope.$emit('$pageReady');
        }, function(){
            $location.path('/blacklist');
        });
    }
    else
    {
        $scope.black = {};
        $scope.$emit('$pageReady');
    }
    
    $scope.submit = function(phone){
        if ($scope.saving)
        {
            return false;
        }
        $scope.saving = true;
        $scope.saveButton = $i18n('buttons_process.save');
        $http[($scope.id ? 'put' : 'post')]('/api/blacklist' + ($scope.id ? '/' + $scope.id : ''), $scope.black).then(
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                if (!response.data.success)
                {
                    $scope.showAlert(response.data.message||$i18n('errors.internal'));
                    return false;
                }
                $scope.showMessage($i18n('messages.bl_phone.success_' + ($scope.id ? 'updated' : 'created')));
                $location.path('/blacklist');
            },
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                $scope.showAlert(response.data.message||$i18n('errors.internal'));
            }
        );
    };
    
}]);