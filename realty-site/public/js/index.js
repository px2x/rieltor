$(function ($) {
    
    $('#rent').on('click', function(e) {
        e.preventDefault();
        selectRent();
    });
    $('#buy').on('click', function(e) {
        e.preventDefault();
        selectBuy();
    });
    
    $('.realty-type li').click(function(){
        var t = $(this);
        if(t.hasClass('act'))
        {
            return false;
        }
        if (t.data('type') == '1') {
            $('.hidden-if-not-apartment').removeClass('hidden').trigger('change');
            t.parent().children('.act').removeClass('act');
            t.addClass('act');
            $('#realty_type').val(t.data('type'));
            $('#house_type')
                .find('option')
                .remove()
                .end()
                .append('<option value="">Тип квартиры</option>')
                .append('<option value="1">Комната</option>')
                .append('<option value="2">Гостинка</option>')
                .prop('disabled', false)
                .val('')
                .trigger("change");
        } else if(t.data('type') == '4') {
            $('.hidden-if-not-apartment').addClass('hidden').trigger('change');
            t.parent().children('.act').removeClass('act');
            t.addClass('act');
            $('#realty_type').val(t.data('type'));
            $('#house_type')
                .find('option')
                .remove()
                .end()
                .append('<option value="3">Офис</option>')
                .append('<option value="4">Торговая площадка</option>')
                .prop('disabled', false)
                .val('3')
                .trigger("change");
        } else if(t.data('type') == 'rent') {
            selectRent();
        } else {
            $('.hidden-if-not-apartment').addClass('hidden').trigger('change');
            t.parent().children('.act').removeClass('act');
            t.addClass('act');
            $('#realty_type').val(t.data('type'));
            $('#house_type')
                .find('option')
                .remove()
                .end()
                .append('<option value=""></option>')
                .prop('disabled', 'disabled')
                .val('')
                .trigger("change");
        }
        
        if ($('#enableRent').val() == 1) {
            $('#secondRent').addClass('act').trigger('change');
        }
        
        if($('#realty_type').val() == 1 || $('#realty_type').val() == 2)
        {
            $('.rooms').show();
            $('.main-form-area').show();
        }
        else
        {
            $('.rooms').hide();
            $('.main-form-area').hide();
        }
    });
    
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
        
        $('#' + name).select2('open');
    });
    $('#city').val(1).trigger("change");
    $('#city').change(function () {
        getDistrict($('#city').val());
    });
    
    $('.district_m').hide();

    getDistrict(1);
    
    if($.fn.inputmask) {
	$('input[name="phone"').inputmask({"mask": "+7 (999) 999-99-99"});
    }

    $('#street').hide();
    $('.main-form').submit(function (e) {
        e.preventDefault();
        findLiveSpace();
    });
    $('#find').click(function (e) {
        e.preventDefault();
        findLiveSpace();
    });
    $('#findMap').click(function (e) {
        e.preventDefault();
        findLiveSpaceMap();
    });

    $('#prev').on("click", function(event){
        console.log('clicked');
    });

    var findLiveSpace = function () {
        var ss = $('#main-form').serialize() + '&page=1';
        location.href = '/ads?' + ss
    };
    var findLiveSpaceMap = function () {
        var ss = $('form').serialize() + '&page=1';
        location.href = '/map?' + ss
    };

    $('#clearFiltre').click(function (e) {
        e.preventDefault();
        var sel= [
            '#city',
            '#district_m',
            '#district_o',
            '#street',
            '#house_type',
            '#flP1',
            '#tlP1',
            '#fkP1',
            '#tkP1',
            '#calc'
        ], 
        sel2 = [
            '#foP1',
            '#toP1',
            '#priceF',
            '#priceT'
        ];
        for(var k in sel)
        {
            $(sel[k]).val($(sel[k] + " option:first").val()).trigger("change");
        }
        for(var o in sel2)
        {
            $(sel[o]).val("").trigger("change");
        }
        $('#rooms :checked').removeAttr('checked');
    });
    
    
    $(".owl-main").owlCarousel({
        items: 5,
        nav: true,
        navText: [],
        smartSpeed: 300,
        loop: true
    });

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
            
            $.each(response.district_m, function (key, value) {
                $('#district_m')
                        .append($("<option></option>")
                                .attr("value", value.id)
                                .text(value.name));
            });
            
            $.each(response.district_o, function (key, value) {
                $('#district_o')
                        .append($("<option></option>")
                                .attr("value", value.id)
                                .text(value.name));
            });
        }
    };
}

function getValuesForm () {
    var value = {
        city_id: $('#city').val(),
        district_m: $('#district_m').val(),
        district_o: $('#district_o').val(),
    };
}

$('#city').change(function() {
    getValuesForm()
});

function selectRent () {
    $('#rent').addClass('act').trigger('change');
    $('#buy').removeClass('act').trigger('change');
    $('#secondRent').addClass('act').trigger('change');
    $('#enableRent').val('1').trigger('change');
    var cntRent = JSON.parse(countersRent);
    for (var i = 1; i <= 5; i++ ) {
        $('#count' + i).text(cntRent[i] ? cntRent[i] : 0);
    }
}

function selectBuy() {
    $('#buy').addClass('act').trigger('change');
    $('#rent').removeClass('act').trigger('change');
    $('#secondRent').removeClass('act').trigger('change');
    $('#enableRent').val('0').trigger('change');
    var cntBy = JSON.parse(countersBuy);
    for (var i = 1; i <= 5; i++ ) {
        $('#count' + i).text(cntBy[i] ? cntBy[i] : 0);
    }
}

$('#condition').on('change', function (e) {
    for (var i = 0; i < 6; i++) {
        $($('.property-state').children('p').children('span')[i]).removeClass('fill').trigger('change');
        if (i < $('#condition').val()) {
            $($('.property-state').children('p').children('span')[i]).addClass('fill').trigger('change');
        }
    }
});

$('.property-state span').click(function () {
    var t = $(this);
    t.parent().children('input').val(t.data('c'));
    var c = t.parent().children('span').removeClass('fill');
    c.filter(function () {
        return c.index(t) >= c.index(this);
    }).addClass('fill');
});

$('#addAds').click(function (e) {
    e.preventDefault();
    $('#addAdsModal').modal('show'); 
});

$('#basketForm').submit(function(e){
    e.preventDefault();
    
    var request = $.ajax({
        url: 'addNewAds',
        type: 'POST',
        data: $(this).serialize(),
        dataType: 'json'
    });

    request.done(function(msg) {
        alert(msg.message);
        if(msg.status) {
            $('#addAdsModal').modal('hide'); 
        }
    });

    request.fail(function(jqXHR, textStatus) {
        alert('Ошибка на сервере. Обратитесь к администратору');
        console.log( "Request failed: " + textStatus );
    });
});