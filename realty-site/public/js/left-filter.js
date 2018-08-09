$(function ($) {
    var foP1 = getUrlParameter('foP1'),
        toP1 = getUrlParameter('toP1'),
        flP1 = getUrlParameter('flP1'),
        tlP1 = getUrlParameter('tlP1'),
        fkP1 = getUrlParameter('fkP1'),
        tkP1 = getUrlParameter('tkP1'),
        priceF = getUrlParameter('priceF'),
        priceT = getUrlParameter('priceT'),
        order = getUrlParameter('orderBy'),
        rent = getUrlParameter('rent'),
        devel = getUrlParameter('devel'),
        complex = getUrlParameter('complex'),
        condition = getUrlParameter('condition'),
        subtype = getUrlParameter('subtype'),
        floorTF = getUrlParameter('floorTF'),
        floorTT = getUrlParameter('floorTT'),
        floorT = getUrlParameter('floorT'),
        floorF = getUrlParameter('floorF'),
        materialT = getUrlParameter('material'),
        type = getUrlParameter('type');
        for (var k = 1; k <= 5; k++) {
            $('#room-' + k).prop('checked', false);
            if (getUrlParameter('rooms' + k) == 'on') {
                $('#room-' + k).prop('checked', true);
                $('#room-' + k).val('on').trigger("change");
            }
        }

    checkBacket();
    
    if (order == 'condition') {
        $('#orderBy').html('По цене<img src="/img/sort-by-1.png">');
        $('#orderBy2').html('По цене<img src="/img/sort-by-1.png">');
    } else {
        $('#orderBy').html('По состоянию<img src="/img/sort-by-1.png">');
        $('#orderBy2').html('По состоянию<img src="/img/sort-by-1.png">');
    }
    
    if (rent == '1') {
        $('#secondRent').addClass('act');
        $('#rent').addClass('act');
        $('#buy').removeClass('act');
        $('#enableRent').val('1');
    }
    
    for (var i = 1; i <= 5; i++ ) {
        if (i == parseInt(type)) {
            $('#count' + i).parent().addClass('act');
        } else {
            $('#count' + i).parent().removeClass('act');
        }
    }
    $('#realty_type').val(type);
    
    $('#rent').on('click', function (e) {
        e.preventDefault();
        selectRent();
    });
    $('#buy').on('click', function (e) {
        e.preventDefault();
        selectBuy();
    });

    $('#house_type').val(subtype)
            .trigger("change");
    $('#foP1').val(foP1)
            .trigger("change");
    $('#toP1').val(toP1)
            .trigger("change");
    $('#flP1').val(flP1)
            .trigger("change");
    $('#tlP1').val(tlP1)
            .trigger("change");
    $('#fkP1').val(fkP1)
            .trigger("change");
    $('#tkP1').val(tkP1)
            .trigger("change");
    $('#priceF').val(priceF)
            .trigger("change");
    $('#priceT').val(priceT)
            .trigger("change");
    $('#devel').val(devel)
            .trigger("change");
    $('#complex').val(complex)
            .trigger("change");
    $('#condition').val(condition)
            .trigger("change");
    $('#floorTF').val(floorTF)
            .trigger("change");
    $('#floorTT').val(floorTT)
            .trigger("change");
    $('#floorT').val(floorT)
            .trigger("change");
    $('#floorF').val(floorF)
            .trigger("change");
    $('#material').val(materialT)
            .trigger("change");
    
    $('#dateFrom').datepicker({
        format: 'dd.mm.yyyy',
        language: 'ru'
    });
    $('#dateTo').datepicker({
        format: 'dd.mm.yyyy',
        language: 'ru'
    });
    
    $('#streetSearch').typeahead({
        minLength: 3,
        items: 10,
        source: function(query, syncResults, asyncResults){
            $.getJSON('/api/streets?street=' + encodeURIComponent(query), function(response){
                var streets = [];
                if(response.streets && response.streets.length > 0) {
                    for(var i in response.streets) {
                        streets.push(response.streets[i].street);
                    }
                }
                syncResults(streets);
            });
        }
    });
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

$('.realty-type li').click(function () {
    var t = $(this);
    if (t.hasClass('act'))
    {
        return false;
    }
    if (t.data('type') == '1') {
        t.parent().children('.act').removeClass('act');
        t.addClass('act');
        $('#realty_type').val(t.data('type'));
        $('.house-type').show();
        $('.rooms-inner').show();
        $('#house_type')
                .find('option')
                .remove()
                .end()
                .append('<option value="">Тип Квартиры</option>')
                .append('<option value="1">Комната</option>')
                .append('<option value="2">Гостинка</option>')
                .prop('disabled', false)
                .val('')
                .trigger("change");
    } else if (t.data('type') == '4') {
        t.parent().children('.act').removeClass('act');
        t.addClass('act');
        $('#realty_type').val(t.data('type'));
        $('.house-type').show();
        $('.rooms-inner').show();
        $('#house_type')
                .find('option')
                .remove()
                .end()
                .append('<option value="3">Офис</option>')
                .append('<option value="4">Торговая площадка</option>')
                .prop('disabled', false)
                .val('3')
                .trigger("change");
    } else if (t.data('type') == 'rent') {
        selectRent();
    } else {
        t.parent().children('.act').removeClass('act');
        t.addClass('act');
        $('#realty_type').val(t.data('type'));
        $('.rooms-inner').hide();
        $('.house-type').hide();
//                .find('option')
//                .remove()
//                .end()
//                .append('<option value=""></option>')
//                .prop('disabled', 'disabled')
//                .val('')
//                .trigger("change");
    }

    if ($('#enableRent').val() == 1) {
        $('#secondRent').addClass('act').trigger('change');
    }

    if ($('#realty_type').val() == 1 || $('#realty_type').val() == 2 || $('#realty_type').val() == 4)
    {
        $('.rooms').show();
        $('.main-form-area').show();
        $('#roomTitle').show();
    } else
    {
        $('.rooms').hide();
        $('#roomTitle').hide();
        $('.main-form-area').hide();
    }
});

function selectRent() {
    $('#rent').addClass('act').trigger('change');
    $('#buy').removeClass('act').trigger('change');
    $('#secondRent').addClass('act').trigger('change');
    $('#enableRent').val('1').trigger('change');
    var cntRent = JSON.parse(countersRent);
    for (var i = 1; i <= 5; i++) {
        $('#count' + i).text(cntRent[i] ? cntRent[i] : 0);
    }
}

function selectBuy() {
    $('#buy').addClass('act').trigger('change');
    $('#rent').removeClass('act').trigger('change');
    $('#secondRent').removeClass('act').trigger('change');
    $('#enableRent').val('0').trigger('change');
    var cntBy = JSON.parse(countersBuy);
    for (var i = 1; i <= 5; i++) {
        $('#count' + i).text(cntBy[i] ? cntBy[i] : 0);
    }
}

$('#condition').on('change', function (e) {
    for (var i = 0; i <= 6; i++) {
        $($('.property-state').children('p').children('span')[i]).removeClass('fill').trigger('change');
        if (i < $('#condition').val()) {
            $($('.property-state').children('p').children('span')[i]).addClass('fill').trigger('change');
        }
    }
});

$('#orderBy').on('click', function (e) {
    e.preventDefault();
    var fso = $('#formDetailOne').serialize();
    var fs = $('#formDetail').serialize() + '&page=1';
    if ($(this).text() == 'По цене') {
        location.href = '/ads?' + fso + '&' + fs + '&orderBy=condition';
    } else {
        location.href = '/ads?' +  fso + '&' + fs + '&orderBy=price';
    }
});
$('#orderBy2').on('click', function (e) {
    e.preventDefault();
    var fso = $('#formDetailOne').serialize();
    var fs = $('#formDetail').serialize() + '&page=1';
    if ($(this).text() == 'По цене') {
        location.href = '/table?' + fso + '&' + fs + '&orderBy=condition';
    } else {
        location.href = '/table?' +  fso + '&' + fs + '&orderBy=price';
    }
});

$('#findLeft').on('click', function (e) {
    e.preventDefault();
    var fso = $('#formDetailOne').serialize();
    var fs = $('#formDetail').serialize() + '&page=1';
    location.href = '/' + page + '?' + fso + '&' + fs;
});

$('#resetFilter').on('click', function (e) {
    e.preventDefault();
    var fso = $('#formDetailOne').serialize();
    location.href = '/' + page + '?' + fso;
});

function addToBasket (e, id) {
    e.preventDefault();
    var basket = JSON.parse(localStorage.getItem('realty-basket'));
    if (basket == null) {
        basket = [];
    }
    if (basket.indexOf(id) == -1) {
        basket.push(id);
        localStorage.setItem('realty-basket', JSON.stringify(basket));
        $('#toBask' + id).text('Добавленно');
        $('#toBaskHeart' + id).addClass('fill').trigger("change");
        $('#toBaskHeartMap' + id).addClass('fill').trigger("change");
        $('.basket').text(basket.length);
    }
}

function checkBacket () {
    var basket = JSON.parse(localStorage.getItem('realty-basket'));
    if (basket == null) {
        basket = [];
    }
    for (var s = 0; s < basket.length; s++) {
        $('#toBask' + basket[s]).text('Добавленно');
        $('#toBaskHeart' + basket[s]).addClass('fill').trigger("change");
        $('#toBaskHeartMap' + basket[s]).addClass('fill').trigger("change");
    }
}
