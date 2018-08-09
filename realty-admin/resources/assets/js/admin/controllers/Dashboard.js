angular.module('realty-admin')

.controller('Dashboard', ['$scope', '$i18n', '$http', function ($scope, $i18n, $http) {
    $scope.selectPeriod = function(v){
        $scope.ordersView = v;
        $scope.period = $i18n('common.periods.' + v);
        $scope.ordersCount = $scope.counts[v];
        $scope.ordersText = $scope.getPrural($scope.ordersCount, $i18n('common.orders'));
    };
        
    $http.get('/api/dashboard').then(function(response){
        $scope.counts = {
            today: response.data.orders_today,
            week: response.data.orders_week,
            month: response.data.orders_month
        };
        $scope.selectPeriod('today');

        $scope.adsCount = response.data.ads;
        $scope.adsText = $scope.getPrural($scope.adsCount, $i18n('common.ads')) + ' в системе';

        $scope.objectsCount = response.data.objects;
        $scope.objectsText = $scope.getPrural($scope.objectsCount, $i18n('common.objects')) + ' в системе';

        $scope.usersCount = response.data.users;
        $scope.usersText = $scope.getPrural($scope.usersCount, $i18n('common.users')) + ' в системе';
        
        $scope.$emit('$pageReady');
    }, function(){
        $scope.$emit('$pageReady');
    });
    
    
}]);
