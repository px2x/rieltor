<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDeveloperNameToAds extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ads', function(Blueprint $table) {
            $table->renameColumn('dev_id', 'developer_id');
            $table->renameColumn('lk_id', 'complex_id');
        });
        
        Schema::table('ads', function(Blueprint $table) {
            $table->integer('developer_id')->unsigned()->nullable()->change();
            $table->integer('complex_id')->unsigned()->nullable()->change();
            
            $table->string('developer_name', 255)->nullable()->after('developer_id');
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
        Schema::table('ads', function(Blueprint $table) {
            $table->dropForeign('ads_developer_id_foreign');
            $table->dropForeign('ads_complex_id_foreign');
            
            $table->renameColumn('developer_id', 'dev_id');
            $table->renameColumn('complex_id', 'lk_id');
            
            $table->dropColumn('developer_name');
            $table->dropColumn('complex_name');
        });
    }
}
