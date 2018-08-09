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