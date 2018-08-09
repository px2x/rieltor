<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsToObjects extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('objects', function(Blueprint $table) {
            $table->string('housing', 10)->nullable()->after('building');
            $table->tinyInteger('type')->nullable()->after('year'); //гостинка, комнаты, ком недвиж, квартиры
            $table->string('material', 30)->nullable()->after('type'); //Материал дома (кирпич/панель)
            $table->string('description', 255)->nullable()->after('material');  //Описание
            $table->string('comment', 255)->nullable()->after('description');  //Служебные отметка
            $table->tinyInteger('condition')->nullable()->after('comment');  //Состояние
            $table->tinyInteger('district_o')->nullable()->after('condition');  //Район (общепринятый) 
            $table->tinyInteger('district_m')->nullable()->after('district_o');  //Район (муниципальный)
            $table->smallInteger('last_cap')->nullable()->after('cnt_porchs');  //Последний капитальный ремонт
            
            //Площади по умолчанию
            //1 комната
            $table->smallInteger('sq1_c')->nullable()->after('district_m'); //Общая площадь
            $table->smallInteger('sq1_l')->nullable()->after('sq1_c');  //Жилая площадь
            $table->smallInteger('sq1_k')->nullable()->after('sq1_l');  //Площадь кухни
            
            //2 комнаты
            $table->smallInteger('sq2_c')->nullable()->after('sq1_k'); //Общая площадь
            $table->smallInteger('sq2_l')->nullable()->after('sq2_c');  //Жилая площадь
            $table->smallInteger('sq2_k')->nullable()->after('sq2_l');  //Площадь кухни
            
            //3 комнаты
            $table->smallInteger('sq3_c')->nullable()->after('sq2_k'); //Общая площадь
            $table->smallInteger('sq3_l')->nullable()->after('sq3_c');  //Жилая площадь
            $table->smallInteger('sq3_k')->nullable()->after('sq3_l');  //Площадь кухни
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
            $table->dropColumn('housing');
            $table->dropColumn('type');
            $table->dropColumn('material');
            $table->dropColumn('description');
            $table->dropColumn('comment');
            $table->dropColumn('condition');
            $table->dropColumn('district_o');
            $table->dropColumn('district_m');
            
            $table->dropColumn('sq1_c');
            $table->dropColumn('sq1_l');
            $table->dropColumn('sq1_k');
            $table->dropColumn('sq2_c');
            $table->dropColumn('sq2_l');
            $table->dropColumn('sq2_k');
            $table->dropColumn('sq3_c');
            $table->dropColumn('sq3_l');
            $table->dropColumn('sq3_k');
        });
    }
}
