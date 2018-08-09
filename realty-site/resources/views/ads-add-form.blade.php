<div id="addAdsModal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <form name="basketForm" id="basketForm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                    </button>
                    <h4 class="modal-title">Заполните заявку на добавление объекта в нашу базу даных</h4>
                </div>
                <div class="modal-body">
                        {{--<div class="form-group">
                            <label for="usr">Как Вас зовут*:</label>
                            <input type="text" class="form-control" name="username" id="username-add">
                        </div>--}}
                        <div class="form-group phone-wrap">
                            <label for="usr">Телефон*:</label>
                            <input type="text" class="form-control" name="phone" id="phone-add" required="required">
                        </div>
                        <div class="form-group">
                            <label for="usr">Адрес объекта*:</label>
                            <input type="text" class="form-control" id="address" name="address" required="required">
                        </div>
                        <div class="form-group">
                            <label for="description-add">Описание:</label>
                            <textarea type="text" class="form-control" name="description" id="description-add"></textarea>
                        </div>
                        <div class="row">
                            <div class="form-group col-xs-4">
                                <label for="type-add">Тип объекта*:</label>
                                <select name="type" id="type-add" required="required">
                                    <option value=""></option>
                                    <option value="1">Квартира</option>
                                    <option value="2">Дом</option>
                                    <option value="4">Коммерческая недвижимость</option>
                                </select>
                            </div>
                            <div class="col-xs-4 form-group sel-mw-222px">
                                <label for="subtype-add">Подтип:</label>
                                <select name="subtype" id="subtype-add">
                                    <option value=""></option>
                                    <option value="1">комната</option>
                                    <option value="2">гостинка</option>
                                    <option value="3">офис</option>
                                    <option value="4">торговая площадка</option>
                                </select>
                            </div>
                            <div class="col-xs-4 form-group sel-mw-222px">
                                <label for="rooms-add">Количество комнат:</label>
                                <select name="rooms" id="rooms-add">
                                    <option value=""></option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5+</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-xs-4 sel-mw-222px">
                                <label for="district_m-add">Муниципальный район:</label>
                                <select name="district_m" id="district_m-add">
                                    <option value=""></option>
                                    @foreach($district_m as $district)
                                        <option value="{{$district['id']}}">{{$district['name']}}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="form-group col-xs-4 sel-mw-222px">
                                <label for="district_o-add">Общепринятый район:</label>
                                <select name="district_o" id="district_o-add">
                                    <option value=""></option>
                                @foreach($district_o as $district)
                                    <option value="{{$district['id']}}">{{$district['name']}}</option>
                                @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-xs-4 sel-mw-222px">
                                <label for="material-add">Материал дома*:</label>
                                <select name="material" id="material-add" required="required">
                                    <option value=""></option>
                                    <option value="1">Кирпич</option>
                                    <option value="2">Панель</option>
                                    <option value="3">Кирпично-панельный</option>
                                </select>
                            </div>
                            <div class="form-group col-xs-4">
                                <label for="floor_t-add">Этажей в доме:</label>
                                <input type="number" class="form-control" id="floor_t-add" name="floor_t">
                            </div>
                            <div class="form-group col-xs-4">
                                <label for="floor-add">Этаж:</label>
                                <input type="number" class="form-control" id="floor-add" name="floor">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-4 form-group">
                                <label for="sq1-add">Общая площадь, м<sup>2</sup> *:</label>
                                <input type="number" class="form-control" id="sq1-add" name="sq1" required="required" maxlength="4">
                            </div>
                            <div class="col-xs-4 form-group">
                                <label for="sq2-add">Жилая площадь, м<sup>2</sup>:</label>
                                <input type="number" class="form-control" id="sq2-add" name="sq2" maxlength="4">
                            </div>
                            <div class="col-xs-4 form-group">
                                <label for="sq3-add">Площадь кухни, м<sup>2</sup>:</label>
                                <input type="number" class="form-control" id="sq3-add" name="sq3" maxlength="4">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-6 form-group">
                                <label for="price-add">Цена*, <b>&#8381;</b>:</label>
                                <input type="text" class="form-control" id="price-add" name="price" required="required">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-4 form-group">
                                <label>Состояние объекта</label>
                                <div class="property-state">
                                    <p>
                                        <input type="hidden" id="condition-add" name="condition"/>
                                        <span data-c="1" title="Без внутренней отделки"></span>
                                        <span data-c="2" title="Требуется ремонт"></span>
                                        <span data-c="3" title="Жилое"></span>
                                        <span data-c="4" title="Хорошее"></span>
                                        <span data-c="5" title="Отличное"></span>
                                    </p>
                                </div>
                            </div>
                            <div class="col-xs-4 form-group">
                                <label for="rent-add">Аренда:</label>
                                <input type="checkbox" id="rent-add" name="rent">
                            </div>
                        </div>
                </div>
                <div class="modal-footer">
                    <button id="addToBasketButton" type="submit" class="btn btn-primary">
                        Отправить заявку
                    </button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">
                        Отмена
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>