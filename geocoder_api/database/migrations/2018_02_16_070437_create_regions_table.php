<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRegionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('regions', function (Blueprint $table) {
            $table->string('_id', 100)->unique();
            $table->primary('_id');
            $table->string('_countryId', 100);
            $table->string('name');
            $table->timestamps();
            $table->foreign('_countryId')->references('_id')->on('countries');
            $table->unique(['name', '_countryId']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('regions');
    }
}
