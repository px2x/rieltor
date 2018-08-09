<div>Добрый день!</div>
<div>На сайте был сделан заказ на просмотр недвижимости.</div>
<br>
<div>Контактное лицо: {{$order->username}}</div>
<div>Телефон: {{$order->phone}}</div>
<div>Комментарий: {{$order->comment}}</div>
<br>
<div>Для просмотра заказа перейдите по ссылке <a href="{{env('ADMIN_URL') . '/orders/view/' . $order->id}}">{{env('ADMIN_URL') . '/orders/view/' . $order->id}}</a></div>