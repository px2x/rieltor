@extends('layout/default')

@section('meta')
<title>Объявление о Недвижимости Роcтова</title>
@stop

@section('script')
<script src="/js/catalog-item.js"></script>
@stop

@section('content')
<div class="realty-type cart">
    <div class="container-fluid">
        <ul>
            <li class="act" data-type="1">
                <span id="count1"><?php echo isset($counters[1]) ? $counters[1] : 0; ?></span>
                <img src="/img/realty-type-1.png">
                <p>Квартиры</p>
            </li>
            <li data-type="2">
                <span id="count2"><?php echo isset($counters[2]) ? $counters[2] : 0; ?></span>
                <img src="/img/realty-type-2.png">
                <p>Дома</p>
            </li>
            <?/*<li data-type="3">
                <span id="count3"><?php echo isset($counters[3]) ? $counters[3] : 0; ?></span>
                <img src="/img/realty-type-3.png">
                <p>Участки</p>
            </li>*/?>
            <li data-type="4">
                <span id="count4"><?php echo isset($counters[5]) ? $counters[5] : 0; ?></span>
                <img src="/img/realty-type-4.png">
                <p>Коммерческая недвижимость</p>
            </li>
            <?/*<li data-type="5">
                <span id="count5"><?php echo isset($counters[4]) ? $counters[4] : 0; ?></span>
                <img src="/img/realty-type-5.png">
                <p>Гаражи</p>
            </li>*/?>
            <li data-type="rent" id="secondRent">
                <span><?php echo isset($counters['rent']) ? $counters['rent'] : 0; ?></span>
                <img src="/img/realty-type-6.png">
                <p>Аренда</p>
            </li>
        </ul>
    </div>
</div>	

<div class="container-fluid cart-header">
    <div class="pull-right">
        <a href="#" onclick="backToList(event)">Вернуться к списку</a>
        <a href="#" id="showBasket"><img src="/img/cart-header-order.png">Показать корзину</a>
    </div>
    <div>
        <h1>{{$ads['name']}}</h1>
        № {{$ads['id']}} <?/* @if($ads['rent'] == 0)Продается @else Сдается @endif с <span>{{$ads['created']}}</span>*/?>
    </div>
</div>

