<?php namespace App\Console\Commands;

use Illuminate\Console\Command;
use PHPExcel_IOFactory;
use App\Object;

class ImportObjects extends Command {

    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'import:objects';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import objects from XLSX file';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function fire()
    {
        $ex = PHPExcel_IOFactory::load(storage_path() . '/homes.xls');
        $sheet = $ex->getActiveSheet();
        $arr = $sheet->toArray();
        $map = array('street', 'building', 'year', 'cnt_floors', 'cnt_lifts', 'cnt_porchs', 'last_el', 'last_roof', 'last_fasade', 'lifts_changed');
        foreach($arr as $k => $row)
        {
            if( $k == 0 )
            {
                continue;
            }
            
            $object = new Object();
            foreach( $row as $k => $v)
            {
                if( !isset($map[$k]) )
                {
                    break;
                }
                
                $object->{$map[$k]} = $v;
            }
            
            $object->save();
        }
//        $ex->load(storage_path().'homes.xls', function($reader) {
//
//            // Getting all results
//            $results = $reader->get();
//
//            // ->all() is a wrapper for ->get() and will work the same
//            //$results = $reader->all();
//            
//            print_r($results);
//
//        });
        
        $this->info('All objects were imported');
    }

}