angular.module('realty-admin')

.controller('OrderView', ['$scope', '$i18n', '$http', '$routeParams', '$location', '$window', function ($scope, $i18n, $http, $routeParams, $location, $window) {
    document.title = $i18n('titles.order') + ' №' + $routeParams.id;
    $scope.loading = false;
    $scope.status = $i18n('orders.status');
    $scope.$root.bc = {href: '/orders', title: $i18n('h1.orders'), icon: 'location_on'};
    $scope.id = $routeParams.id;
    $scope.$root.h1 = $i18n('h1.orders_view') + ' №' + $routeParams.id,
    $http.get('/api/orders/' + $scope.id).then(function(response){
        if (response.data.success)
        {
            var date = new Date(response.data.order.created_at);
            response.data.order.created_at = ('0' + date.getDate()).slice(-2)
                    + '.' + ('0' + (date.getMonth() + 1)).slice(-2)
                    + '.' +  date.getFullYear()
                    + ' ' + ('0' + date.getHours()).slice(-2) 
                    + ':' + ('0' + date.getMinutes()).slice(-2); 

            $scope.order = response.data.order;
        }
        else
        {
            $scope.showMessage(response.data.message || $i18n('errors.internal'), 'error');
            $location.path('/orders');
            return false;
        }
        $scope.loading = false;
        $scope.$emit('$pageReady');
    }, function(){
        $location.path('/orders');
    });

    $scope.progress = false;

    $scope.backToList = function () {
        $window.history.back();
    };

    $scope.archive = function () {
        $http.get('/api/orders/archive/' + $routeParams.id).then(function (resp) {
            $scope.order.status = 'archived';
            setTimeout(function () {
                $scope.$apply();
            }, 0);
        }, function (resp) {});
    };
    
    $scope.printSection = function () {
        window.print();
    };

}]);
