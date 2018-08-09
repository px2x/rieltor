@extends('layout/default')

@section('meta')
<title>{{$meta_title}}</title>
<meta name="keywords" content="{{$meta_keywords}}">
<meta name="description" content="{{$meta_description}}">
@stop

@section('content')
<div class="main-banner about">
    <div></div>
</div>

<div class="container-fluid top-header main">
    <p>{{$title}}</p>
</div>

<div class="container-fluid top">
{!!$content!!}
</div>
@stop