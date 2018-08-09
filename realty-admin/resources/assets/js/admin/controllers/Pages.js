angular.module('realty-admin')

.controller('Pages', ['$scope', '$i18n', '$http', '$storage', '$httpParamSerializer', 
        function ($scope, $i18n, $http, $storage, $queryBuilder) {
    var filter = $storage.get('list.pages');
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
        $storage.set('list.pages', $scope.filter);
        $http.get('/api/pages?' + $queryBuilder($scope.filter)).then(
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
        $scope.$root.showConfirm('Вы уверены что хотите удалить эту страницу?', 'Удалить страницу?', function(){
            $scope.loading = true;
            $http.delete('/api/pages/' + id).then(
                function (response) {
                    if (response.data.success)
                    {
                        $scope.showMessage($i18n('messages.page.success_deleted'));
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
.controller('PagesView', ['$scope', '$i18n', '$http', '$routeParams', '$location', function ($scope, $i18n, $http, $routeParams, $location) {
    $scope.loading = false;
    $scope.id = $routeParams.id;
    $scope.$root.bc = {href: '/pages', title: $i18n('h1.pages'), icon: 'title'};
    $http.get('/api/pages/' + $scope.id).then(function(response){
        if (response.data.success)
        {
            $scope.page = response.data.page;
        }
        else
        {
            $scope.showMessage(response.data.message||$i18n('errors.internal'), 'error');
            $location.path('/pages');
            return false;
        }
        $scope.loading = false;
        $scope.$emit('$pageReady');
    }, function(){
        $location.path('/pages');
    });
    
    $scope.progress = false;
    $scope.deleteItem = function () {
        if( $scope.progress )
        {
            return false;
        }
        $scope.$root.showConfirm('Вы уверены что хотите удалить эту страницу?', 'Удалить страницу?', function(){
            $scope.progress = true;
            $http.delete('/api/pages/' + $scope.id).then(
                function (response) {
                    if (response.data.success)
                    {
                        $scope.showMessage($i18n('messages.page.success_deleted'));
                        $location.path('/pages');
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
}])
.controller('PagesForm', ['$scope', '$i18n', '$http', '$routeParams', '$location', 'taOptions',
        function ($scope, $i18n, $http, $routeParams, $location, $text) {
    $scope.loading = false;
    $scope.id = $routeParams.id;
    $scope.$root.bc = {href: '/pages', title: $i18n('h1.pages'), icon: 'title'};
    $text.toolbar = [
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'quote'],
        ['html', 'insertImage','insertLink'],
        ['bold', 'italics', 'underline', 'ul', 'ol', 'justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent', 'redo', 'undo', 'clear']
    ];
    
    $scope.saveButton = $i18n('buttons.save');
    
    $scope.saving = false;
    if ($scope.id)
    {
        $http.get('/api/pages/' + $scope.id).then(function(response){
            if (response.data.success)
            {
                $scope.page = response.data.page;
            }
            else
            {
                $scope.showAlert(response.data.message||$i18n('errors.internal'), 'error');
                $location.path('/pages');
                return false;
            }
            $scope.loading = false;
            $scope.$emit('$pageReady');
        }, function(){
            $location.path('/pages');
        });
    }
    else
    {
        $scope.page = {};
        $scope.$emit('$pageReady');
    }
    
    $scope.submit = function(){
        if ($scope.saving)
        {
            return false;
        }
        
        $scope.saving = true;
        $scope.saveButton = $i18n('buttons_process.save');
        $http[($scope.id ? 'put' : 'post')]('/api/pages' + ($scope.id ? '/' + $scope.id : ''), $scope.page).then(
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                if (!response.data.success)
                {
                    $scope.showAlert(response.data.message||$i18n('errors.internal'));
                    return false;
                }
                $scope.showMessage($i18n('messages.page.success_' + ($scope.id ? 'updated' : 'created')));
                $location.path('/pages/view/' + response.data.id);
            },
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                $scope.showAlert(response.data.message||$i18n('errors.internal'));
            }
        );
    };
    
    $scope.pristine = {};
    
    $scope.setChanged = function(n){
        $scope.pristine[n] = true;
    };
    
}]);