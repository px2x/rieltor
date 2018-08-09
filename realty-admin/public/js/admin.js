angular.module('realty-admin', ['ngRoute', 'LocalStorageModule', 'ngMaterial', 'textAngular'])

//config route
.config(['$routeProvider', '$locationProvider', '$mdDateLocaleProvider',
    function ($routeProvider, $locationProvider, $mdDateLocaleProvider) {
    $routeProvider
        .when('/', {
            controller:'Dashboard',
            templateUrl:'/html/index.html'
        })
        .when('/blacklists', {
            controller:'BlackLists',
            templateUrl:'/html/blacklist/list.html'
        })
        .when('/objects', {
            controller:'Objects',
            templateUrl:'/html/objects/list.html'
        })
        .when('/objects/create', {
            controller:'ObjectsForm',
            templateUrl:'/html/objects/form.html'
        })
        .when('/objects/edit/:id', {
            controller:'ObjectsForm',
            templateUrl:'/html/objects/form.html'
        })
        .when('/objects/view/:id', {
            controller:'ObjectsView',
            templateUrl:'/html/objects/view.html'
        })
        .when('/pages', {
            controller:'Pages',
            templateUrl:'/html/pages/list.html'
        })
        .when('/pages/create', {
            controller:'PagesForm',
            templateUrl:'/html/pages/form.html'
        })
        .when('/pages/edit/:id', {
            controller:'PagesForm',
            templateUrl:'/html/pages/form.html'
        })
        .when('/pages/view/:id', {
            controller:'PagesView',
            templateUrl:'/html/pages/view.html'
        })
        .when('/ads', {
            controller:'Ads',
            templateUrl:'/html/adds/list.html'
        })
        .when('/ads/create', {
            controller:'AdsForm',
            templateUrl:'/html/adds/form.html'
        })
        .when('/ads/create/:pid', {
            controller:'AdsForm',
            templateUrl:'/html/adds/form.html'
        })
        .when('/ads/edit/:id', {
            controller:'AdsForm',
            templateUrl:'/html/adds/form.html'
        })
        .when('/ads/view/:id', {
            controller:'AdsView',
            templateUrl:'/html/adds/view.html'
        })
        .when('/orders', {
            controller:'Orders',
            templateUrl:'/html/orders/list.html'
        })
        .when('/orders/view/:id', {
            controller:'OrderView',
            templateUrl:'/html/orders/view.html'
        })
        .when('/banners', {
            controller:'Banners',
            templateUrl:'/html/banners/list.html'
        })
        .when('/users', {
            controller:'Users',
            templateUrl:'/html/users/list.html'
        })
        .when('/users/view/:id', {
            controller:'UserView',
            templateUrl:'/html/users/view.html'
        })
        .when('/districts', {
            controller:'Districts',
            templateUrl:'/html/districts/list.html'
        })
        .when('/districts/edit/:id', {
            controller:'DistrictForm',
            templateUrl:'/html/districts/form.html'
        })
        .when('/districts/create', {
            controller:'DistrictForm',
            templateUrl:'/html/districts/form.html'
        })
        .when('/developers', {
            controller:'Developers',
            templateUrl:'/html/developers/list.html'
        })
        .when('/developers/edit/:id', {
            controller:'DeveloperForm',
            templateUrl:'/html/developers/form.html'
        })
        .when('/developers/create', {
            controller:'DeveloperForm',
            templateUrl:'/html/developers/form.html'
        })
        .when('/complex/edit/:id', {
            controller:'ComplexForm',
            templateUrl:'/html/complex/form.html'
        })
        .when('/complex/create', {
            controller:'ComplexForm',
            templateUrl:'/html/complex/form.html'
        })
        .when('/import', {
            controller:'Import',
            templateUrl:'/html/import/index.html'
        })
        .when('/settings', {
            controller:'Settings',
            templateUrl:'/html/settings/index.html'
        })
        .when('/blacklist', {
            controller:'BlackList',
            templateUrl:'/html/blacklist/list.html'
        })
        .when('/blacklist/create', {
            controller:'BlackForm',
            templateUrl:'/html/blacklist/form.html'
        })
        .when('/blacklist/edit/:id', {
            controller:'BlackForm',
            templateUrl:'/html/blacklist/form.html'
        })
        .otherwise({
            controller:'NotFound',
            templateUrl:'/html/404.html'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    $mdDateLocaleProvider.months = I18n['datepicker']['months'];
    $mdDateLocaleProvider.shortMonths = I18n['datepicker']['shortMonths'];
    $mdDateLocaleProvider.days = I18n['datepicker']['days'];
    $mdDateLocaleProvider.shortDays = I18n['datepicker']['shortDays'];
    $mdDateLocaleProvider.monthHeaderFormatter = function(date) {
        return $mdDateLocaleProvider.months[date.getMonth()] + ' ' + date.getFullYear();
    };
    $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
        return 'Неделя ' + weekNumber;
    };
    $mdDateLocaleProvider.msgCalendar = 'Календарь';
    $mdDateLocaleProvider.msgOpenCalendar = 'Открыть календарь';
}])

.run(['$rootScope', '$location', '$i18n', '$http', '$mdToast', '$mdDialog', '$window', '$timeout', '$mdSidenav', '$storage',
    function ($rootScope, $location, $i18n, $http, $mdToast, $mdDialog, $window, $timeout, $mdSidenav, $storage) {
    $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $http.defaults.transformResponse.push(function(response, callback, status){
        if (status === 401)
        {
            $rootScope.showAlert(response.message || $i18n('errors.unauthorized'));
            setTimeout(function(){
                location.href = '/redirect';
            }, 1000);
            return false;
        } else if (status !== 200) {
            $rootScope.showAlert(response.message || $i18n('errors.internal'));
        }
        return response;
    });
    
    $rootScope.back = function(){
        if ($window.history.length <= 2)
        {
            $location.path('/');
        }
        else
        {
            $window.history.back();
        }
    };
    
    $rootScope.redirectTo = function(href){
        location.href = href;
    };
    
    $rootScope.openMenu = function(){
        $mdSidenav('menu').open();
    };
    
    $rootScope.closeMenu = function(){
        $mdSidenav('menu').close();
    };
    
    $rootScope.getMenu = function(){
        return $i18n('menu', true);
    };

    $rootScope.showAlert = function (text, title) {
        $mdDialog.show(
            $mdDialog
                .alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title(title || $i18n('common.error'))
                .textContent(text)
                .ok($i18n('common.close'))
        );
        return false;
    };
    
    $rootScope.showConfirm = function (text, title, success, error) {
        $mdDialog.show(
            $mdDialog.confirm()
                .title(title)
                .textContent(text)
                .ok($i18n('common.yes'))
                .cancel($i18n('common.no'))
        ).then(success, error);
    };
    
    $rootScope.showMessage = function (message, type) {
        $mdToast.show(
            $mdToast.simple()
              .textContent(message)
              .position('top right')
              .hideDelay(3000)
        );
    };
    
    $rootScope.i18n = function(key, value){
        if (!value)
        {
            return '';
        }
        return $i18n(key + '.' + value);
    };
    
    $rootScope.getPrural = function(c, m){
        var cases=[2,0,1,1,1,2];
        return m[(c%100>4&&c%100<20)?2:cases[Math.min(c%10,5)]];
    };

    $rootScope.getById = function (a, f) {
        var o = {},
            f = f || 'id';
        for (var i in a)
        {
            o[a[i][f]] = a[i];
        }
        return o;
    };

    $rootScope.removeById = function (a, l) {
        var o = {};
        for (var i in a)
        {
            if (i != l)
            {
                o[i] = a[i];
            }
        }
        return o;
    };
        
    var path;
    $rootScope.$on('$pageReady', function () {
        $rootScope.loading = false;
    });

    $rootScope.$on('$routeChangeSuccess', function () {
        var h1 = $i18n('h1.' + path, false),
            title = $i18n('titles.' + path, false);
        if (!h1)
        {
            h1 = $i18n('h1.default');
        }
        $rootScope.h1 = h1;

        if (!title)
        {
            title = $i18n('titles.not_found');
        }
        document.title = title;
    });

    $rootScope.$on('$routeChangeStart', function () {
        $mdSidenav('menu').close();
        $rootScope.bc = false;
        $rootScope.loading = true;
        path = $location.path().substr(1);
        $rootScope.menu = path.indexOf('/') !== -1 ? path.substr(0, path.indexOf('/')) : (path || 'dashboard');
        if (path.length)
        {
            path = path.replace(/\/[0-9]+$/, '').replace('/', '_');
        }
        else
        {
            path = 'dashboard';
        }

        var text = $i18n('loading.' + path, false);
        if (!text)
        {
            text = $i18n('loading.default');
        }
        $rootScope.loadingText = text;
    });

    $rootScope.buildQuery = function (data) {
        return Object.keys(data).map(function (key) {
            return [key, data[key]].map(encodeURIComponent).join('=');
        }).join('&');
    };
    
    var districts = $storage.get('districts');
    function setDistricts(){
        $rootScope.districts = {};
        for(let l of districts)
        {
            $rootScope.districts[l.id] = l.name;
        }
    };
    if(!districts)
    {
        $http.get('/api/districts').then(
            function(response){
                districts = response.data.data;
                $storage.set('districts', districts);
                setDistricts();
            },
            function(){}
        );
    }
    else
    {
        setDistricts();
    }
    
    $rootScope.copyText = function(text){
        var e = $('<input type="text"/>');
        e.css({position:'absolute',left:-5000, top:0});
        e.val(text);
        $('body').append(e);
        e.select();
        try {
            var successful = document.execCommand('copy');
            if(successful) {
                $mdToast.show(
                    $mdToast.simple()
                      .textContent('Скопировано в буфер')
                      .position('top right')
                      .hideDelay(3000)
                );
            }
        } catch (err) {
            console.log('Oops, unable to copy');
        }
        e.remove();
    };
}])

.component('pagination', {
    bindings: {
        page: '<',
        limit: '<',
        total: '<',
        loadData: '&'
    },
    templateUrl: '/html/pagination.html',
    controller: ['$scope', function ($scope) {
        $scope.pages = [10, 20, 50, 70, 100];
        $scope.init = function () {
            if (this.$ctrl.limit >= this.$ctrl.total)
            {
                $scope.totalPages = 1;
                return false;
            }
            $scope.totalPages = Math.ceil(this.$ctrl.total/this.$ctrl.limit);
        };
        
        $scope.$watch('$ctrl.total', function(e){
            $scope.init();
        });

        $scope.changeLimit = function () {
            this.$ctrl.loadData({$page: 1, $limit: this.$ctrl.limit});
            $scope.init();
        };
        
        $scope.changePage = function(type){
            var page = parseInt(this.$ctrl.page);
            if (isNaN(page))
            {
                page = 1;
            }
            if (type != undefined)
            {
                page += (type == 'next' ? 1 : -1);
            }
            if (page > $scope.totalPages)
            {
                page = $scope.totalPages;
            }
            if (page < 1)
            {
                page = 1;
            }
            this.$ctrl.page = page;
            this.$ctrl.loadData({$page: page, $limit: this.$ctrl.limit});
        };
        
    }]
})
.component('map', {
    bindings: {
        lat: '<',
        lng: '<'
    },
    template: '<div id="map"></div>',
    controller: ['$scope', function ($scope) {
        var marker, map, coords;
        
        setTimeout(function(){
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 47.2313500, lng: 39.7232800},
                zoom: 15,
                disableDefaultUI: true,
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.RIGHT_CENTER
                }
            });
            function initObject(lat){
                if (this.$ctrl.lat)
                {
                    coords = new google.maps.LatLng(this.$ctrl.lat, this.$ctrl.lng);
                    marker = new google.maps.Marker({
                        map: map,
                        position: coords
                    });

                    map.setCenter(coords);
                }
            }
            $scope.$watch('$ctrl.lat', function(e){
                initObject.call($scope, e);
            });
        }, 100);
        
    }]
})
.component('fileupload', {
    bindings: {
        photos: '='
    },
    templateUrl: '/html/fileupload.html',
    controller: ['$scope', '$http', '$element', '$i18n', function ($scope, $http, $element, $i18n) {
        var maxWidth = 0;
        $scope.initUpload = function(){
            $element.find('.fileupload-input').bind('change', function(){
                if (!this.files || (this.files instanceof window.FileList) === false)
                {
                    return false;
                }

                for (var i = 0; i < this.files.length; i++)
                {
                    var type = this.files[i].type;
                    var isImage = (type === 'image/jpeg' || type === 'image/jpg');
                    if( !isImage)
                    {
                        $scope.$root.showAlert('Недопустимый формат данных. Разрешено загружать только jpeg и jpg');
                        return false;
                    }

                    var readFile = new window.FileReader;
                    readFile.onload = function(event) {
                        var img = document.createElement('img');
                        img.src = event.target.result;
                        img.onload = function(){
                            var canvas = document.createElement("canvas");
                            var width = img.width;
                            var height = img.height;

                            if( typeof(EXIF) != 'undefined' )
                            {
                                EXIF.getData(img, function() {
                                    resizeCanvas(EXIF.getTag(img, 'Orientation'));
                                });
                            }
                            else
                            {
                                resizeCanvas();
                            }

                            function resizeCanvas(o)
                            {
                                var orientation = o || false;
                                var rotate = false;

                                if (maxWidth != 0)
                                {
                                    if (width > height)
                                    {
                                        if (width > maxWidth)
                                        {
                                            height *= maxWidth / width;
                                            width = maxWidth;
                                        }
                                    }
                                    else
                                    {
                                        if (height > maxWidth)
                                        {
                                            width *= maxWidth / height;
                                            height = maxWidth;
                                        }
                                    }
                                }

                                if( orientation > 4 )
                                {
                                    width = img.height;
                                    height = img.width;
                                    rotate = true;
                                }

                                canvas.height = height;
                                canvas.width = width;

                                var ctx = canvas.getContext('2d');
                                ctx.width = width;
                                ctx.height = height;

                                if( orientation > 1 )
                                {
                                    switch (orientation) {
                                        case 2:
                                            ctx.translate(width, 0);
                                            ctx.scale(-1, 1);
                                            break;
                                        case 3:
                                            ctx.translate(width, height);
                                            ctx.rotate(Math.PI);
                                            break;
                                        case 4:
                                            ctx.translate(0, height);
                                            ctx.scale(1, -1);
                                            break;
                                        case 5:
                                            ctx.rotate(0.5 * Math.PI);
                                            ctx.scale(1, -1);
                                            break;
                                        case 6:
                                            ctx.rotate(0.5 * Math.PI);
                                            ctx.translate(0, -width);
                                            break;
                                        case 7:
                                            ctx.rotate(0.5 * Math.PI);
                                            ctx.translate(height, -width);
                                            ctx.scale(-1, 1);
                                            break;
                                        case 8:
                                            ctx.rotate(-0.5 * Math.PI);
                                            ctx.translate(-height, 0);
                                            break;
                                    }
                                }

                                ctx.drawImage(img, 0, 0, (rotate ? height : width), (rotate ? width : height));
                                var file = dataURLToBlob(canvas.toDataURL('image/jpeg'));
                                
                                var thWidth = 240;
                                var thHeight;
                                if (width > height)
                                {
                                    thHeight = height * thWidth / width;
                                }
                                else
                                {
                                    thHeight = 180;
                                    thWidth = width * thHeight / height;
                                }
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                canvas.height = thHeight;
                                canvas.width = thWidth;
                                ctx.width = thWidth;
                                ctx.height = thHeight;
                                ctx.drawImage(img, 0, 0, (rotate ? thHeight : thWidth), (rotate ? thWidth : thHeight));
                                
                                var src = canvas.toDataURL('image/jpeg');
                                
                                var index;
                                $scope.$apply(function(){
                                    index = this.$ctrl.photos.length;
                                    this.$ctrl.photos.push({
                                        src: src,
                                        loading: true,
                                        name: readFile.name
                                    });
                                }.bind($scope));
                                
                                var formData = new FormData();
                                formData.append('type', 'photo');
                                formData.append('image', file, readFile.name);
                                $http({
                                    data: formData,
                                    method: 'POST',
                                    url: '/api/photos',
                                    headers: {
                                        'Content-Type': undefined
                                    }
                                }).then(function(response){
                                    this.$ctrl.photos[index].loading = false;
                                    if (!response.data.success)
                                    {
                                        $scope.$root.showAlert(response.data.message||$i18n('errors.internal'), 'error');
                                        this.$ctrl.photos[index].error = true;
                                        return false;
                                    }
                                    this.$ctrl.photos[index].id = response.data.id;
                                }.bind($scope), function(response){
                                    $scope.$root.showAlert(response.data.message||$i18n('errors.internal'), 'error');
                                });
                            }
                        };
                    };

                    readFile.name = this.files[i].name;
                    readFile.readAsDataURL(this.files[i]);
                }
            });
        };
        
        $scope.deletePhoto = function(index){
            var photo = this.$ctrl.photos[index];
            if (!photo)
            {
                return false;
            }
            if (photo.src)
            {
                $http.delete('/api/photos/' + photo.id).then(function(response){
                    if (!response.data.success)
                    {
                        $scope.$root.showAlert(response.data.message||$i18n('errors.internal'), 'error');
                    }
                    this.$ctrl.photos.splice(index, 1);
                }.bind($scope), function(response){
                    $scope.$root.showAlert(response.data.message||$i18n('errors.internal'), 'error');
                });
            }
            else
            {
                this.$ctrl.photos[index].deleted = true;
            }
        };
        
        $scope.cancelDeleting = function(index){
            var photo = this.$ctrl.photos[index];
            if (!photo)
            {
                return false;
            }
            this.$ctrl.photos[index].deleted = undefined;
        };
        
        $scope.setAsMain = function(index){
            var photo = this.$ctrl.photos[index];
            if (!photo || photo.main == 1)
            {
                return false;
            }
            for (let k of this.$ctrl.photos)
            {
                if(k.main)
                {
                    k.main = false;
                }
            }
            this.$ctrl.photos[index].main = true;
        };
        
        function dataURLToBlob(dataURL) {
            var BASE64_MARKER = ';base64,';
            if (dataURL.indexOf(BASE64_MARKER) === -1)
            {
                var parts = dataURL.split(',');
                var contentType = parts[0].split(':')[1];
                var raw = decodeURIComponent(parts[1]);
                return new Blob([raw], {type: contentType});
            }
            var parts = dataURL.split(BASE64_MARKER);
            var contentType = parts[0].split(':')[1];
            var raw = window.atob(parts[1]);
            var rawLength = raw.length;
            var uInt8Array = new Uint8Array(rawLength);
            for (var i = 0; i < rawLength; ++i)
            {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], {type: contentType});
        }
    }]
})

