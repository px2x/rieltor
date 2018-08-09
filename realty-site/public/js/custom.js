$(function ($) {
    var basket = JSON.parse(localStorage.getItem('realty-basket'));
    if (basket == null) {
        basket = [];
    }
    $('.basket').text(basket.length);
    
    $('.basketHead').on('click', function(e) {
        e.preventDefault();
        showBasket();
    });
    
    $(".main-form select:not([multiple]), .form-left select").select2();
    $(".main-form select[multiple]").select2({
        closeOnSelect: false
    });

    $('.fancy').fancybox();

    $("#cart-inner-slider").sliderkit({
        mousewheel: true,
        shownavitems: 20,
        auto: false,
        circular: true,
        navscrollatend: true,
        counter: false
    });

    $("#cart-outer-slider").sliderkit({
        mousewheel: true,
        shownavitems: 20,
        auto: false,
        circular: true,
        navscrollatend: true,
        counter: false,
        verticalnav: true
    });

    $('[data-toggle="tooltip"]').tooltip();

    $('.catalog-nav span').click(function () {
        $.scrollTo('.catalog-list table', 500);
    });

    $('.hide-filter').click(function () {
        $('.form-left').slideToggle(400);
    });
    
    $('#sendOrderForm').submit(function(e){
        e.preventDefault();
        sendOrder();
    });
});

function showBasket () {
    var basket = JSON.parse(localStorage.getItem('realty-basket'));
    if (basket == null) {
        basket = [];
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/basket', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ads: basket}));
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            var response = $.parseJSON(xhr.responseText);
            if (response.status) {
                var resultPrice = 0;
                $('#basketTable').empty();
                for (var key in response.data) {
                    resultPrice = resultPrice + response.data[key].price;
                    $('#basketTable').append('<tr id="' + response.data[key].id + '">'
                        + '<td>'
                            + '<div>'
                                 + '<a href="/ads/' + response.data[key].id + '"><p>' + response.data[key].name + '</p></a>'
                            + '</div>'
                        + '</td>'
                        + '<td>'
                            + response.data[key].price
                        + '</td>'
                        + '<td class="ta-center">'
                            +'<ul class="pagination" style="margin: 0 !important;">'
                                + '<li class="paginate_button">'
                                    + '<a href="#" class="td-none" onclick="deleteFromBasket(' + response.data[key].id + ',' + + response.data[key].price + ')"><i class="fa fa-trash-o fs-24px" aria-hidden="true"></i></a>'
                                + '</li>'
                            + '</ul>'
                        + '</td>'
                    + '</tr>');
                }
                $('#resultPrice').html('<p>' + resultPrice + '<i class="fa fa-rub" aria-hidden="true"></i></p>');
                
            }
        }
    };
    
    $('#basketModal').modal('show'); 
}

function deleteFromBasket (id, price) {
    var basket = JSON.parse(localStorage.getItem('realty-basket'));
    var index = basket.indexOf(id);
    basket.splice(index,1);
    localStorage.setItem('realty-basket', JSON.stringify(basket));
    $('.basket').text(basket.length);
    $('#' + id).remove();
    $('#toBask' + id).text('Добавить в избранное');
    $('#toBaskHeart' + id).removeClass('fill').trigger("change");
    $('#toBaskHeartMap' + id).removeClass('fill').trigger("change");
    var resultPrice = $('#resultPrice').text();
    $('#resultPrice').text(parseInt(resultPrice) - parseInt(price));
}

function sendOrder () {
    
    var username = $('#username').val();
    var phone = $('#phone').val();
    var comment = $('#comment').val();
    var basket = JSON.parse(localStorage.getItem('realty-basket'));
    if (username == '' || phone == '' || basket == null || basket.length == 0) {
        $('#basketModal').modal('hide');
        $('#emptyModal').modal('show');
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/sendOrder', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({
            user: {
                username: username,
                comment: comment,
                phone: phone
            },
            basket: basket
        }));
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200)
            {
                var response = $.parseJSON(xhr.responseText);
                if (response.status) {
                    localStorage.setItem('realty-basket', JSON.stringify([]));
                    $('.basket').text('0');
                    $('#basketModal').modal('hide');
                    $('#successModal').modal('show');
                }
            }
        };
    }
}

$('#phone').keyup(function () {
    checkRequired();
});
$('#phone-add').keyup(function () {
    checkRequired();
});
$('#username').keyup(function () {
    checkRequired();
});

function checkRequired () {
    var username = $('#username').val(),
        phone = $('#phone').val(),
        re = /^[\+0-9][0-9]*$/;

    if (phone && !phone.match(re)) {
        $('#phone').val(phone.slice(0, -1));
    }
    if (phone.length >= 9 && username.length >= 3) {
        $('#basketButton').removeClass('disabled')
    } else {
        $('#basketButton').addClass('disabled')
    }
    
}