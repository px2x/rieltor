$(function ($) {
    $('#prevPage').on('click', function (e) {
        e.preventDefault();
        if ($('#from').text() != 1) {
            var re = /page=[0-9]+/;
            if (window.location.href.indexOf('page') != -1) {
                var page = getUrlParameter('page');
                var url = window.location.href.replace(re, 'page=' + (parseInt(page) - 1))
            }
            location.href = url;
        } else {
        }
    });
    $('#nextPage').on('click', function (e) {
        e.preventDefault();
        if ($('#to').text() !=  $('#total').text()) {
            if (window.location.href.indexOf('page') != -1) {
                var re = /page=[0-9]+/;
                var page = getUrlParameter('page');
                var url = window.location.href.replace(re, 'page=' + (parseInt(page) + 1))
            } else {
                if (window.location.href.indexOf('?') != -1) {
                    var url = window.location.href + '&page=2';
                } else {
                    var url = window.location.href + '?page=2';
                }
            }
            location.href = url;
        } else {
        }
    });

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };
    
});

