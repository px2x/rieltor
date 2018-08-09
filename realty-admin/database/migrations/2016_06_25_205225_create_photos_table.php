<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePhotosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('photos', function(Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('item_id', false, true)->length(10);
            $table->string('item_type', 20);
            
            $table->string('folder', 10);
            $table->string('filename', 40);
            $table->string('description', 255);
            $table->string('old_name', 255);
            $table->tinyInteger('position')->unsigned();
            
            $table->boolean('main')->default(0);
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
        Schema::drop('photos');
    }
}
