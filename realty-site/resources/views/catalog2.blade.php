@extends('layout/default')

@section('meta')
<title>Объявления о Недвижимости Роcтова - {{$title}}</title>
<link rel="stylesheet" href="/css/bootstrap-datepicker.min.css">
@stop

@section('script')
<script>
    var distM = JSON.parse('<?php echo json_encode($districts_m) ?>');
    var distO = JSON.parse('<?php echo json_encode($districts_o) ?>');
    var cityID = "{{$city_id}}";
    var total = "{{$total}}";
    var countersBuy = '<?php echo json_encode($counters); ?>';
    var countersRent = '<?php echo json_encode($counters_rent); ?>';
    var page = 'table';
</script>
<script src="/js/catalog-list.js"></script>
<script src="/js/next-prev.js"></script>
<script src="/js/bootstrap-datepicker.min.js"></script>
<script src="/js/bootstrap-datepicker.ru.min.js"></script>
<script src="/js/typeahead.js"></script>
<script src="/js/left-filter.js"></script>
@stop

@section('content')
<div class="main-form-wrap">
    <form class="main-form" id="formDetailOne">
        <div class="container-fluid top-buttons">
            <a href="#" id="buy" class="act">Купить</a><a id="rent" href="#">арендовать</a>
            <!--<a href="#">ДОБАВИТЬ</a>-->
        </div>

        <div>
            @include('filter')
            <div class="container-fluid">
                <div class="search-type" data-type="1">
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
                </div>
                <div class="bottom-buttons">
                    <a href="#" id='find'>найти</a>
                    <a href="#" id='findMap'><img src="/img/ico-bottom-buttons.png">на карте</a>
                </div>				
            </div>
        </div>
    </form>
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
    function makeCountLang($count) {
        $langItems = array('объявление', 'объявления', 'объявлений');
        $cases = [2,0,1,1,1,2];
        return $count . ' ' . $langItems[$count % 100 > 5 && $count % 100 <= 20 ? 2 : $cases[min(array($count % 10, 5))]];
    }
?>

<div class="container-fluid">
    <h1 id="head">{{$title}}</h1>
    @include('left-filter')
    
    @if(empty($search))
    <div class="catalog-list hidden" id='notFound'>
        <h3>По Вашему запросу ничего не найдено</h3>
    </div>
    @else
    <div class="catalog-list hidden" id='foundRes'>
        <h4 class="pull-left">По Вашему запросу найдено {{makeCountLang($total)}}</h4>
        <div class="catalog-sort">
            <div class="sort-by">
                <a href="#" id="goToItem2">Список<img src="/img/sort-by-1.png"></a>
                <a href="#" id="orderBy2">По цене<img src="/img/sort-by-1.png"></a>
            </div>				
        </div>

        @foreach($search as $res)
        <div class="map-item" style="width: 620px">
            <div class="right-ico"><a onclick="addToBasket(event, {{$res['id']}})" href=""><span id="toBaskHeart{{$res['id']}}" class="heart"></span></a></div>
            <figure class="flag">
                <a href="/ads/{{$res['id']}}"><img class="map-img" src="<?=buildImagePath($res);?>" onerror="this.src='/img/no-photo-th.png'"></a>
            </figure>
            <h5><a href="/ads/{{$res['id']}}">{{$res['name']}}</a></h5>
            {{$res['address']}}
            <div>
                <div class="stars" id='stars{{$res['id']}}'>
                    <span class='{{$res['condition'] >= 1 ? 'fill' : ''}}'></span>
                    <span class='{{$res['condition'] >= 2 ? 'fill' : ''}}'></span>
                    <span class='{{$res['condition'] >= 3 ? 'fill' : ''}}'></span>
                    <span class='{{$res['condition'] >= 4 ? 'fill' : ''}}'></span>
                    <span class='{{$res['condition'] >= 5 ? 'fill' : ''}}'></span>
                </div>
                <div class="price">{{$res['price']}}<i class="fa fa-rub" aria-hidden="true"></i></div>
            </div>
        </div>
        @endforeach
        <div class="catalog-sort">
            @include('next-prev')
        </div>
    </div>
    @endif
</div>

@stop