angular.module('realty-admin')

.controller('Settings', ['$scope', '$i18n', '$http', '$storage', '$httpParamSerializer', '$location', 
        function ($scope, $i18n, $http, $storage, $queryBuilder, $location) {
            
    $scope.othersInit = function () {
        $scope.saving = true;
        $scope.saveButton = $i18n('buttons_process.save');
        $storage.set('settings.active', 'others');
        $http.get('/api/others').then(
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                if (!response.data.status)
                {
                    $scope.showAlert(response.data.message||$i18n('errors.internal'));
                    return false;
                }
                $scope.other = response.data.res;
                angular.forEach($scope.other, function (val, key) {
                    if(key == 'comission_price') {
                        $scope.other[key] = parseInt(val);
                    }
                });
                setTimeout(function () {
                    $scope.$apply();
                    $scope.$emit('$pageReady');
                }, 0);
            },
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                $scope.showAlert(response.data.message||$i18n('errors.internal'));
                $scope.$emit('$pageReady');
            }
        );
    };
    
    $scope.saveOther = function(){
        $scope.saving = true;
        $scope.saveButton = $i18n('buttons_process.save');
        $http.post('/api/others', {other: $scope.other}).then(
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                if (!response.data.status)
                {
                    $scope.showAlert(response.data.message||$i18n('errors.internal'));
                    return false;
                }
                $scope.showMessage($i18n('messages.settings.saved'));
            },
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                $scope.showAlert(response.data.message||$i18n('errors.internal'));
            }
        );

    }
    
    $scope.contacts = function () {
        $scope.saveButton = $i18n('buttons.save');
        $scope.saving = false;
        $storage.set('settings.active', 'contacts');
        
        $http.get('/api/contacts/').then(function(response){
            if (response.data.success)
            {
                $scope.contact = response.data.data;
            }
            else
            {
                $scope.showAlert(response.data.message||$i18n('errors.internal'), 'error');
                return false;
            }
            $scope.loading = false;
            $scope.$emit('$pageReady');
        }, function(){
            $location.path('/settings');
        });
        $scope.phoneValid = function() {
            $scope.contact.contact_phone = $scope.contact.contact_phone.replace(/\D/g,'');
        };
        
        $scope.submit = function(){
            $scope.saving = true;
            $scope.saveButton = $i18n('buttons_process.save');
            $http.post('/api/others', {other: $scope.contact}).then(
                function(response){
                    $scope.saving = false;
                    $scope.saveButton = $i18n('buttons.save');
                    if (!response.data.status)
                    {
                        $scope.showAlert(response.data.message||$i18n('errors.internal'));
                        return false;
                    }
                    $scope.showMessage($i18n('messages.settings.saved'));
                },
                function(response){
                    $scope.saving = false;
                    $scope.saveButton = $i18n('buttons.save');
                    $scope.showAlert(response.data.message||$i18n('errors.internal'));
                }
            );
        };
        
    };
    
    
    $scope.developersSettings = function() {
        var filter = $storage.get('list.developers');
        $storage.set('settings.active', 'developers');
       
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
                            $scope.showMessage($i18n('messages.developer.success_deleted'));
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
    };
    
    $scope.districtsSettings = function() {
        var filter = $storage.get('list.district');
        $scope.type = $i18n('districts.type');
        $storage.set('settings.active', 'districts');

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
            $storage.set('list.district', $scope.filter);
            $http.get('/api/districts?' + $queryBuilder($scope.filter)).then(
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
            $scope.$root.showConfirm('Вы уверены что хотите удалить этот район?', 'Удалить район?', function(){
                $scope.loading = true;
                $http.delete('/api/districts/' + id).then(
                    function (response) {
                        if (response.data.success)
                        {
                            $scope.showMessage($i18n('messages.district.success_deleted'));
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
    };
    
    $scope.blaklistSettings = function() {
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
        var limitChanged = false;
        
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
            $storage.set('list.blacklist', $scope.filter);
            $http.get('/api/blacklist?' + $queryBuilder($scope.filter)).then(
                function (response) {
                    if (response.data.success)
                    {
                        $scope.items = response.data.data;
                                limitChanged = false;
                                $scope.total = response.data.total;
                                $scope.data = [];
                                for(var k in response.data.data)
                                {
                                    $scope.data.push(response.data.data[k].phone);
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
            $http.delete('/api/blacklist/?phone=' + id).then(
                function (response) {
                    if (response.data.success)
                    {
                        $scope.showMessage($i18n('messages.order.success_deleted'));
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
        };

        $scope.submit = function(phone){
            $scope.saving = true;
            $scope.saveButton = $i18n('buttons_process.save');
            $http[($scope.id ? 'put' : 'post')]('/api/blacklist', {'phone': phone}).then(
                function(response){
                    $scope.saving = false;
                    $scope.saveButton = $i18n('buttons.save');
                    if (!response.data.success)
                    {
                        $scope.showAlert(response.data.message||$i18n('errors.internal'));
                        $scope.loadData();
                    }
                    else
                    {
                        $scope.showMessage($i18n('messages.ad.success_' + ($scope.id ? 'updated' : 'created')));
                    }
                },
                function(response){
                    $scope.saving = false;
                    $scope.saveButton = $i18n('buttons.save');
                    $scope.showAlert(response.data.message||$i18n('errors.internal'));
                }
            );
        };
        var self = this;
    };
    
    $scope.complexSettings = function () {
        var filter = $storage.get('list.complex');
        $storage.set('settings.active', 'complexes');
       
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
        };

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
            $storage.set('list.complex', $scope.filter);
            $http.get('/api/complex?' + $queryBuilder($scope.filter)).then(
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
            $scope.$root.showConfirm('Вы уверены что хотите удалить этот жилищный комплекс?', 'Удалить жилищный комплекс?', function(){
                $scope.loading = true;
                $http.delete('/api/complex/' + id).then(
                    function (response) {
                        if (response.data.success)
                        {
                            $scope.showMessage($i18n('messages.complex.success_deleted'));
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
    };
    
    var activeTab = $storage.get('settings.active');
    switch(activeTab) {
        case 'contacts':
            $scope.selectedIndex = 1;
            $scope.contacts();
            break;
        case 'districts':
            $scope.selectedIndex = 2;
            $scope.districtsSettings();
            break;
        case 'developers':
            $scope.selectedIndex = 3;
            $scope.developersSettings();
            break;
        case 'complexes':
            $scope.selectedIndex = 4;
            $scope.complexSettings();
            break;
        case 'black_list':
            $scope.selectedIndex = 5;
            $scope.blaklistSettings();
            break;
        default:
            $scope.selectedIndex = 0;
            $scope.othersInit();
            break;
    }
}]);
