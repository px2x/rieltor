<?php namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Ads;

class TransformName extends Command {

    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'transform:name';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Transform invalid names';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function fire()
    {
        $res = Ads::where('subtype', '>', 0)
            ->where('rooms', '>', 1)
            ->get();
        
        foreach($res as $ad) {
            if($ad->subtype == 1) {
                $r = $ad->rooms . ' комнат' . ($ad->rooms < 5 ? 'ы':'');
                $ad->name = 'Продается ' . $r;
                if($ad->rent == 1)
                {
                    $ad->name = 'Сдается ' . $r;
                }
                $ad->save();
            } elseif($ad->subtype == 2) {
                $ad->name = 'Продается '.$ad->rooms.' комнатная гостинка';
                if($ad->rent == 1)
                {
                    $ad->name = 'Сдается '.$ad->rooms.' комнатная гостинка';
                }
                $ad->save();
            }
        }
    }

}