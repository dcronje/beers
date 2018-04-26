<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLocationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->string('_id', 100)->unique();
            $table->primary('_id');
            $table->string('_countryId', 100);
            $table->string('_regionId', 100);
            $table->string('_cityId', 100)->nullable();
            $table->string('_areaId', 100)->nullable();
            $table->string('name');
            $table->string('address');
            $table->string('building');
            $table->string('timezone');
            $table->double('longitude');
            $table->double('latitude');
            $table->timestamps();
            $table->foreign('_countryId')->references('_id')->on('countries');
            $table->foreign('_regionId')->references('_id')->on('regions');
            $table->foreign('_cityId')->references('_id')->on('cities');
            $table->foreign('_areaId')->references('_id')->on('areas');
            $table->unique(['name', 'latitude', 'longitude']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('locations');
    }
}
