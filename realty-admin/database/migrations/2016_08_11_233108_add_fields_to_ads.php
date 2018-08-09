<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsToAds extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ads', function(Blueprint $table) {
            $table->string('material', 30)->nullable()->after('floor_t'); //Материал дома (кирпич/панель)
            $table->text('description')->nullable()->after('material');  //Служебные отметка
            $table->string('comment', 255)->nullable()->after('description');  //Служебные отметка
            $table->tinyInteger('district_o')->nullable()->after('comment');  //Район (общепринятый) 
            $table->tinyInteger('district_m')->nullable()->after('district_o');  //Район (муниципальный)
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ads', function(Blueprint $table) {
            $table->dropColumn('material');
            $table->dropColumn('description');
            $table->dropColumn('comment');
            $table->dropColumn('district_o');
            $table->dropColumn('district_m');
        });
    }
}
