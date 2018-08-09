<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

//        $this->call('CreateAdminSeeder');
//        $this->call('AddCitySeeder');
//        $this->call('AddDistrictSeeder');
//        $this->call('AddSettingsSeeder');
        $this->call('AddNewDistrictSeeder');

        Model::reguard();
    }
}

class CreateAdminSeeder extends Seeder
{
    /**
     * Run.
     * 
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (!App\User::where('email', 'admin@tissite.ru')->first()) {
            App\User::create([
                'name' => 'Administrator',
                'email' => 'admin@tissite.ru', 
                'status' => 'active',
                'password' => bcrypt('123456')
            ]);
        }
    }

}

class AddSettingsSeeder extends Seeder {
    public function run()
    {
        App\Setting::create([
            'name' => 'contact_skype',
            'value' => ' '
        ]);
        App\Setting::create([
            'name' => 'contact_phone',
            'value' => ' '
        ]);
        App\Setting::create([
            'name' => 'contact_email',
            'value' => ' '
        ]);
    }
}

class AddCitySeeder extends Seeder {
    public function run()
    {
        App\City::create([
            'name' => 'Ростов-на-Дону'
        ]);
        App\City::create([
            'name' => 'Батайск'
        ]);
        App\City::create([
            'name' => 'Аксай'
        ]);
        App\City::create([
            'name' => 'Таганрог'
        ]);
    }
}

class AddDistrictSeeder extends Seeder {
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS = 0;');
        DB::statement('TRUNCATE TABLE districts;');
        DB::statement('SET FOREIGN_KEY_CHECKS = 1;');
        
        $districtsO = ["2-й п. Орджоникидзе", "Александровка", "Аэропорт",
            "Военвед", "Горизонт", "ЖДР", "ЗЖМ", 
            "Зоопарк", "Каменка", "Левенцовка", "Ленина", 
            "Нахичевань", "Сельмаш", "СЖМ", 
            "Суворовский", "Темерник", "Центр", "Чкаловский"
        ];
        foreach($districtsO as $d)
        {
            App\District::create([
                'name' => $d,
                'type' => 'o',
                'city_id' => 1
            ]);
        }
        
        $districtsM = ["Ворошиловский", "Железнодорожный", "Кировский", 
            "Ленинский", "Октябрьский", "Первомайский", "Пролетарский", "Советский"
        ];
        foreach($districtsM as $d)
        {
            App\District::create([
                'name' => $d,
                'type' => 'm',
                'city_id' => 1
            ]);
        }
    }
}
class AddNewDistrictSeeder extends Seeder {
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS = 0;');
        DB::statement('TRUNCATE TABLE districts;');
        DB::statement('SET FOREIGN_KEY_CHECKS = 1;');
        
        $districtsO = [
            "Платовский",
            "Таганрогская",
            "Новое Поселение",
            "Вертолётное поле",
            "Портовая"
            ];
        foreach($districtsO as $d)
        {
            App\District::create([
                'name' => $d,
                'type' => 'o',
                'city_id' => 1
            ]);
        }
    }
}