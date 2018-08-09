@extends('layout/default')

@section('meta')
<title>Корзина</title>
@stop

@section('content')
<div class="realty-type cart">
    <div class="container-fluid">
        <ul>
            <li class="act">
                <span>456</span>
                <img src="/img/realty-type-1.png">
                <p>Квартиры</p>
            </li>
            <li>
                <span>1234</span>
                <img src="/img/realty-type-2.png">
                <p>Дома</p>
            </li>
            <li>
                <span>456</span>
                <img src="/img/realty-type-3.png">
                <p>Участки</p>
            </li>
            <li>
                <span>456</span>
                <img src="/img/realty-type-4.png">
                <p>Коммерческая недвижимость</p>
            </li>
            <li>
                <span>456</span>
                <img src="/img/realty-type-5.png">
                <p>Гаражи</p>
            </li>
            <li>
                <span>456</span>
                <img src="/img/realty-type-6.png">
                <p>Аренда</p>
            </li>
        </ul>
    </div>
</div>	

<div class="container-fluid cart-header">
    <div class="pull-right">
        <a href="#">Вернуться к списку</a>
        <a href="#"><img src="/img/cart-header-order.png">Показать корзину</a>
    </div>
    <div>
        <h1>Название просмотра объявления</h1>
        <a href="#">№ 12346767</a> Продается с <span>30.12.2015</span>
    </div>
</div>

