@extends('layout/default')

@section('meta')
<title>Недвижимость Ростова</title>
<link rel="stylesheet" href="/css/owl.carousel.min.css">
@stop

@section('script')
<script src="/js/inputmask.min.js"></script>
<script src="/js/jquery.inputmask.min.js"></script>
<script src="/js/owl.carousel.min.js"></script>
<script src="/js/index.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script>
    var countersBuy = '<?php echo json_encode($counters); ?>';
    var countersRent = '<?php echo json_encode($counters_rent); ?>';
</script>
@stop

@section('content')
<div class="main-banner main">
    <div></div>
</div>

<div class="container-fluid top-header main">
    <p>Актуальная база объектов <br> недвижимости г. Ростова-на-Дону</p>
</div>
<?php
    function buildImagePath(&$ad) {
        $path = base_path() . '/public/uploads/';
        if(file_exists($path . 'ads/' . $ad['id'].'_th.jpg')) {
            return '/uploads/ads/' . $ad['id'] . '_th.jpg';
        } elseif(!empty($ad['object_id']) && file_exists($path.'objects/' . $ad['object_id'] . '_th.jpg')) {
            return 'uploads/objects/' . $ad['object_id'] . '_th.jpg';
        } else {
            return '/img/no-photo-th.png';
        }
    }
?>

<form class="main-form" id="main-form" action="/ads" method="get">
    <div class="container-fluid top-buttons">
        <a href="#" id="buy" class="act">Купить</a><a href="#" id="rent">арендовать</a>
        <a href="#" id="addAds">ДОБАВИТЬ</a>
    </div>

    <div>
        @include('filter')

        <div class="container-fluid">
            <div class="house-type">
                <label class="select-name" for="house_type">Выбор типа жилья</label>
                <select name="subtype" id="house_type">
                    <option value="">Выбор типа жилья</option>
                    <option value="0">Квартира</option>
                    <option value="1">Комната</option>
                    <option value="2">Гостинка</option>
                </select>

                <div class="rooms" name="rooms" id="rooms">
                    <label class="select-name" for="usr">Комнат</label>
                    <div class="rooms--list">
                        <input type="checkbox" name="rooms1" id="room-1">
                        <label for="room-1">1 <span></span></label>
                        <input type="checkbox" name="rooms2" id="room-2">
                        <label for="room-2">2 <span></span></label>
                        <input type="checkbox" name="rooms3" id="room-3">
                        <label for="room-3">3 <span></span></label>
                        <input type="checkbox" name="rooms4" id="room-4">
                        <label for="room-4">4 <span></span></label>
                        <input type="checkbox" name="rooms5" id="room-5">
                        <label for="room-5">5+ <span></span></label>
                    </div>
                </div>
            </div>

            <div class="main-form-area">
                <div class="hidden-if-not-apartment">
                    <div>
                        <label class="select-name" for="floorTF">Этажность дома</label>
                        <div class="form-group">
                            <input type="number" name="floorTF" id="floorTF" type="text" class="form-control" list="floorTF-list">
                            <datalist id="floorTF-list">
                                @for($i = 1; $i <= 20; $i++)
                                    <option>{{$i}}</option>
                                @endfor
                            </datalist>
                        </div>
                        <div class="form-group">
                            <input type="number" name="floorTT" id="floorTT" type="text" class="form-control" list="floorTT-list">
                            <datalist id="floorTT-list">
                                @for($i = 1; $i <= 20; $i++)
                                    <option>{{$i}}</option>
                                @endfor
                            </datalist>
                        </div>
                    </div>
                </div>
                <div class="hidden-if-not-apartment">
                    <div>
                        <label class="select-name" for="usr">Этаж</label>
                        <div class="form-group">
                            <input type="number" name="floorF" id="floorF" type="text" class="form-control" list="floorF-list">
                            <datalist id="floorF-list">
                                @for($i = 1; $i <= 20; $i++)
                                    <option>{{$i}}</option>
                                @endfor
                            </datalist>
                        </div>
                        <div class="form-group">
                            <input type="number" name="floorT" id="floorT" class="form-control" list="floorT-list">
                            <datalist id="floorT-list">
                                @for($i = 1; $i <= 20; $i++)
                                    <option>{{$i}}</option>
                                @endfor
                            </datalist>
                        </div>
                    </div>
                </div>
                <div class="hidden-if-not-apartment">
                    <div>
                        <div class="form-group width-100">
                            <label class="select-name" for="usr">Материал дома</label>
                            <select name="material" id="material">
                            <option value="">Любой</option>
                            <option value="1">Кирпич</option>
                            <option value="2">Панель</option>
                        </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="main-form-floor hidden-if-not-apartment">
                <div class="row">
                    <div class="col-xs-6 padding-right-0">
                        <label class="select-name">Площадь&nbsp;<b> м<sup>2</sup></b></label>
                        <div class="form-group">
                            <input type="number" name="foP1" id="foP1" type="text" class="form-control" list="foP1-list">
                            <datalist id="foP1-list">
                                @for ($i = 10; $i <= 100; $i+=10)
                                    <option>{{$i}}</option>
                                @endfor
                            </datalist>
                        </div>
                        <div class="form-group">
                            <input type="number" name="toP1" id="toP1" class="form-control" list="toP1-list">
                            <datalist id="toP1-list">
                                @for ($i = 10; $i <= 100; $i+=10)
                                    <option>{{$i}}</option>
                                @endfor
                            </datalist>
                        </div>
                    </div>
                    <div class="col-xs-6">
                        <label class="select-name">Цена&nbsp;<b>Руб</b></label>
                        <div class="form-group">
                            <input type="number" name="priceF" id="priceF" type="text" class="form-control" list="priceF-list">
                            <datalist id="priceF-list">
                                @for($i = 500000; $i<=10000000; $i+=500000)
                                    <option value="{{$i - 100000}}">{{$i}}</option>
                                @endfor
                            </datalist>

                        </div>
                        <div class="form-group">
                            <input type="number" name="priceT" id="priceT" type="text" class="form-control" list="priceT-list">
                            <datalist id="priceT-list">
                                @for($i = 500000; $i<=10000000; $i+=500000)
                                    <option>{{$i}}</option>
                                @endfor
                            </datalist>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid bottom-buttons">
            <a href="#" id="find">найти</a>
            <a href="#" id="findMap"><img src="/img/ico-bottom-buttons.png">на карте</a>
        </div>
    </div>
