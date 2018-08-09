angular.module('realty-admin')

.controller('Ads', ['$scope', '$i18n', '$http', '$storage', '$httpParamSerializer', 
        function ($scope, $i18n, $http, $storage, $queryBuilder) {
    var filter = $storage.get('list.ads');
    if( !filter )
    {
        filter = {
            page: 1,
            limit: 10
        };
    }
    if(filter.date_from) {
        var d = new Date(filter.date_from.replace(/T.*$/, ''));
        filter.date_from = d;
    }
    if(filter.date_to) {
        var d = new Date(filter.date_to.replace(/T.*$/, ''));
        filter.date_to = d;
    }
    $scope.filter = filter;
    $scope.loading = true;
    $scope.total = 0;
    $scope.items = [];
    $scope.type = $i18n('ads_types');
    $scope.material = $i18n('object_materials');
    $scope.status = $i18n('ads_status');
    $scope.conditions = $i18n('object_conditions');
    var limitChanged = false;
    $scope.maxDate = new Date();
    
    $scope.clearFilter = function(){
        $scope.filter = {
            page: 1,
            limit: $scope.filter.limit
        };
        $scope.loadData();
    };
    
    
    $scope.changeType = function(){
        $scope.filter.subtype = null;
        var subtypes = $.extend({}, $i18n('ads_subtype'));
        if($scope.filter.type == 1) {
            delete(subtypes[3]);
            delete(subtypes[4]);
        } else if($scope.filter.type == 5) {
            delete(subtypes[0]);
            delete(subtypes[1]);
            delete(subtypes[2]);
        } else {
            subtypes = false;
        }
        $scope.subtypes = subtypes;
        $scope.loadData(1);
    };
    
    $scope.formatPrice = function(v){
        return parseInt(v).toLocaleString('ru');
    };
    
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
        $storage.set('list.ads', $scope.filter);
        var filter = angular.extend({}, $scope.filter);
        var checkFilter = ['complex', 'developer', 'district_m', 'district_o'];
        for(var i in checkFilter) {
            var k = checkFilter[i];
            if(filter[k] && filter[k].id) {
                filter[k] = filter[k].id;
            }
        }
        $http.get('/api/ads?' + $queryBuilder(filter)).then(
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
    
    $scope.changeType();

    $scope.deleteItem = function (id) {
        if( $scope.loading )
        {
            return false;
        }
        $scope.$root.showConfirm('Вы уверены что хотите удалить это объявление?', 'Удалить объявление?', function(){
            $scope.loading = true;
            $http.delete('/api/adds/' + id).then(
                function (response) {
                    if (response.data.success)
                    {
                        $scope.showMessage($i18n('messages.ad.success_deleted'));
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
    
    $scope.searchData = function (data, type, t) {
        if (data.length > 2)
        {
            return $http.get('/api/' + type + '?search=' + encodeURIComponent(data) + (t ? '&type=' + t : '' ))
                    .then(function(response){
                        return response.data.data;
                    }, function(){
                        return [];
                    });
        } else {
            return [];
        }
    };
    
}])

.controller('AdsView', ['$scope', '$i18n', '$http', '$routeParams', '$location', function ($scope, $i18n, $http, $routeParams, $location) {
    $scope.loading = false;
    $scope.id = $routeParams.id;
    $scope.$root.bc = {href: '/ads', title: $i18n('h1.ads'), icon: 'location_on'};
    $scope.$root.h1 = $scope.$root.h1  + ' № ' + $scope.id;
    $http.get('/api/adds/' + $scope.id).then(function(response){
        if (response.data.success)
        {
            var districts = response.data.districts, dist = {};
            for(var d of districts)
            {
                dist[d.id] = d.name;
            }
            $scope.districts = dist;
            $scope.ad = response.data.ad;
            $scope.photos = response.data.photos;
        }
        else
        {
            $scope.showMessage(response.data.message||$i18n('errors.internal'), 'error');
            $location.path('/ads');
            return false;
        }
        $scope.loading = false;
        $scope.$emit('$pageReady');
    }, function(){
        $location.path('/ads');
    });
    
    $scope.progress = false;
    $scope.deleteItem = function () {
        if( $scope.progress )
        {
            return false;
        }
        $scope.$root.showConfirm('Вы уверены что хотите удалить это объявление?', 'Удалить объявление?', function(){
            $scope.progress = true;
            $http.delete('/api/adds/' + $scope.id).then(
                function (response) {
                    if (response.data.success)
                    {
                        $scope.showMessage($i18n('messages.ads.success_deleted'));
                        $location.path('/ads');
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

.controller('AdsForm', ['$scope', '$i18n', '$http', '$routeParams', '$location', '$q', '$storage', '$mdDialog',
        function ($scope, $i18n, $http, $routeParams, $location, $q, $storage, $mdDialog) {
    $scope.loading = false;
    $scope.id = $routeParams.id;
    $scope.address = '';
    $scope.editAddress = false;
    $scope.addresses = [];
    $scope.adsTypes = $i18n('ads_types');
    $scope.AdsSubtype = $i18n('ads_subtype');
    $scope.ads_pltype = $i18n('ads_pltype');
    $scope.objectMaterials = $i18n('object_materials'); 
    $scope.conditions = $i18n('object_conditions'); 
    $scope.nameADS = '';
    $scope.ad = {};
    if ($routeParams.pid)
    {
        $scope.$root.bc = {href: '/objects/' + $routeParams.pid, title: $i18n('h1.objects'), icon: 'location_city'};
    }
    else
    {
        $scope.$root.bc = {href: '/ads', title: $i18n('h1.ads'), icon: 'location_on'};
        if($scope.id) {
            $scope.$root.h1 = $scope.$root.h1  + ' № ' + $scope.id
        }
    }
    
    $scope.saveButton = $i18n('buttons.save');
    
    $scope.selectType = function () {
        $scope.changeName();
        //$scope.type 
        
        if($scope.ad.type == '1')
        {
            
            $scope.AdsSubtype = {
                0: 'изолированное',
                1: 'комната',
                2: 'гостинка',
            };
        }
        else if ($scope.ad.type == '5' )
        {
            
            $scope.AdsSubtype = {
                3: 'офис',
                4: 'торговая площадка'
            };
        }
    };
    $scope.changeName = function () {
        
        if($scope.ad.type == 1)
        {
            $scope.nameADS = 'Продается ' + $scope.adsTypes[$scope.ad.type] + ' ';
            if($scope.ad.rent)
            {
                $scope.nameADS = 'Сдается ' + $scope.adsTypes[$scope.ad.type] + ' ';
            }
            if($scope.ad.rooms)
            {
                $scope.nameADS = 'Продается ' + $scope.ad.rooms + ' комнатная ' + $scope.adsTypes[$scope.ad.type] + ' ';
                if($scope.ad.rent)
                {
                    $scope.nameADS = 'Сдается ' + $scope.ad.rooms + ' комнатная ' + $scope.adsTypes[$scope.ad.type] + ' ';
                }
            }
            if($scope.ad.subtype == 2)
            {
                $scope.nameADS = 'Продается гостинка ';
                if($scope.ad.rent)
                {
                    $scope.nameADS = 'Сдается гостинка ';
                }
            }
            if($scope.ad.subtype == 1)
            {
                $scope.nameADS = 'Продается комната ';
                if($scope.ad.rent)
                {
                    $scope.nameADS = 'Сдается комната ';
                }
            }
            if($scope.ad.sq1) {
                $scope.nameADS = $scope.nameADS.concat(   + $scope.ad.sq1);
            }
            if($scope.ad.sq2) {
                $scope.nameADS = $scope.nameADS.concat( '\/' + $scope.ad.sq2);
            }
            if($scope.ad.sq3) {
                $scope.nameADS = $scope.nameADS.concat( '\/' + $scope.ad.sq3);
            }
            
        }
        if($scope.ad.type == 4)
        {
            $scope.nameADS = 'Продается ' + $scope.adsTypes[$scope.ad.type] + ' ';
            if($scope.ad.rent)
            {
                $scope.nameADS = 'Сдается ' + $scope.adsTypes[$scope.ad.type] + ' ';
            }
            if($scope.ad.sq4) {
                $scope.nameADS = $scope.nameADS.concat( ' ' + $scope.ad.sq4 + ' ' + $scope.ad.sqt4);
            }
        }
        if($scope.ad.type == 2)
        {
            $scope.nameADS = 'Продается ' + $scope.adsTypes[$scope.ad.type] + ' ';
            if($scope.ad.rent)
            {
                $scope.nameADS = 'Сдается ' + $scope.adsTypes[$scope.ad.type] + ' ';
            }
            if($scope.selectedAddress.street) {
                $scope.nameADS = $scope.nameADS.concat( 'на ' +$scope.selectedAddress.street);
            }
            if($scope.ad.sq1) {
                $scope.nameADS = $scope.nameADS.concat( ' ' + $scope.ad.sq1 + ' ' + $scope.ad.sqt1 + '.');
            }
            if($scope.ad.sq4) {
                $scope.nameADS = $scope.nameADS.concat( ' ' + $scope.ad.sq4 + ' ' + $scope.ad.sqt4);
            }
        }
        if($scope.ad.type == 5)
        {
            $scope.nameADS = 'Продается офис ';
            if($scope.ad.rent)
            {
                $scope.nameADS = 'Сдается офис';
            }
            if($scope.selectedAddress.street) {
                $scope.nameADS = $scope.nameADS.concat( 'на ' +$scope.selectedAddress.street);
            }
            if($scope.ad.sq1) {
                $scope.nameADS = $scope.nameADS.concat( ' ' + $scope.ad.sq1 + ' ' + $scope.ad.sqt1 + '.');
            }
        }
        if($scope.ad.type == 3)
        {
            $scope.nameADS = 'Продается ' + $scope.adsTypes[$scope.ad.type] + ' ';
            if($scope.ad.rent)
            {
                $scope.nameADS = 'Сдается ' + $scope.adsTypes[$scope.ad.type] + ' ';
            }
            if($scope.ad.sq4) {
                $scope.nameADS = $scope.nameADS.concat( ' ' + $scope.ad.sq4 + ' ' + $scope.ad.sqt4);
            }
        }
    };
    $scope.saving = false;
    if ($scope.id)
    {
        $http.get('/api/adds/' + $scope.id).then(function(response){
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
                $scope.ad = response.data.ad;
                if($scope.ad.name)
                {
                    $scope.nameADS = $scope.ad.name;
                }
                if($scope.ad.popular == '1')
                {
                    $scope.ad.popular = true;
                }
                else 
                {
                    $scope.ad.popular = false;
                }
                if($scope.ad.rent == '1')
                {
                    $scope.ad.rent = true;
                }
                else 
                {
                    $scope.ad.rent = false;
                }
                
                $scope.ad.publish = response.data.ad.status === 'publish';
                
                $scope.object = response.data.object;
                $scope.photos = response.data.photos;
                $scope.selectedAddress = {
                    address: $scope.ad.address,
                    street: $scope.ad.street,
                    building: $scope.ad.building,
                    city_name: $scope.ad.city_name,
                    location: (new google.maps.LatLng($scope.ad.lat, $scope.ad.lng))
//                    ready: true
                };
                
                if ($scope.ad.user_id)
                {
                    $http.get('/api/users/' + $scope.ad.user_id).then(function(responses){
                        $scope.selectedUser = {id: $scope.ad.user_id, name: responses.data.user.name};
                    }, function(){
                        $location.path('/ads');
                    });
                }
                if ($scope.ad.developer_id)
                {
                    $scope.selectedDeveloper = {id: $scope.ad.developer_id, name: $scope.ad.developer_name};
                }
                if ($scope.ad.complex_id)
                {
                    $scope.selectedComplex = {id: $scope.ad.complex_id, name: $scope.ad.complex_name};
                }
                
                $scope.prevAddress = $scope.selectedAddress;
            }
            else
            {
                $scope.showAlert(response.data.message||$i18n('errors.internal'), 'error');
                $location.path('/ads');
                return false;
            }
            $scope.loading = false;
            $scope.$emit('$pageReady');
        }, function(){
            $location.path('/ads');
        });
    }
    else
    {
        $scope.ad = {publish:true};
        $scope.photos = [];
        if ($routeParams.pid)
        {
            $http.get('/api/objects/' + $routeParams.pid)
                .then(function(response){
                    if(response.data.success)
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
                        $scope.selectedAddress = {
                            address: $scope.object.address,
                            street: $scope.object.street,
                            building: $scope.object.building,
                            city_name: $scope.object.city_name,
                            location: (new google.maps.LatLng($scope.object.lat, $scope.object.lng)),
                            readonly: true
                        };

                        if ($scope.object.developer_id)
                        {
                            $scope.selectedDeveloper = {id: $scope.object.developer_id, name: $scope.object.developer_name};
                        }
                        if ($scope.object.complex_id)
                        {
                            $scope.selectedComplex = {id: $scope.object.complex_id, name: $scope.object.complex_name};
                        }
                        
                        $scope.ad = {
                            object_id   : $scope.object.id,
                            floor_t     : $scope.object.cnt_floors,
                            material    : $scope.object.material,
                            district_o  : $scope.object.district_o,
                            district_m  : $scope.object.district_m,
                            cnt_lifts   : $scope.object.cnt_lifts,
                            cnt_porchs  : $scope.object.cnt_porchs,
                        };
                        if($scope.object.developer_id)
                        {
                            $scope.selectedDeveloper = {};
                            $scope.selectedDeveloper.id     = $scope.object.developer_id;
                            $scope.selectedDeveloper.name   = $scope.object.developer_name;
                        }
                        if($scope.object.complex_id)
                        {
                            $scope.selectedComplex = {};
                            $scope.selectedComplex.id       = $scope.object.complex_id;
                            $scope.selectedComplex.name     = $scope.object.complex_name;
                        }
                        
                        $scope.$emit('$pageReady');
                    }
                    else
                    {
                        $scope.showAlert(response.data.message||$i18n('errors.internal'), 'error');
                        $location.path('/ads');
                    }
                }, function(response){
                    $scope.showAlert(response.data.message||$i18n('errors.internal'), 'error');
                    $location.path('/ads');
                });
        }
        else
        {
            $http.get('/api/districts').then(function(response){
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
                $scope.$emit('$pageReady');
            }, function(response){
                $scope.showAlert(response.data.message||$i18n('errors.internal'), 'error');
                $location.path('/ads');
            });
        }
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
                                full_address: results[i]['description'],
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
            $scope.ad.lat = $scope.selectedAddress.location.lat();
            $scope.ad.lng = $scope.selectedAddress.location.lng();
            if(!$scope.prevAddress || 
                $scope.prevAddress.lat != $scope.selectedAddress.lat ||
                $scope.prevAddress.lng != $scope.selectedAddress.lng)
            {
                $scope.searchObject = true;
                $http.get('/api/objects?coords[lat]=' + $scope.ad.lat + '&coords[lng]=' + $scope.ad.lng)
                    .then(function(response){
                        $scope.searchObject = false;
                        $scope.selectedAddress.ready = true;
                        if(response.data.total > 0)
                        {
                            $scope.object = response.data.data[0];
                            $scope.ad = {
                            object_id   : $scope.object.id,
                            floor_t     : $scope.object.cnt_floors,
                            material    : $scope.object.material,
                            district_o  : $scope.object.district_o,
                            district_m  : $scope.object.district_m,
                            cnt_lifts   : $scope.object.cnt_lifts,
                            cnt_porchs  : $scope.object.cnt_porchs,
                        };
                            if($scope.object.developer_id)
                            {
                                $scope.selectedDeveloper = {};
                                $scope.selectedDeveloper.id     = $scope.object.developer_id;
                                $scope.selectedDeveloper.name   = $scope.object.developer_name;
                            }
                            if($scope.object.complex_id)
                            {
                                $scope.selectedComplex = {};
                                $scope.selectedComplex.id       = $scope.object.complex_id;
                                $scope.selectedComplex.name     = $scope.object.complex_name;
                            }
                        }
                        else
                        {
                            $scope.object = false;
                        }
                    }, function(response){
                        $scope.searchObject = false;
                        $scope.selectedAddress.ready = true;
                        $scope.object = false;
                    });
            }
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
    
    $scope.selectRoom = function () {
        $scope.changeName();
        if($scope.object) 
        {
            $scope.ad.sq1 = $scope.object['sq'+$scope.ad.rooms+'_c'];
            $scope.ad.sq2 = $scope.object['sq'+$scope.ad.rooms+'_l'];
            $scope.ad.sq3 = $scope.object['sq'+$scope.ad.rooms+'_k'];
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
        if (!$scope.selectedAddress)
        {
            $scope.showAlert($i18n('errors.object.no_address'));
            return false;
        }
        if (!$scope.ad.type || !$scope.selectedAddress)
        {
            $mdDialog.show(
                $mdDialog
                    .alert()
//                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Обязательные поля')
                    .textContent('Пожалуйста, заполните обязательные поля')
                    .ok($i18n('common.close'))
            );
            return false;
        }
        if($scope.ad.popular == true)
        {
            $scope.ad.popular = '1';
        }
        else 
        {
            $scope.ad.popular = '0';
        }
        if($scope.ad.rent == true)
        {
            $scope.ad.rent = '1';
        }
        else 
        {
            $scope.ad.rent = '0';
        }
        
        $scope.ad.publish = +$scope.ad.publish;
        $scope.ad.name = $scope.nameADS;
        $scope.ad.address = $scope.selectedAddress.address;
        $scope.ad.address = $scope.selectedAddress.address;
        $scope.ad.street = $scope.selectedAddress.street;

        $scope.ad.lat = $scope.selectedAddress.location.lat();
        $scope.ad.lng = $scope.selectedAddress.location.lng();
        
        $scope.ad.photos = [];
        for(let i of $scope.photos)
        {
            let p = {
                id: i.id,
                description: i.description,
                main: i.main,
                deleted: i.deleted
            };
            $scope.ad.photos.push(p);
        }
        if ($scope.selectedDeveloper)
        {
            $scope.ad.developer_id = $scope.selectedDeveloper.id;
            $scope.ad.developer_name = $scope.selectedDeveloper.name;
        }
        else
        {
            $scope.ad.developer_id = null;
            $scope.ad.developer_name = $scope.developer;
        }
        
        if ($scope.selectedUser)
        {
            $scope.ad.user_id = $scope.selectedUser.id;
        }
        else
        {
            $scope.ad.user_id = null;
        }
        
        if ($scope.selectedComplex)
        {
            $scope.ad.complex_id = $scope.selectedComplex.id;
            $scope.ad.complex_name = $scope.selectedComplex.name;
        }
        else
        {
            $scope.ad.complex_id = null;
            $scope.ad.complex_name = $scope.complex;
        }
        if($scope.nameADS)
        {
            $scope.ad.name = $scope.nameADS;
        }
        else 
        {
            $scope.ad.name = ' ';
        }
        
        $scope.saving = true;
        $scope.saveButton = $i18n('buttons_process.save');
        $http[($scope.id ? 'put' : 'post')]('/api/adds' + ($scope.id ? '/' + $scope.id : ''), $scope.ad).then(
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                if (!response.data.success)
                {
                    $scope.showAlert(response.data.message||$i18n('errors.internal'));
                    return false;
                }
                $scope.showMessage($i18n('messages.ad.success_' + ($scope.id ? 'updated' : 'created')));
                $location.path('/ads/view/' + response.data.id);
            },
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                $scope.showAlert(response.data.message||$i18n('errors.internal'));
            }
        );
    };
    
}]);
