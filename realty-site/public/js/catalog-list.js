$(function ($) {
    var basket = JSON.parse(localStorage.getItem('realty-basket'));
    if (basket == null) {
        basket = [];
    }

    if (total != '0') {
        $('#foundRes').removeClass('hidden');
        $('#notFound').addClass('hidden');
    } else {
        $('#foundRes').addClass('hidden');
        $('#notFound').removeClass('hidden');
    }
    $('.basket').text(basket.length);


    $('.realty-type li').click(function () {
        var t = $(this);
        if (t.hasClass('act'))
        {
            return false;
        }
        t.parent().children('.act').removeClass('act');
        t.addClass('act');
        $('#realty_type').val(t.data('type'));
        $('.search-type').addClass('hide').filter('[data-type="' + t.data('type') + '"]').removeClass('hide');
    });
    
    

//    $('.select-district a').click(function(e){
//        e.preventDefault();
//        var t = $(this);
//        if(t.hasClass('act'))
//        {
//            return false;
//        }
//        t.parent().parent().find('a.act').removeClass('act');
//        t.addClass('act');
//        t.closest('.col-sm-4').children('.select-wrap').toggleClass('hide');
//    });

    $('.search-type [name="subtype[1]"]').change(function () {
        $(this).parent().next()[(this.value == 0 ? 'removeClass' : 'addClass')]('hide');
    });

    $('.submit-form a').click(function (e) {
        e.preventDefault();
        $(this).parent().children('input').val($(this).data('view'));
        $(this).closest('form').submit();
    });

    $('.property-state span').click(function () {
        var t = $(this);
        t.parent().children('input').val(t.data('c'));
        var c = t.parent().children('span').removeClass('fill');
        c.filter(function () {
            return c.index(t) >= c.index(this);
        }).addClass('fill');
    });

    var isInited = false;
    $('.select-district a').click(function (e) {
        e.preventDefault();
        var t = $(this);
        var name = t.data('name');
        if (!t.hasClass('act'))
        {
            $('.district_o, .district_m').hide().filter('.' + name).show();
            t.parent().parent().find('a.act').removeClass('act');
            t.addClass('act');
        }
        
        if(isInited) {
            $('#' + name).select2('open');
        }
        isInited = true;
    });
    $('#city').val(cityID).trigger("change");
    $('#city').change(function () {
        getDistrict($('#city').val());
    });

    if(distM == '' || distO!='') {
        $('.select-district a[data-name="district_o"]').click();
        $('.district_m').hide();
    }
    else if (distO == '') {
        $('.select-district a[data-name="district_m"]').click();
    }
    getDistrict(cityID);
});

function getDistrict(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/district?id=' + id, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            var response = $.parseJSON(xhr.responseText);
            $('#district_m').find('option').remove().end();
            $('#district_o').find('option').remove().end();
            $.each(response.district_m, function (key, value) {
                $('#district_m')
                        .append($("<option></option>")
                                .attr("value", value.id)
                                .text(value.name));
            });
            if(distM && distM.length > 0) {
                $('#district_m').val(distM).trigger('change');
            }
            $.each(response.district_o, function (key, value) {
                $('#district_o')
                        .append($("<option></option>")
                                .attr("value", value.id)
                                .text(value.name));
            });
            if(distO && distO.length > 0) {
                $('#district_o').val(distO).trigger('change');
            }
        }
    };
}


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

$('#showMore').on('click', function (e) {
    e.preventDefault();
});

$('#find').on('click', function (e) {
    e.preventDefault();
    var fso = $('#formDetailOne').serialize();
    var fs = $('#formDetail').serialize() + '&page=1';
    location.href = '/ads?' + fso + '&' + fs;
});
$('#findMap').on('click', function (e) {
    e.preventDefault();
    var fso = $('#formDetailOne').serialize();
    var fs = $('#formDetail').serialize() + '&page=1';
    location.href = '/map?' + fso + '&' + fs;
});

$('#goToItem').on('click', function(e) {
    e.preventDefault();
    var fso = $('#formDetailOne').serialize();
    var fs = $('#formDetail').serialize() + '&page=1';
    location.href = '/table?' + fso + '&' + fs;
    
}); 
$('#goToItem2').on('click', function(e) {
    e.preventDefault();
    var fso = $('#formDetailOne').serialize();
    var fs = $('#formDetail').serialize() + '&page=1';
    location.href = '/ads?' + fso + '&' + fs;
    
}); 
