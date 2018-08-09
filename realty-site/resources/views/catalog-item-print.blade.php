@extends('layout/default-print')

@section('meta')
<title>Объявление о Недвижимости Роcтова</title>
@stop

@section('content')
<div class="container-fluid cart-header">
    <div>
        <h1>{{$ads['name']}}</h1>
        Объявление № {{$ads['id']}}<?/* @if($ads['rent'] == 0)Продается @else Сдается @endif с <span>{{$ads['created']}}</span>*/?>
    </div>
</div>

<div class="container-fluid">
    <div class="cart-price print-view">
        <div class="price">{{$ads['price']+$comission}} <i class="fa fa-rub" aria-hidden="true"></i></div>
        @if(!empty($comission))
        <div class="takeoff">
            В цену входит комиссия агентства <b>{{$comission}}</b> Руб.
        </div>
        @endif
        <div class="area-price">
            <p>1 м<sup>2</sup> — {{intval(($ads['price']+$comission)/$ads['sq1'])}} <i class="fa fa-rub" aria-hidden="true"></i></p>
        </div>
        <div class="developer">
            <p>Застройщик</p>{{$ads['developer_name'] ?: 'не указан'}}
            <p>Жилищный комплекс</p>{{$ads['complex_name'] ?: 'не указан'}}
        </div>
    </div>

    <div class="cart-info print-view">
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
                    <tr><td>Состояние жилья</td><td><?=trans('common.conditions.' . $ads['condition']);?></td></tr>
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
@stop