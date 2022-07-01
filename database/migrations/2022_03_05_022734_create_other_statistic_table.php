<?php

use Illuminate\Database\Schema\Blueprint;

use App\BaseMigration;

class CreateOtherStatisticTable extends BaseMigration
{
    public function __construct()
    {
        parent::setTableName('OtherStatistic');
        parent::setCols([
            'name' => function (Blueprint $table) {
                $table->string('name', 64);
            },
            'value' => function (Blueprint $table) {
                $table->string('value', 16);
            },
            'study_id' => function (Blueprint $table) {
                $table->uuid('study_id');
            },
        ]);
    }
}
