<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateObjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('objects', function(Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('street', 100);
            $table->string('building', 20);
            $table->smallInteger('year')->nullable();
            $table->tinyInteger('cnt_floors')->nullable();
            $table->tinyInteger('cnt_lifts')->nullable();
            $table->tinyInteger('cnt_porchs')->nullable();
            $table->smallInteger('last_el')->nullable();
            $table->smallInteger('last_roof')->nullable();
            $table->smallInteger('last_fasade')->nullable();
            $table->smallInteger('lifts_changed')->nullable();
            
            $table->string('lat', 20)->nullable();
            $table->string('lng', 20)->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('objects');
    }
}
