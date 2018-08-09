<form class="form-left list" id="formDetail">
    <p>Улица</p>
    <div class="select-wrap">
        <div class="form-group full">
            <input type="text" name="street" id="streetSearch" value="{{!empty($_GET['street'])?$_GET['street']:''}}" class="form-control">
        </div>
    </div>
    <p>Дата публикации</p>
    <div class="select-wrap">
        <div class="form-group">
            <label class="select-name" for="dateFrom">От</label>
            <input type="text" name="dateFrom" id="dateFrom" maxlength="10" value="<?=!empty($_GET['dateFrom'])?$_GET['dateFrom']:''; ?>" class="form-control">
        </div>
        <div class="form-group">
            <label class="select-name" for="dateTo">До</label>
            <input type="text" name="dateTo" id="dateTo" maxlength="10" value="<?=!empty($_GET['dateTo'])?$_GET['dateTo']:''; ?>" class="form-control">
        </div>
    </div>
    <p>Площадь <span>м<sup>2</sup></span></p>
    <div class="select-wrap">
        <div class="form-group">
            <label class="select-name" for="foP1">От</label>
            <input type="number" name="foP1" id="foP1" class="form-control">
        </div>
        <div class="form-group">
            <label class="select-name" for="toP1">До</label>
            <input type="number" name="toP1" id="toP1" class="form-control">
        </div>
    </div>
    <p>Этажей в доме</p>
    <div class="select-wrap">
        <div class="form-group">
            <label class="select-name" for="floorTF">От</label>
            <input type="number" name="floorTF" maxlength="3" id="floorTF" class="form-control">
        </div>
        <div class="form-group">
            <label class="select-name" for="floorTT">До</label>
            <input type="number" name="floorTT" maxlength="3" id="floorTT" class="form-control">
        </div>
    </div>
    <p>Этаж</p>
    <div class="select-wrap">
        <div class="form-group">
            <label class="select-name" for="floorF">От</label>
            <input type="number" name="floorF" maxlength="3" id="floorF" class="form-control">
        </div>
        <div class="form-group">
            <label class="select-name" for="floorT">До</label>
            <input type="number" name="floorT" maxlength="3" id="floorT" class="form-control">
        </div>
    </div>
    <p>Цена,<i class="fa fa-rub" aria-hidden="true"></i></p>
    <div class="select-wrap">
        <div class="form-group">
            <label class="select-name" for="priceF">От</label>
            <input type="number" name="priceF" maxlength="5" id="priceF" class="form-control">
        </div>
        <div class="form-group">
            <label class="select-name" for="priceT">До</label>
            <input type="number" name="priceT" maxlength="5" id="priceT" class="form-control">
        </div>
    </div>
    <p>Материал дома</p>
    <div class="select-wrap one">
        <select id="material" name="material">
            <option value="">Не выбран</option>
            <option value="1">Кирпич</option>
            <option value="2">Панель</option>
        </select>				
    </div>
    <p>Застройщик</p>
    <div class="select-wrap one">
        <select id="devel" name="devel">
            <option value="">Не выбран</option>
            @foreach ($developers as $developer)
            <option value="{{$developer['id']}}">{{$developer['name']}}</option>
            @endforeach
        </select>				
    </div>
    <p>Жилищный комлекс</p>
    <div class="select-wrap one">
        <select id="complex" name="complex">
            <option value="">Не выбран</option>
            @foreach ($complexes as $complex)
            <option value="{{$complex['id']}}">{{$complex['name']}}</option>
            @endforeach
        </select>				
    </div>
    <p>Состояние жилья</p>
    <div class="property-state">
        <p>
            <input type="hidden" id="condition" name="condition" value="3" />
            <?for($i=1;$i<=5;$i++):?>
            <span data-c="<?=$i?>" title="<?=trans('common.conditions.' . $i)?>"></span>
            <?endfor;?>
        </p>
    </div>
    
    <!--<input type="submit" value="найти">-->
    <a href="#" class="findLeft" id="findLeft">найти</a>
    <div class="text-center"><a href="#" id="resetFilter"><img src="/img/reset-left.png">Сбросить фильтр</a></div>
</form>