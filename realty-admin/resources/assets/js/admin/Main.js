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