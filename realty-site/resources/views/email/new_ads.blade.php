<div>Добрый день!</div>
<div>На сайте была подана заявка на добавление объекта в базу данных.</div>
<br>
<div>Телефон: {{$ads->phone}}</div>
<div>Адрес: {{$ads->address}}</div>
<div>Тип объекта: {{trans('common.types.' . $ads->type)}}</div>
<div>Общая площадь: {{$ads->sq1}}м<sup>2</sup></div>
<div>Цена: {{$ads->price}} руб</div>
<br>
<div>Для просмотра объявления перейдите по ссылке <a href="{{env('ADMIN_URL') . '/ads/view/' . $ads->id}}">{{env('ADMIN_URL') . '/ads/view/' . $ads->id}}</a></div>