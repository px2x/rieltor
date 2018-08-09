<!DOCTYPE html>
<html ng-app="realty-admin">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Realty | Dashboard</title>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
<!--        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">-->
        <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="/theme/css/AdminLTE.min.css">
        <link rel="stylesheet" href="/theme/css/skins/skin-black.min.css">
        <link rel="stylesheet" href="/theme/css/custom.css">
    </head>
    <body class="hold-transition skin-black layout-boxed sidebar-mini">
        <div class="wrapper">
            <header class="main-header">
                <a ng-href="/" class="logo">
                    <span class="logo-lg"><b>Realty</b>App</span>
                </a>

                <nav class="navbar navbar-static-top" role="navigation">
                    <div class="navbar-custom-menu">
                        <ul class="nav navbar-nav">
                            <li class="dropdown user user-menu">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                    <img src="/theme/img/admin-icon-white.png" class="user-image" alt="User Image">
                                    <span class="hidden-xs">{{ Auth::user()->name }}</span>
                                </a>
                                <ul class="dropdown-menu">
                                    <li class="user-header">
                                        <img src="/theme/img/admin-icon-white.png" class="img-circle" alt="User Image">
                                        <p>{{ Auth::user()->name }}</p>
                                    </li>
                                    <li class="user-footer">
                                        <div class="pull-right">
                                            <a href="{{ route('logout') }}" class="btn btn-primary btn-flat"><i class="fa fa-sign-out"></i> Sign out</a>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                </nav>
            </header>
            <aside class="main-sidebar">
                <section class="sidebar">
                    <div class="user-panel">
                        <div class="pull-left image">
                            <img src="/theme/img/admin-icon-white.png" class="img-circle" alt="User Image">
                        </div>
                        <div class="pull-left info">
                            <p>{{ Auth::user()->name }}</p>
                            <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
                        </div>
                    </div>
                    <ul class="sidebar-menu">
                        <li class="header">MAIN NAVIGATION</li>
                        <li ng-class="menu=='dashboard' && 'active'">
                            <a ng-href="/">
                                <i class="fa fa-dashboard"></i> <span>Главная</span>
                            </a>
                        </li>
                        <li ng-class="menu=='ads' && 'active'">
                            <a ng-href="/ads">
                                <i class="fa fa-fax"></i> <span>Объявления</span>
                            </a>
                        </li>
                        <li ng-class="menu=='objects' && 'active'">
                            <a ng-href="/objects">
                                <i class="fa fa-building"></i> <span>Объекты</span>
                            </a>
                        </li>
                        <li ng-class="menu=='orders' && 'active'">
                            <a ng-href="/orders">
                                <i class="fa fa-opencart"></i> <span>Заказы</span>
                            </a>
                        </li>
                        <li ng-class="menu=='pages' && 'active'">
                            <a ng-href="/pages">
                                <i class="fa fa-header"></i> <span>Статичные страницы</span>
                            </a>
                        </li>
                        <li ng-class="menu=='banners' && 'active'">
                            <a ng-href="/banners">
                                <i class="fa fa-money"></i> <span>Баннеры</span>
                            </a>
                        </li>
                        <li ng-class="menu=='settings' && 'active'">
                            <a ng-href="/settings">
                                <i class="fa fa-cogs"></i> <span>Настройки</span>
                            </a>
                        </li>
                    </ul>
                </section>
            </aside>
            <div class="content-wrapper">
                <section class="content-header" ng-if="h1">
                    <h1 ng-bind="h1"></h1>
                    <ol class="breadcrumb">
                        <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
                        <li class="active">Dashboard</li>
                    </ol>
                </section>
                <div ng-if="loading" class="loading-cloak"><div class="loading-cloak-text" ng-bind="loadingText"></div></div>
                <section class="content" ng-view></section>
            </div>

            <footer class="main-footer">
                <strong>Copyright &copy; Realty 2015-<?php echo date('Y'); ?>. </strong> All rights reserved.
            </footer>

            <div class="control-sidebar-bg"></div>

        </div>
<!--        <script src="//code.jquery.com/jquery-2.2.0.min.js"></script>
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular-route.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular-animate.min.js"></script>-->
        <script src="/bootstrap/js/jquery.min.js"></script>
        <script src="/bootstrap/js/bootstrap.min.js"></script>
        <script src="/bootstrap/js/angular.min.js"></script>
        <script src="/bootstrap/js/angular-route.min.js"></script>
        <script src="/theme/js/angular-local-storage.min.js"></script>
        <script src="/theme/js/main.js"></script>
        <script src="/theme/i18n/ru.js"></script>
    </body>
</html>