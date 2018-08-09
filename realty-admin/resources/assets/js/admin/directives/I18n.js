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