<div class="container-fluid">
    <div class="cart-img">
        @if(!$photos->isEmpty())
        <div id="cart-inner-slider" class="sliderkit">
            <div class="sliderkit-panels">   
                @foreach($photos as $photo)
                <div class="sliderkit-panel">
                    <a href="{{$photo->buildUrl()}}" class="fancy"><img src="{{$photo->buildUrl()}}" class="img-responsive"></a>
                </div>
                @endforeach
                <i class="fa fa-search-plus" aria-hidden="true"></i>
            </div> 
            <div class="sliderkit-nav">
                <div class="sliderkit-nav-clip">
                    <ul>
                        @foreach($photos as $photo)
                        <li><a href="#" rel="nofollow"><img class="img-item" src="{{$photo->buildUrl('th')}}" class="img-responsive"></a></li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
        @else
        <img src="/img/no-photo.png" title="Нет фотографии" class="img-responsive">
        @endif
        @if(!empty($ads['condition']))
        <div class="property-state">
            Состояние жилья: <br>
            <?=trans('common.conditions.' . $ads['condition']);?>
            <p>
                <?for($i=1;$i<=5;$i++):?>
                <span<?if($ads['condition'] >= $i):?> class="fill"<?endif;?>></span>
                <?endfor;?>
            </p>
        </div>
        @endif
    </div>

    <div class="cart-price">
        <div class="price">{{$ads['price']+$comission}} <i class="fa fa-rub" aria-hidden="true"></i></div>
        @if(!empty($comission))
        <div class="takeoff">
            <i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="top" title=""></i>
            В цену входит комиссия агентства <b>{{$comission}}</b> Руб.
        </div>
        @endif
        <div class="area-price">
            <p>1 м<sup>2</sup> — {{intval(($ads['price']+$comission)/$ads['sq1'])}} <i class="fa fa-rub" aria-hidden="true"></i></p>
            <img src="/img/area-price.png"><span>Выгодное предложение</span>
        </div>
        <a href="#" onclick="addToBasket({{$ads['id']}}, event)" class="orange-btn" id="addToBasket">добавить</a>
        <div class="developer">
            <p>Застройщик</p>{{$ads['developer_name'] ?: 'не указан'}}
            <p>Жилищный комплекс</p>{{$ads['complex_name'] ?: 'не указан'}}
        </div>
        <div class="print">
            <img src="/img/cart-price-print.png">
            <p>Отправить на печать</p>
        </div>
    </div>

    <div class="cart-info">
        <h3>{{$ads['address']}}</h3>
        <div class="adr">
            <div>Район (муниципальный)</div>
            <div>{{!empty($ads['district_m']) ? $ads['district_m'] : 'не указан'}}</div>
        </div>
        <div class="adr">
            <div>Район (общепринятый)</div>
            <div>{{!empty($ads['district_o']) ? $ads['district_o'] : 'не указан'}}</div>
        </div>
        <div class="house">
            <div>
                <h4>Данные помещения:</h4>
                <table>
                    <tr><td>Комнат</td><td>{{$ads['rooms'] . ($ads['rooms']==5?'+':'')}}</td></tr>
                    <tr><td>Общая площадь</td><td>{{$ads['sq1']}}</td></tr>
                    <tr><td>Жилая площадь</td><td>{{$ads['sq2']}}</td></tr>
                    <tr><td>Площадь кухни</td><td>{{$ads['sq3']}}</td></tr>
                </table>	
                <h4>Данные дома:</h4>
                <table>
                    <tr><td>Тип жилья</td><td>{{$ads['type_name']}}</td></tr>
                    <tr><td>Материал</td><td>{{!empty($ads['material']) ? $ads['material'] : 'не указан'}}</td></tr>
                    <tr><td>Год постройки</td><td>{{!empty($ads['year']) ? $ads['year'] : 'не указан'}}</td></tr>
                    <tr><td>Этажей в доме</td><td>{{$ads['floor_t']}}</td></tr>
                    <tr><td>Этаж</td><td>{{$ads['floor']}}</td></tr>
                </table>				
            </div>
            <div>
                <h4>Описание:</h4>
                <p class="text-2">
                    {{$ads['description']}}
                </p>
            </div>
        </div>
    </div>		
</div>
<div class="container-fluid cart-map">
    <?if(!empty($object)):?>
        <?$photos = $object->photos()->get();?>
        <?if(!$photos->isEmpty()):?>
        <p>Фото объекта</p>
        <div id="cart-outer-slider" class="sliderkit">
            <div class="sliderkit-panels">
                <?foreach($photos as $photo):?>
                <div class="sliderkit-panel">
                    <a href="<?=$photo->buildUrl();?>" class="fancy"><img src="<?=$photo->buildUrl();?>" class="img-responsive"></a>
                </div>
                <?endforeach;?>
            </div>
            <div class="sliderkit-nav">
                <div class="sliderkit-nav-clip">
                    <ul>
                        <?foreach($photos as $photo):?>
                        <li><a href="#" rel="nofollow"><img src="<?=$photo->buildUrl('th');?>" class="img-responsive"></a></li>
                        <?endforeach;?>
                    </ul>
                </div>
            </div>
        </div>
        <?endif;?>
    <?endif;?>
    <div<?if(empty($object) || $photos->isEmpty()):?> class="no-photos-map"<?endif;?>>
        <div class="catalog-map-item">
            <div id="googleMap" data-lat="<?=!empty($ads['lat']) ? $ads['lat'] : $object->lat;?>" data-lng="<?=!empty($ads['lng']) ? $ads['lng'] : $object->lng;?>"></div>
        </div>
    </div>	
</div>
@stop