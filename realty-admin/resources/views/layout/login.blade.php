<!DOCTYPE html>
<html ng-app="realty-login" lang="<?php echo env('APP_LOCALE', 'en'); ?>">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Авторизация</title>
        <!-- Tell the browser to be responsive to screen width -->
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        
        <link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/angular_material/1.0.0/angular-material.min.css">
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons">
        <link rel="stylesheet" href="/css/style.css">
        
    </head>
    <body>
        <div id="main-layout" layout-fill ng-cloak layout="column" layout-align="center center">
            <div ng-view></div>
        </div>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular-route.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular-animate.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular-aria.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angular_material/1.0.0/angular-material.min.js"></script>
        <script src="/js/login.js"></script>
        <script src="/js/i18n/<?php echo env('APP_LOCALE', 'en'); ?>.js"></script>
    </body>
</html>
