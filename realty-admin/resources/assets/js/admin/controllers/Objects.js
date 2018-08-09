angular.module('realty-admin')

.controller('Objects', ['$scope', '$i18n', '$http', '$storage', '$httpParamSerializer', 
        function ($scope, $i18n, $http, $storage, $queryBuilder) {
    var filter = $storage.get('list.objects');
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
        $storage.set('list.objects', $scope.filter);
        $http.get('/api/objects?' + $queryBuilder($scope.filter)).then(
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
        $scope.$root.showConfirm('Вы уверены что хотите удалить этот объект?', 'Удалить объект?', function(){
            $scope.loading = true;
            $http.delete('/api/objects/' + id).then(
                function (response) {
                    if (response.data.success)
                    {
                        $scope.showMessage($i18n('messages.object.success_deleted'));
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

.controller('ObjectsView', ['$scope', '$i18n', '$http', '$routeParams', '$location', function ($scope, $i18n, $http, $routeParams, $location) {
    $scope.loading = false;
    $scope.id = $routeParams.id;
    $scope.$root.bc = {href: '/objects', title: $i18n('h1.objects'), icon: 'location_city'};
    $http.get('/api/objects/' + $scope.id).then(function(response){
        if (response.data.success)
        {
            var districts = response.data.districts, dist = {};
            for(var d of districts)
            {
                dist[d.id] = d.name;
            }
            $scope.districts = dist;
            $scope.object = response.data.object;
            $scope.ads = response.data.ads;
            $scope.photos = response.data.photos;
        }
        else
        {
            $scope.showMessage(response.data.message||$i18n('errors.internal'), 'error');
            $location.path('/objects');
            return false;
        }
        $scope.loading = false;
        $scope.$emit('$pageReady');
    }, function(){
        $location.path('/objects');
    });
    
    $scope.progress = false;
    $scope.deleteItem = function () {
        if( $scope.progress )
        {
            return false;
        }
        $scope.$root.showConfirm('Вы уверены что хотите удалить этот объект?', 'Удалить объект?', function(){
            $scope.progress = true;
            $http.delete('/api/objects/' + $scope.id).then(
                function (response) {
                    if (response.data.success)
                    {
                        $scope.showMessage($i18n('messages.object.success_deleted'));
                        $location.path('/objects');
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

.controller('ObjectsForm', ['$scope', '$i18n', '$http', '$routeParams', '$location', '$q', '$storage',
        function ($scope, $i18n, $http, $routeParams, $location, $q, $storage) {
    $scope.loading = false;
    $scope.id = $routeParams.id;
    $scope.address = '';
    $scope.editAddress = false;
    $scope.addresses = [];
    $scope.objectTypes = $i18n('object_types');
    $scope.objectConditions = $i18n('object_conditions');
    $scope.objectMaterials = $i18n('object_materials');
    $scope.$root.bc = {href: '/objects', title: $i18n('h1.objects'), icon: 'location_city'};
    
    $scope.saveButton = $i18n('buttons.save');
    
    $scope.saving = false;
    if ($scope.id)
    {
        $http.get('/api/objects/' + $scope.id).then(function(response){
            if (response.data.success)
            {
                var districts = response.data.districts, dist = {};
                for(var d of districts)
                {
                    if(!dist[d.type])
                    {
                        dist[d.type] = {};
                    }
                    dist[d.type][d.id] = d.name;
                }
                $scope.districtsM = dist.m;
                $scope.districtsO = dist.o;
                
                $scope.object = response.data.object;
                $scope.photos = response.data.photos;
                $scope.selectedAddress = {
                    address: $scope.object.address,
                    street: $scope.object.street,
                    building: $scope.object.building,
                    city_name: $scope.object.city_name,
                    location: (new google.maps.LatLng($scope.object.lat, $scope.object.lng))
                };
                
                if ($scope.object.developer_id)
                {
                    $scope.selectedDeveloper = {id: $scope.object.developer_id, name: $scope.object.developer_name};
                }
                if ($scope.object.complex_id)
                {
                    $scope.selectedComplex = {id: $scope.object.complex_id, name: $scope.object.complex_name};
                }
                
                $scope.prevAddress = $scope.selectedAddress;
            }
            else
            {
                $scope.showAlert(response.data.message||$i18n('errors.internal'), 'error');
                $location.path('/objects');
                return false;
            }
            $scope.loading = false;
            $scope.$emit('$pageReady');
        }, function(){
            $location.path('/objects');
        });
    }
    else
    {
        $scope.object = {};
        $scope.photos = [];
        $scope.$emit('$pageReady');
    }
    
    var searchService = new google.maps.places.AutocompleteService(),
        geocoderService = new google.maps.Geocoder();
    $scope.searchAddress = function (address) {
        if (address.length > 2)
        {
            return $q(function (resolve, reject) {
                searchService.getQueryPredictions({
                    input: ($scope.address),
                    location: new google.maps.LatLng(47.222436, 39.716448),
                    radius: 10000,
                    language: 'ru',
                    components: 'country:ru'
                }, function (results, status) {
                    var addresses = [], i;
                    if (status === google.maps.GeocoderStatus.OK)
                    {
                        for (i in results)
                        {
                            addresses.push({
                                address: results[i]['description'].replace(', Ростовская область, Россия', ''),
                                placeId: results[i]['place_id']
                            });
                        }
                    }
                    resolve(addresses);
                });
            });
        } else {
            return [];
        }
    };
    
    $scope.searchData = function (data, type) {
        if (data.length > 2)
        {
            return $http.get('/api/' + type + '?search=' + encodeURIComponent(data))
                    .then(function(response){
                        return response.data.data;
                    }, function(){
                        return [];
                    });
        } else {
            return [];
        }
    };

    $scope.saveAddress = function () {
        $scope.editAddress = false;
        
        var setAddressLocation = function () {
            $scope.object.lat = $scope.selectedAddress.location.lat();
            $scope.object.lng = $scope.selectedAddress.location.lng();
            $scope.prevAddress = $scope.selectedAddress;
        };
        if ($scope.selectedAddress)
        {
            if (!$scope.selectedAddress.location)
            {
                geocoderService.geocode({
                    'placeId': $scope.selectedAddress.placeId
                }, function (r, s) {
                    if (s === google.maps.GeocoderStatus.OK && r.length > 0)
                    {
                        $scope.selectedAddress.location = r[0].geometry.location;
                        if (r[0].types[0] === 'street_address')
                        {
                            $scope.selectedAddress.street = r[0].address_components[1].short_name.replace(/\s?ул\.?\s?/g, '');
                            $scope.selectedAddress.building = r[0].address_components[0].short_name;
                        }
                        else
                        {
                            $scope.selectedAddress.street = r[0].address_components[0].short_name.replace(/\s?ул\.?\s?/g, '');
                        }
                        
                        for(var i in r.address_components)
                        {
                            if(r.address_components[i].types && r.address_components[i].types.indexOf('locality') > -1)
                            {
                                $scope.selectedAddress.city_name = r.address_components[i].long_name;
                                break;
                            }
                        }
                        
                        setAddressLocation();
                    }
                });
            } else
            {
                setAddressLocation();
            }
        }
    };
    
    $scope.closeAddress = function () {
        $scope.editAddress = false;
        $scope.selectedAddress = $scope.prevAddress;
    };
    
    $scope.submit = function(){
        if ($scope.saving)
        {
            return false;
        }
        if (!$scope.selectedAddress || !$scope.selectedAddress.address)
        {
            $scope.showAlert($i18n('errors.object.no_address'));
            return false;
        }
        $scope.object.building = $scope.selectedAddress.building;
        $scope.object.street = $scope.selectedAddress.street;
        $scope.object.address = $scope.selectedAddress.address;
        $scope.object.photos = [];
        for(let i of $scope.photos)
        {
            let p = {
                id: i.id,
                description: i.description,
                main: i.main,
                deleted: i.deleted
            };
            $scope.object.photos.push(p);
        }
        
        if ($scope.selectedDeveloper)
        {
            $scope.object.developer_id = $scope.selectedDeveloper.id;
            $scope.object.developer_name = $scope.selectedDeveloper.name;
        }
        else
        {
            $scope.object.developer_id = null;
            $scope.object.developer_name = $scope.developer;
        }
        
        if ($scope.selectedComplex)
        {
            $scope.object.complex_id = $scope.selectedComplex.id;
            $scope.object.complex_name = $scope.selectedComplex.name;
        }
        else
        {
            $scope.object.complex_id = null;
            $scope.object.complex_name = $scope.complex;
        }
        
        $scope.saving = true;
        $scope.saveButton = $i18n('buttons_process.save');
        $http[($scope.id ? 'put' : 'post')]('/api/objects' + ($scope.id ? '/' + $scope.id : ''), $scope.object).then(
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                if (!response.data.success)
                {
                    $scope.showAlert(response.data.message||$i18n('errors.internal'));
                    return false;
                }
                $scope.showMessage($i18n('messages.object.success_' + ($scope.id ? 'updated' : 'created')));
                $location.path('/objects/view/' + response.data.id);
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
