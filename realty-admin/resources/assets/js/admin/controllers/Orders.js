angular.module('realty-admin')

.controller('Orders', ['$scope', '$i18n', '$http', '$storage', '$httpParamSerializer', 
        function ($scope, $i18n, $http, $storage, $queryBuilder) {
    var filter = $storage.get('list.orders');
    $scope.status = $i18n('orders.status');
       
    if( !filter )
    {
        filter = {
            page: 1,
            search: '',
            status: '',
            limit: 10
        };
    }
    $scope.filter = filter;
    $scope.loading = true;
    $scope.total = 0;
    $scope.items = [];
    var limitChanged = false;

    $scope.selectStatus = function() {
        $scope.loadData(true);
    }

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
        $storage.set('list.orders', $scope.filter);
        $http.get('/api/orders?' + $queryBuilder($scope.filter)).then(
            function (response) {
                if (response.data.success)
                {
                    angular.forEach(response.data.data, function (value, key) {
                        var date = new Date(value.created_at);
                        response.data.data[key].created_at = ('0' + date.getDate()).slice(-2)
                                + '-' + ('0' + (date.getMonth() + 1)).slice(-2)
                                + '-' +  date.getFullYear()
                                + ' ' + ('0' + date.getHours()).slice(-2) 
                                + ':' + ('0' + date.getMinutes()).slice(-2); 
                    });
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
        $scope.$root.showConfirm('Вы уверены что хотите удалить этот заказ?', 'Удалить заказ?', function(){
            $scope.loading = true;
            $http.delete('/api/orders/' + id).then(
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

