<?php

namespace Database\Seeders;

use App\Models\ThemeSetting;
use Illuminate\Database\Seeder;

class ThemeSettingSeeder extends Seeder
{
    /**
     * Seed the app theme options (global colors).
     */
    public function run(): void
    {
        $defaults = [
            'primary_1' => '#45AE96',
            'primary_2' => '#46ae97',
            'secondary' => '#c4f5ea',
            'tertiary' => '#cf992c',
        ];

        foreach ($defaults as $key => $value) {
            ThemeSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        ThemeSetting::clearCache();
    }
}
