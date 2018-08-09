<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @yield('meta')

        <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700,300italic,400italic,700italic,300,600&subset=latin,cyrillic' rel='stylesheet'>
        <link rel="stylesheet" href="/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="/css/select2.min.css">
        <link rel="stylesheet" href="/fancybox/jquery.fancybox.css">
        <link rel="stylesheet" href="/css/sliderkit-core.css">
        <link rel="stylesheet" href="/css/style.css">
        
        <link rel="apple-touch-icon" sizes="180x180" href="/img/favicon/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon/favicon-16x16.png">
        <link rel="manifest" href="/manifest.json">
        <link rel="mask-icon" href="/img/favicon/safari-pinned-tab.svg" color="#194d82">
        <meta name="msapplication-TileColor" content="#2b5797">
        <meta name="msapplication-TileImage" content="/img/favicon/mstile-144x144.png">
        <meta name="theme-color" content="#ffffff">
    </head>
    <body>
        <header<?php echo isset($isCatalog) ? ' class="blue"' : ''; ?>>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-xs-12">
                        <a href="/" class="logo-wrap">
                            <img class="logo" src="/img/logo_2.png">
                            <span class="logo-text">Меркурий</span>
                            <span class="logo-text">Агенство недвижимости</span>
                        </a>
                        <div class="tel">
                            {{$topPhone}}
                            <span><i class="fa fa-phone" aria-hidden="true"></i></span>
                        </div>
                        <ul class="header-nav">
                            <li><a href="/about">О нас</a></li>
                            <li><a href="#" class="basketHead">Корзина <b class="basket">0</b></a></li>
                            <!--<li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Войти <span class="caret"></span></a>
                                <ul class="dropdown-menu">
                                    <li><a href="">Войти</a></li>
                                    <li><a href="">Зарегистрироваться</a></li>
                                </ul>
                            </li>-->
                        </ul>
                    </div>
                </div>
            </div>
        </header>
        @yield('content')
        <footer class="container-fluid">
            <div class="row">
                <div class="col-xs-12">
                </div>
            </div>
        </footer>

        <div id="basketModal" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <form id="sendOrderForm">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div id="content">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
                                    <li class="active"><a href="#red" data-toggle="tab">Заказ</a></li>
                                    <li><a href="#orange" data-toggle="tab">Контактная Информация</a></li>
                                </ul>
                                <div id="my-tab-content" class="tab-content">
                                    <div class="tab-pane active" id="red">
                                        <table class="min-width-730px table table-striped">
                                            <thead>
                                                <tr id="basketHead">
                                                    <th>Название</th>
                                                    <th><p>Цена <i class="fa fa-rub" aria-hidden="true"></i></p></th>
                                                    <th>Управление</th>
                                                </tr>
                                            </thead>
                                            <tbody id="basketTable">
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="tab-pane" id="orange">
                                        <form name="basketForm">
                                            <div class="form-group">
                                                <label for="username">Как Вас зовут*:</label>
                                                <input type="text" class="form-control" id="username" required="required">
                                            </div>
                                            <div class="form-group">
                                                <label for="phone">Телефон*:</label>
                                                <input type="text" class="form-control" id="phone" required="required" maxlength="15">
                                            </div>
                                            <div class="form-group">
                                                <label for="comment">Коментарий:</label>
                                                <textarea type="text" class="form-control" id="comment" maxlength="255"></textarea>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
                            <button type="submit" id="basketButton" class="btn btn-primary disabled">Подтвердить</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div id="successModal" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Успешно</h4>
                    </div>
                    <div class="modal-body">
                        <p>Ваш заказ был успешно отправлен на оформление. В ближайшее время с вами свяжутся</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="emptyModal" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Корзина Пуста</h4>
                    </div>
                    <div class="modal-body">
                        <p>Для того что бы оформить заказ, пожалуйста добавьте товар в корзину</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&load=package.standard" type="text/javascript"></script>
        <script src="/js/bootstrap.min.js"></script>
        <script src="/js/select2.min.js"></script>
        <script src="/js/jquery.scrollTo.min.js"></script>
        <script src="/fancybox/jquery.fancybox.pack.js"></script>
        <script src="/js/jquery.mousewheel.min.js"></script>
        <script src="/js/jquery.sliderkit.1.9.2.js"></script>
        <script src="/js/custom.js"></script>
        @yield('script')
    </body>
</html>