.directive("fileread", ['$http', '$rootScope', '$mdDialog', '$i18n', function ($http, $rootScope, $mdDialog, $i18n) {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                $rootScope.loadingXML = true;
                var reader = new FileReader();
                var file = this.files[0];
                reader.onload = function (loadEvent) {
                    var type = file.name.substring(file.name.length-3);
                    var isXml = (type === 'xml' || type === 'yrl');
                    if( !isXml)
                    {
                        
                        $mdDialog.show(
                            $mdDialog
                                .alert()
                                .clickOutsideToClose(true)
                                .title('Неверный тип данных')
                                .textContent('Недопустимый формат данных. Разрешено загружать только xml/yrl')
                                .ok($i18n('common.close'))
                        );
                            $rootScope.loadingXML = false;
                        return false;
                    }
                    
                    $http.post('/api/importADS', {xml: loadEvent.target.result }).then(
                        function (response) {
                            $rootScope.data = response.data;
                            $rootScope.loadingXML = false;
                        },
                        function (response) {
                        }
                    );
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    };
}])
.directive('inputMask', function(){
  return {
    restrict: 'A',
    link: function(scope, el, attrs){
        $(el).inputmask(scope.$eval(attrs.inputMask));
        $(el).on('change', function(){
            scope.$eval(attrs.ngModel + "='" + el.val() + "'");
        });
    }
  };
});
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

