$(function ($) {
    var id = parseInt(window.location.pathname.replace('/ads/', ''));
    var basket = JSON.parse(localStorage.getItem('realty-basket'));
    if (basket == null) {
        basket = [];
    }

    if (basket.indexOf(id) != -1) {
        $('#addToBasket').text('добавленно');
    }
    
    $('#showBasket').on('click', function(e) {
        e.preventDefault();
        showBasket();
    });
    
    if($('#cond').html() > 0) {
        for (var k = 0; k < $('#cond').html(); k++) {
            $($('.property-state').children('p').children('span')[k]).addClass('fill').trigger('change');
        }
    }
    
    var myMap;
    var mapWrap = $('#googleMap');
    ymaps.ready(initMap);

    function initMap(){
        var lat = mapWrap.data('lat');
        var lng = mapWrap.data('lng');
        if(!lat) {
            return;
        }
        myMap = new ymaps.Map(mapWrap[0], {
            center: [lat, lng],
            zoom: 13
        });
        
        var myPlacemark = new ymaps.Placemark([lat, lng], { 
            hintContent: ''
        });

        myMap.geoObjects.add(myPlacemark);
    }
    
    $('.print').click(function(){
        var params = "width=800,height=700,menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes";
        var w = window.open(window.location.href + '?print=Y', "Печать объявления", params);
        w.print();
        w.onfocus = function () { setTimeout(function () { w.close(); }, 500); };
    });
    
});

function addToBasket(id, e) {
    var basket = JSON.parse(localStorage.getItem('realty-basket'));
    if (basket == null) {
        basket = [];
    }
    e.preventDefault();
    if (basket.indexOf(id) == -1) {
        basket.push(id);
        localStorage.setItem('realty-basket', JSON.stringify(basket));
        $('#addToBasket').text('добавленно');
        $('.basket').text(basket.length);
    }
}

function backToList(e) {
    e.preventDefault();
    location.href = document.referrer;
}