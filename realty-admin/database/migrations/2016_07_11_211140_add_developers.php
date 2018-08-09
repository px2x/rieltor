<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDevelopers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('developers', function(Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name', 255);
            $table->string('description', 255);
            $table->timestamps();
        });
        
        Schema::create('complexes', function(Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name', 255);
            $table->string('description', 255);
            $table->timestamps();
        });
        
        
        Schema::table('objects', function(Blueprint $table) {
            $table->integer('developer_id')->unsigned()->nullable()->after('district_m'); //застройщик
            $table->string('developer_name', 255)->nullable()->after('developer_id');
            
            $table->integer('complex_id')->unsigned()->nullable()->after('developer_name');  //жилищный комплекс
            $table->string('complex_name', 255)->nullable()->after('complex_id');
            
            $table->foreign('developer_id')->references('id')->on('developers')
                ->onUpdate('cascade')->onDelete('cascade');
            
            $table->foreign('complex_id')->references('id')->on('complexes')
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
            $table->dropForeign('objects_developer_id_foreign');
            $table->dropForeign('objects_complex_id_foreign');
            
            $table->dropColumn('developer_id');
            $table->dropColumn('complex_id');
            $table->dropColumn('developer_name');
            $table->dropColumn('complex_name');
        });
        Schema::drop('developers');
        Schema::drop('complexes');
    }
}
