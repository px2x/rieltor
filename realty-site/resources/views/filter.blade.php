<div>
    <div class="container-fluid realty-type">
        <input type="hidden" value="1" id="realty_type" name="type"/>
        <input type="hidden" value="0" id="enableRent" name="rent"/>
        <ul>
            <li class="act" data-type="1">
                <span id="count1"><?php echo isset($counters[1]) ? $counters[1] : 0; ?></span>
                <img src="/img/icons/flat.png">
                <p>Квартиры</p>
            </li>
            <li data-type="2">
                <span id="count2"><?php echo isset($counters[2]) ? $counters[2] : 0; ?></span>
                <img src="/img/icons/home.png">
                <p>Дома</p>
            </li>
            <li data-type="4">
                <span id="count4"><?php echo isset($counters[5]) ? $counters[5] : 0; ?></span>
                <img src="/img/icons/factory.png">
                <p>Коммерческая недвижимость</p>
            </li>
            <li data-type="rent" id="secondRent">
                <span><?php echo isset($counters['rent']) ? $counters['rent'] : 0; ?></span>
                <img src="/img/icons/rent.png">
                <p>Аренда</p>
            </li>
        </ul>
    </div>
    <div class="container-fluid select-adr">
        <div class="row">
            <div class="col-sm-6">
                <div class="select-name">Город</div>
                <select name="city_id" id="city">
                    @foreach($cities as $city)
                    <option value="{{$city['id']}}">{{$city['name']}}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-sm-6">
                <div class="select-name">Район
                    <ul class="select-district">
                        <li><a href="#" data-name="district_o" class="act">общепринятый</a></li>
                        <li><a href="#" data-name="district_m">муниципальный</a></li>
                    </ul>
                </div>
                <div class="district_o">
                    <select name="district_o[]" id="district_o" multiple="multiple">
                    </select>
                </div>
                <div class="district_m">
                    <select name="district_m[]" id="district_m" multiple="multiple">
                    </select>
                </div>
            </div>
        </div>
    </div>
</div>