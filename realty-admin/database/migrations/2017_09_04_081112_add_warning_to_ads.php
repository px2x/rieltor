<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddWarningToAds extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ads', function(Blueprint $table) {
            $table->boolean('warning')->nullable()->after('description'); 
            $table->text('warning_m')->nullable()->after('warning'); 
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
            $table->dropColumn('warning');
            $table->dropColumn('warning_m');
        });
    }
}