<div class="container-fluid">
    <div class="cart-img">
        <div id="cart-inner-slider" class="sliderkit">
            <div class="sliderkit-panels">    
                <div class="sliderkit-panel">
                    <a href="img/cart-img-1.jpg" class="fancy"><img src="/img/cart-img-1.jpg" class="img-responsive"></a>
                </div>
                <div class="sliderkit-panel">
                    <a href="img/cart-img-2.jpg" class="fancy"><img src="/img/cart-img-2.jpg" class="img-responsive"></a>
                </div>
                <div class="sliderkit-panel">
                    <a href="img/cart-img-1.jpg" class="fancy"><img src="/img/cart-img-1.jpg" class="img-responsive"></a>
                </div>
                <div class="sliderkit-panel">
                    <a href="img/cart-img-2.jpg" class="fancy"><img src="/img/cart-img-2.jpg" class="img-responsive"></a>
                </div>
                <div class="sliderkit-panel">
                    <a href="img/cart-img-1.jpg" class="fancy"><img src="/img/cart-img-1.jpg" class="img-responsive"></a>
                </div>
                <i class="fa fa-search-plus" aria-hidden="true"></i>
            </div>  
            <div class="sliderkit-nav">
                <div class="sliderkit-nav-clip">
                    <ul>
                        <li><a href="#" rel="nofollow"><img src="/img/cart-img-nav-1.jpg" class="img-responsive"></a></li>
                        <li><a href="#" rel="nofollow"><img src="/img/cart-img-nav-1.jpg" class="img-responsive"></a></li>
                        <li><a href="#" rel="nofollow"><img src="/img/cart-img-nav-1.jpg" class="img-responsive"></a></li>
                        <li><a href="#" rel="nofollow"><img src="/img/cart-img-nav-1.jpg" class="img-responsive"></a></li>
                        <li><a href="#" rel="nofollow"><img src="/img/cart-img-nav-1.jpg" class="img-responsive"></a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="property-state">
            Состояние жилья: <span>3.2</span>
            <p>
                <span class="fill"></span>
                <span class="fill"></span>
                <span class="fill"></span>
                <span></span>
                <span></span>
                <span></span>
            </p>
        </div>			
    </div>

    <div class="cart-price">
        <div class="price">20 000 000 <i class="fa fa-rub" aria-hidden="true"></i></div>
        <div class="takeoff">
            <i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Какой-то текст"></i>
            В цену входит комиссия агентства <b>50 000</b> Руб.
        </div>
        <div class="area-price">
            <p>1 м<sup>2</sup> — 69 440 <i class="fa fa-rub" aria-hidden="true"></i></p>
            <img src="/img/area-price.png"><span>Выгодное предложение</span>
        </div>
        <a href="#" class="orange-btn">добавить</a>
        <div class="developer">
            <p>Застройщик</p>СО «Мирный»
            <p>Жилищный комплекс</p>ж/к «Северный»
        </div>
        <div class="print">
            <img src="/img/cart-price-print.png">
            <p>Отправить на печать</p>
        </div>
    </div>

    <div class="cart-info">
        <h3>Первомайский, ул. Шеболдаева. дом 24</h3>
        <div class="adr">
            <div>Район (муниципальный)</div>
            <div>Первомайский</div>
        </div>
        <div class="adr">
            <div>Район (общепринятый)</div>
            <div>Первомайский</div>
        </div>
        <div class="adr">
            <div>Телефон администратора</div>
            <div><b>+7 456 567-67-67</b></div>
        </div>
        <div class="house">
            <div>
                <h4>Данные квартиры:</h4>
                <table>
                    <tr><td>Комнат</td><td>3</td></tr>
                    <tr><td>Общая площадь</td><td>84</td></tr>
                    <tr><td>Жилая площадь</td><td>35</td></tr>
                    <tr><td>Площадь кухни</td><td>23</td></tr>
                </table>	
                <h4>Данные дома:</h4>
                <table>
                    <tr><td>Тип жилья</td><td>новостройка</td></tr>
                    <tr><td>Материал</td><td>панель</td></tr>
                    <tr><td>Этажей в доме</td><td>35</td></tr>
                    <tr><td>Этаж</td><td>23</td></tr>
                    <tr><td>Подъездов</td><td>4</td></tr>
                    <tr><td>Кол-во лифтов</td><td>6</td></tr>
                    <tr><td>Год постройки</td><td>2016</td></tr>
                </table>				
            </div>
            <div>
                <h4>Описание:</h4>
                <p class="text-2">
                    Продаётся стоматология в очень ликвидном и проходимом месте(лучшего месторасположения вам не найти! Стомотология продаётся полностью со всей мебелью и оборудованием(2 стоматологических кресла,визиограф, отбеливающий
                </p>
            </div>
        </div>
    </div>		
</div>

<div class="container-fluid cart-map">
    <p>Фото объекта</p>
    <div id="cart-outer-slider" class="sliderkit">
        <div class="sliderkit-panels">    
            <div class="sliderkit-panel">
                <a href="img/cart-map-slide-1.jpg" class="fancy"><img src="/img/cart-map-slide-1.jpg" class="img-responsive"></a>
            </div>
            <div class="sliderkit-panel">
                <a href="img/cart-map-slide-2.jpg" class="fancy"><img src="/img/cart-map-slide-2.jpg" class="img-responsive"></a>
            </div>
            <div class="sliderkit-panel">
                <a href="img/cart-map-slide-1.jpg" class="fancy"><img src="/img/cart-map-slide-1.jpg" class="img-responsive"></a>
            </div>
            <div class="sliderkit-panel">
                <a href="img/cart-map-slide-2.jpg" class="fancy"><img src="/img/cart-map-slide-2.jpg" class="img-responsive"></a>
            </div>
            <div class="sliderkit-panel">
                <a href="img/cart-map-slide-1.jpg" class="fancy"><img src="/img/cart-map-slide-1.jpg" class="img-responsive"></a>
            </div>
            <i class="fa fa-search-plus" aria-hidden="true"></i>
        </div>  
        <div class="sliderkit-nav">
            <div class="sliderkit-nav-clip">
                <ul>
                    <li><a href="#" rel="nofollow"><img src="/img/cart-map-nav-1.jpg" class="img-responsive"></a></li>
                    <li><a href="#" rel="nofollow"><img src="/img/cart-map-nav-1.jpg" class="img-responsive"></a></li>
                    <li><a href="#" rel="nofollow"><img src="/img/cart-map-nav-1.jpg" class="img-responsive"></a></li>
                    <li><a href="#" rel="nofollow"><img src="/img/cart-map-nav-1.jpg" class="img-responsive"></a></li>
                    <li><a href="#" rel="nofollow"><img src="/img/cart-map-nav-1.jpg" class="img-responsive"></a></li>
                </ul>
            </div>
        </div>
    </div>
    <div><iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d19219.422844254394!2d36.05325619999999!3d52.97670615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2sru!4v1467146000321" width="100%" height="100%" frameborder="0" style="border:0" allowfullscreen></iframe></div>	
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
</div>
@stop