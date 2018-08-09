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
