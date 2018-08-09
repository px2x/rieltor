<?php namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Ads;

class HideAds extends Command {

    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'hide:ads';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Archive ads after 3 months';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function fire()
    {
        Ads::where('published_at', '<=', date('Y-m-d', strtotime('-3month')))
            ->where('status', 'publish')
            ->update(array('status' => 'archived'));
    }

}