</form>

<div class="container-fluid main-img">
    <div class="row">
        <div class="col-sm-4">
            <p><img src="/img/main-img-1.png"></p>
            Самая актуальная и чистая база, без агентств, только владельцы недвижимости
        </div>
        <div class="col-sm-4">
            <p><img src="/img/main-img-2.png"></p>
            Возможность заказать бесплатный просмотр любого количества объектов
        </div>
        <div class="col-sm-4">
            <p><img src="/img/main-img-3.png"></p>
            Удобный подбор недвижимости по карте
        </div>
    </div>
</div>
@if(!empty($ads))
<div class="container-fluid">
    <div class="owl-main owl-carousel">
        @foreach($ads as $res)
        <div class="item">
            <div>
                <a href="/ads/{{$res['id']}}"><img class="catalog-img" src="<?=buildImagePath($res);?>" onerror="this.src='/img/no-photo-th.png'"></a>
                <div class="text-center">
                    №{{$res['id']}}
                    <a href="/ads/{{$res['id']}}"><p>{{$res['name']}}</p></a>
                    {{$res['address']}}
                    <div class="price">
                        <strong>{{$res['price']}}</strong>
                        <i class="fa fa-rub" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
        </div>
        @endforeach
    </div>
</div>
@endif
@include('ads-add-form')


<!--<div class="container-fluid">
    <h1>Компания</h1>
    <p class="text-1"></p>
    <p class="text-1"></p>
    <h2>текст</h2>
    <p class="text-2">Объявление о продаже квартиры должно привлекать внимание, вызывать доверие к вам как продавцу и заранее отвечать на большинство вопросов покупателя. Директор по маркетингу MyHomeDay.com Алексей Помыканов рассказывает, как составить идеальное «продающее» объявление для сайта недвижимости и каких ошибок следует избегать.</p>
    <p class="text-2">Чаще всего первое впечатление об объекте складывается именно из фотографий, поэтому мы убеждены, что тут стоит постараться.</p>
</div>
<div class="container-fluid main-images">
    <div class="row">
        <div class="col-sm-3 col-xs-6">
            <img src="/img/mai-images-1.jpg" class="img-responsive">
        </div>
        <div class="col-sm-3 col-xs-6">
            <img src="/img/mai-images-1.jpg" class="img-responsive">
        </div>
        <div class="col-sm-3 col-xs-6">
            <img src="/img/mai-images-1.jpg" class="img-responsive">
        </div>
        <div class="col-sm-3 col-xs-6">
            <img src="/img/mai-images-1.jpg" class="img-responsive">
        </div>
    </div>
</div>-->
@stop