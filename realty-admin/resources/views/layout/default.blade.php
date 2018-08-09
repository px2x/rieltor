<!DOCTYPE html>
<html ng-app="realty-admin" lang="<?php echo env('APP_LOCALE', 'en'); ?>">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <!-- Tell the browser to be responsive to screen width -->
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        
        <link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.css">
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons">
        <link rel="stylesheet" href="/css/style.css">
        <link rel="stylesheet" href="/css/editor.css">
    </head>
    <body>
        <div id="main-layout" layout-fill ng-cloak layout="column" layout-align="space-between center">
            <md-toolbar id="top" class="md-primary" style="background-color: #fff;" flex="none">
                <div class="md-whiteframe-z2 md-toolbar-tools md">
                    <md-button class="md-raised md-primary menu-button" aria-label="Menu" ng-click="openMenu();">
                        <md-icon class="material-icons">menu</md-icon>
                    </md-button>
                    <span flex></span>
                    <span>
                        <img src="/img/admin-icon-black.png" class="logo" alt="">
                        <span class="admin-name">{{ Auth::user()->name }}</span>
                        <md-button class="md-raised md-primary button-logout" aria-label="Logout" ng-click="redirectTo('/logout')">
                            <md-icon class="material-icons">&#xE851;</md-icon><span class="logout" i18n key="buttons.logout"></span>
                        </md-button>
                    </span>
                </div>
            </md-toolbar>
            <md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id="menu" flex="none">
                <md-toolbar class="md-theme-light">
                    <h3 class="md-toolbar-tools" i18n key="common.menu"></h3>
                </md-toolbar>
                <md-content layout-padding>
                    <ul class="left-menu">
                        <li ng-repeat="m in getMenu()">
                            <md-icon class="material-icons">@{{m.icon}}</md-icon>
                            <a ng-href="@{{m.href}}">@{{m.title}}</a>
                        </li>
                    </ul>
                </md-content>
                <md-content layout-padding>
                    <md-button ng-click="closeMenu()" aria-label="Close menu" class="md-primary" i18n key="common.close_menu"></md-button>
                </md-content>
            </md-sidenav>
            <div flex style="width: 100%; overflow-y:auto;">
                <md-content layout="row" layout-align="center stretch" style="background: none;">
                    <md-whiteframe class="content-wrapper">
                        <section class="content-header" ng-if="h1">
                            <ul class="breadcrumb" ng-if="bc">
                                <li>
                                    <a ng-href="@{{bc.href}}">
                                        <md-icon class="material-icons ng-binding">@{{bc.icon}}</md-icon>@{{bc.title}}
                                    </a>
                                </li>
                            </ul>
                            <h1 ng-bind="h1"></h1>
                        </section>
                        <div ng-if="loading" class="loading-cloak"><div class="loading-cloak-text" ng-bind="loadingText"></div></div>
                        <section class="content" ng-view></section>
                    </md-whiteframe>
                </md-content>
            </div>
        </div>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular-route.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular-animate.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular-aria.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.js"></script>
        <script src="/js/angular-local-storage.min.js"></script>
        <script src='/js/textAngular/textAngular-rangy.min.js'></script>
        <script src='/js/textAngular/textAngular-sanitize.min.js'></script>
        <script src='/js/textAngular/textAngular.min.js'></script>
        <script src="/js/inputmask.min.js"></script>
        <script src="/js/jquery.inputmask.min.js"></script>
        <script src="/js/admin.js"></script>
        <script src="/js/i18n/<?php echo env('APP_LOCALE', 'en'); ?>.js"></script>
        <script src="//maps.googleapis.com/maps/api/js?libraries=places&language=ru&key={{env('GOOGLE_API_KEY', '')}}"></script>
    </body>
</html>