angular.module('realty-admin')

.controller('Banners', ['$scope', '$i18n', '$http', '$storage', '$httpParamSerializer', 
        function ($scope, $i18n, $http, $storage, $queryBuilder) {
    var filter = $storage.get('list.banners');
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
            $scope.filter.page = page;
        }
        if (limit)
        {
            limitChanged = true;
            $scope.filter.limit = limit;
        }
        $storage.set('list.banners', $scope.filter);
        $http.get('/api/banners?' + $queryBuilder($scope.filter)).then(
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
        $scope.$root.showConfirm('Вы уверены что хотите удалить этот баннер?', 'Удалить баннер?', function(){
            $scope.loading = true;
            $http.delete('/api/banners/' + id).then(
                function (response) {
                    if (response.data.success)
                    {
                        $scope.showMessage($i18n('messages.banner.success_deleted'));
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

.controller('BannerView', ['$scope', '$i18n', '$http', '$routeParams', '$location', function ($scope, $i18n, $http, $routeParams, $location) {
    $scope.loading = false;
    $scope.id = $routeParams.id;
    $http.get('/api/banners/' + $scope.id).then(function(response){
        if (response.data.success)
        {
            $scope.banner = response.data.banner;
        }
        else
        {
            $scope.showMessage(response.data.message||$i18n('errors.internal'), 'error');
            $location.path('/banners');
            return false;
        }
        $scope.loading = false;
        $scope.$emit('$pageReady');
    }, function(){
        $location.path('/banners');
    });
    
    $scope.progress = false;
    $scope.deleteItem = function () {
        if( $scope.progress )
        {
            return false;
        }
        $scope.$root.showConfirm('Вы уверены что хотите удалить этот баннер?', 'Удалить баннер?', function(){
            $scope.progress = true;
            $http.delete('/api/banners/' + $scope.id).then(
                function (response) {
                    if (response.data.success)
                    {
                        $scope.showMessage($i18n('messages.banners.success_deleted'));
                        $location.path('/banners');
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
angular.module('realty-admin')

.controller('ComplexForm', ['$scope', '$i18n', '$http', '$storage', '$location', '$routeParams', 
        function ($scope, $i18n, $http, $storage, $location, $routeParams) {
    $scope.saveButton = $i18n('buttons.save');
    $scope.id = $routeParams.id;
    $scope.saving = false;
    
    if ($scope.id)
    {
        $http.get('/api/complex/' + $scope.id).then(function(response){
            if (response.data.success)
            {
                $scope.complex = response.data.complex;
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
        $http[($scope.id ? 'put' : 'post')]('/api/complex' + ($scope.id ? '/' + $scope.id : ''), $scope.complex).then(
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                if (!response.data.success)
                {
                    $scope.showAlert(response.data.message||$i18n('errors.internal'));
                    return false;
                }
                $scope.showMessage($i18n('messages.complex.success_' + ($scope.id ? 'updated' : 'created')));
                $location.path('/settings');
            },
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                $scope.showAlert(response.data.message||$i18n('errors.internal'));
            }
        );
    };
}]);
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
angular.module('realty-admin')

.controller('DistrictForm', ['$scope', '$i18n', '$http', '$storage', '$location', '$routeParams', 
        function ($scope, $i18n, $http, $storage, $location, $routeParams) {
    $scope.saveButton = $i18n('buttons.save');
    $scope.id = $routeParams.id;
    $scope.saving = false;
    $scope.type = $i18n('districts.type');

    $http.get('/api/cities/').then(function(response){
        if (response.data.success)
        {
            $scope.cities = response.data.data;
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
    
    if ($scope.id)
    {
        $http.get('/api/districts/' + $scope.id).then(function(response){
            if (response.data.success)
            {
                $scope.district = response.data.district;
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
        $http[($scope.id ? 'put' : 'post')]('/api/districts' + ($scope.id ? '/' + $scope.id : ''), $scope.district).then(
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                if (!response.data.success)
                {
                    $scope.showAlert(response.data.message||$i18n('errors.internal'));
                    return false;
                }
                $scope.showMessage($i18n('messages.district.success_' + ($scope.id ? 'updated' : 'created')));
                $location.path('/settings');
            },
            function(response){
                $scope.saving = false;
                $scope.saveButton = $i18n('buttons.save');
                $scope.showAlert(response.data.message||$i18n('errors.internal'));
            }
        );
    };
            
}]);
angular.module('realty-admin')

.controller('Import', ['$scope', '$i18n', '$http', '$mdDialog', '$rootScope', function ($scope, $i18n, $http, $mdDialog, $rootScope) {
    $scope.$emit('$pageReady');
    $scope.showFileDialog = function(){
        $('[name="ads"]').click();
    };
    $scope.importXml = function (p) {
        $rootScope.loadingXML = true;
        $http.post('/api/importAdsToDatabase', {fileName: $scope.data.fname, check: p }).then(
            function (response) {
                $rootScope.loadingXML = false;
                if(response.data.status === true)
                {
                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .clickOutsideToClose(true)
                            .title('Импорт данных')
                            .textContent('Успешно импортировано ' + response.data.countSave + ' записей')
                            .ok($i18n('common.close'))
                    );
                }
                else
                {
                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .clickOutsideToClose(true)
                            .title('Импорт данных')
                            .textContent('Не удалось импортировать данные. Пожалуйста, перезагрузите страницу и попробуйте снова')
                            .ok($i18n('common.close'))
                    );
                    
                }
            },
            function (response) {
                $rootScope.loadingXML = false;
            }
        );
        
    };
    
}]);
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

//Multilanguage
var I18n = window.I18n;
angular.module('realty-admin').factory('$i18n', function () {
    return function (key, params) {
        if (key.length > 0)
        {
            var keys = key.split('.');
            if (I18n[keys[0]] !== undefined)
            {
                var str = '', temp = I18n[keys[0]];
                for (var i = 1; i < keys.length; i++)
                {
                    if(typeof (temp[keys[i]]) !== 'undefined')
                    {
                        temp = temp[keys[i]];
                        continue;
                    }
                    break;
                }
                if (typeof (temp) === 'string')
                {
                    str = temp;
                }
                else if (typeof (temp) === 'object')
                {
                    if (params === false)
                    {
                        return false;
                    }
                    return temp;
                }

                if (str.length > 0)
                {
                    if (params && params.length)
                    {
                        for (var k in params)
                        {
                            str = str.replace(':param' + k, params[k]);
                        }
                    }
                    return str;
                }
            }
            return key;
        }
        return false;
    };
})
.directive('i18n', ['$i18n', function ($i18n) {
    return {
        restrict: 'A',
        scope: {
            key: '=',
            params: '=',
            pl: '='
        },
        link: function (scope, element, attrs) {
            if (attrs.pl) //placehoder
            {
                element.attr('placeholder', $i18n(attrs.pl, attrs.params));
            }
            else if (attrs.key)
            {
                element.html($i18n(attrs.key, attrs.params));
            }
        }
    };
}]);

//Local Storage module
angular.module('realty-admin').factory('$storage', ['localStorageService', function ($localStorage) {
    var dataObject = {};
    return {
        get: function (type) {
            if (!dataObject[type])
            {
                dataObject[type] = $localStorage.get(type);
            }
            return dataObject[type];
        },
        set: function (type, data) {
            $localStorage.set(type, data);
            dataObject[type] = data;
            return data;
        },
        remove: function (type) {
            $localStorage.remove(type);
            delete(dataObject[type]);
            return true;
        },
        clear: function () {
            $localStorage.clearAll();
            dataObject = {};
            return true;
        }
    };
}]);
