$(function ($) {
    var basket = JSON.parse(localStorage.getItem('realty-basket'));
    if (basket == null) {
        basket = [];
    }
    $('.basket').text(basket.length);
    initMap();
//    console.log(JSON.parse(catalog));
    
    if (total != '0') {
        $('#foundRes').removeClass('hidden');
        $('#notFound').addClass('hidden');
    } else {
        $('#foundRes').addClass('hidden');
        $('#notFound').removeClass('hidden');
    }
    
    var foP1 = getUrlParameter('foP1'),
        toP1 = getUrlParameter('toP1'),
        flP1 = getUrlParameter('flP1'),
        tlP1 = getUrlParameter('tlP1'),
        fkP1 = getUrlParameter('fkP1'),
        tkP1 = getUrlParameter('tkP1'),
        priceF = getUrlParameter('priceF'),
        priceT = getUrlParameter('priceT');
        
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
    
    
    
    $('.realty-type li').click(function(){
        var t = $(this);
        if(t.hasClass('act'))
        {
            return false;
        }
        t.parent().children('.act').removeClass('act');
        t.addClass('act');
        $('#realty_type').val(t.data('type'));
    });
    
    $('.search-type [name="subtype[1]"]').change(function(){
        $(this).parent().next()[(this.value==0 ? 'removeClass' : 'addClass')]('hide');
    });
    
    $('.submit-form a').click(function(e){
        e.preventDefault();
        $(this).parent().children('input').val($(this).data('view'));
        $(this).closest('form').submit();
    });
    
    $('.property-state span').click(function(){
        var t = $(this);
        t.parent().children('input').val(t.data('c'));
        var c = t.parent().children('span').removeClass('fill');
        c.filter(function(){
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
    xhr.open('GET', '/district?id='+id, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            var response = $.parseJSON(xhr.responseText);
            $('#district_m').find('option').remove().end();
            $('#district_o').find('option').remove().end();
            $.each(response.district_m, function(key, value) {   
                $('#district_m')
                    .append($("<option></option>")
                               .attr("value",value.id)
                               .text(value.name)); 
             });
            $('#district_m').val(distM);
            $.each(response.district_o, function(key, value) {   
                $('#district_o')
                    .append($("<option></option>")
                               .attr("value",value.id)
                               .text(value.name)); 
             });
            $('#district_o').val(distO);
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

function initMap() {
    var locations = JSON.parse(catalog);
    
    ymaps.ready(initMap);
    var myMap;

    function initMap(){     
        myMap = new ymaps.Map("googleMap", {
            center: [47.211094, 39.647095],
            zoom: 11
        });
        var marker, i

        for (i = 0; i < locations.length; i++)
        {
            if (locations[i].lat && locations[i].lng) {
                var lat = locations[i].lat;
                var long = locations[i].lng;
                setMapInfoBox(lat, long, locations[i], myMap)
            } else {
                getCoordinate('г. Ростов-на-Дону', locations[i].address, locations[i], myMap)
            }
        }
    }
}

function setMapInfoBox (lat, long, build, map) {

        var content = 
            '<div class="map-item" style="border: none;">'
                + '<div class="right-ico"><a onclick="addToBasket(event,  '+ build.id +')" href=""><span id="toBaskHeartMap' + build.id +'" class="heart"></span></a></div>'
                + '<figure>'
                    + '<a href="/ads/' + build.id + '"><img class="map-img" src="/uploads/ads/' + build.id + '_th.jpg" onerror="this.src=\'/img/no-photo.png\'"></a>'
                + '</figure>'
                + '<h5><a href="/ads/' + build.id + '">' + build.name + '</a></h5>'
                + build.address
                + '<div>'
                    + '<div class="stars">'
                        + '<span ' + (build.condition >= 1 ? 'class="fill"' : '') + '></span>'
                        + '<span ' + (build.condition >= 2 ? 'class="fill"' : '') + '></span>'
                        + '<span ' + (build.condition >= 3 ? 'class="fill"' : '') + '></span>'
                        + '<span ' + (build.condition >= 4 ? 'class="fill"' : '') + '></span>'
                        + '<span ' + (build.condition >= 5 ? 'class="fill"' : '') + '></span>'
                        + '<span ' + (build.condition >= 6 ? 'class="fill"' : '') + '></span>'
                    + '</div>'
                    + '<div class="price">' + build.price + '<i class="fa fa-rub" aria-hidden="true"></i></div>'
                + '</div>'
            + '</div>';
        var myPlacemark = new ymaps.Placemark([lat, long], { 
            hintContent: build.name, 
            balloonContent: content
        });

        map.geoObjects.add(myPlacemark);

}

function getCoordinate (city, address, build, map){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://maps.google.com/maps/api/geocode/json?address=' + encodeURIComponent(city + ' ' + address), true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            var response = $.parseJSON(xhr.responseText);
            if(response.status == 'OK') {
                setMapInfoBox(response.results[0].geometry.location.lat, response.results[0].geometry.location.lng, build, map)
            }
        }
    };
}

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