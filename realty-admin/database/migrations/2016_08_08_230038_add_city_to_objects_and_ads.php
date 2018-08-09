<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCityToObjectsAndAds extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cities', function(Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name', 100);
            $table->timestamps();
        });
        
        Schema::table('objects', function(Blueprint $table) {
            $table->integer('city_id')->unsigned()->nullable()->after('id');
            $table->string('city_name', 100)->nullable()->after('city_id');
            
            $table->foreign('city_id')->references('id')->on('cities')
                ->onUpdate('cascade')->onDelete('cascade');
        });
        
        Schema::table('ads', function(Blueprint $table) {
            $table->integer('city_id')->unsigned()->nullable()->after('object_id');
            $table->string('city_name', 100)->nullable()->after('city_id');
            
            $table->foreign('city_id')->references('id')->on('cities')
                ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('objects', function(Blueprint $table) {
            $table->dropForeign('objects_city_id_foreign');
            
            $table->dropColumn('city_id');
            $table->dropColumn('city_name');
        });
        
        Schema::table('ads', function(Blueprint $table) {
            $table->dropForeign('ads_city_id_foreign');
            
            $table->dropColumn('city_id');
            $table->dropColumn('city_name');
        });
        Schema::drop('cities');
    }
}
