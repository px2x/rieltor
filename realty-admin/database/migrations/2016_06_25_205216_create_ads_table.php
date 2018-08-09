<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAdsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ads', function(Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('user_id', false, true)->nullable()->length(10);
            $table->integer('object_id', false, true)->nullable()->length(10);
            $table->string('name', 255);
            $table->string('address', 255)->nullable();
            
            $table->tinyInteger('type')->nullable();  // тип: 1-квартира, 2-дом, 3-участок, 4-гараж, 5-ком. недвиж
            $table->boolean('rent')->default(0);  // флаг аренды
            
            $table->tinyInteger('subtype')->default(0); // 1-комната|2-гостинка, 3-офис|4-торговая
            $table->tinyInteger('rooms')->default(0);   //количество комнат
            $table->tinyInteger('floor')->nullable();   // этаж
            $table->tinyInteger('floor_t')->nullable(); //всего этажей (для квартир и домов)
            
            $table->decimal('sq1', 5, 2)->nullable(); // общая площадь
            $table->boolean('sqt1')->nullable(); // единица измерения общей площади (0-м2, 1-сотка)
            $table->decimal('sq2', 5, 2)->nullable(); // жилая площадь
            $table->decimal('sq3', 5, 2)->nullable(); // площадь кухни
            $table->decimal('sq4', 5, 2)->nullable(); // площадь участка/гаража
            $table->boolean('sqt4')->nullable(); // единица измерения площади участка/гаража (0-м2, 1-сотка)
            
            $table->integer('price', false, true)->length(10)->nullable();
            $table->integer('price_d', false, true)->length(10)->nullable();
            
            $table->tinyInteger('condition')->unsigned()->nullable();
            $table->boolean('popular')->default(0);
            
            $table->tinyInteger('dev_id')->unsigned()->nullable(); //застройщик (changed to developer_id)
            $table->tinyInteger('lk_id')->unsigned()->nullable();  //жилищный комплекс (changed to complex_id)
            
            $table->string('lat', 20)->nullable();
            $table->string('lng', 20)->nullable();
            
            $table->timestamps();
            $table->date('published_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('ads');
    }
}
