<?php namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Facades\Image;

use App\Photo;

class Photos extends Controller {

    public function upload()
    {
//        sleep(3);
//        return array('success' => true, 'id' => 2);
        $response = array('success' => false);
        set_time_limit(0);
        ini_set("memory_limit", "256M");

        $file   = Input::file('image');
        $config = array(
            'allowedExtensions' => array('jpg', 'jpeg'),
            'directoryImg'      => base_path() . '/public/uploads/photos',
        );
        if( !Input::hasFile('image') )
        {
            $response['message'] = Lang::get('uploads.errors.failed');
            return $response;
        }
        
        $ext = strtolower($file->getClientOriginalExtension());
        if( !$ext )
        {
            $response['message'] = Lang::get('uploads.errors.no_extension');
            return $response;
        }
        
        if( !in_array($ext, $config['allowedExtensions']) )
        {
            $response['message'] = Lang::get('uploads.errors.wrong_type');
            return $response;
        }

        if( !$file->isValid() )
        {
            $response['message'] = Lang::get('uploads.errors.failed');
            return $response;
        }
        
        $folder = Photo::select(array(DB::raw('COUNT(folder) as cnt'), 'folder'))
                ->having('cnt', '<', 100)
                ->take(1)
                ->pluck('folder');
        
        if( empty($folder) )
        {
            $folder = substr(md5(time()), 0, 10);
        }
        
        $path = $config['directoryImg'] . '/' . $folder;
        if( !file_exists($path) )
        {
            mkdir($path, 0777, true);
        }
        $path .= '/';
        $oldname = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $newName = sha1(time() . uniqid());
        
        //save original photo
        $resultSave = $file->move($path, $newName . '_o.jpg');
        if( $resultSave )
        {
            $image = Image::make($path . $newName . '_o.jpg');
            $width = $image->width();
            $height = $image->height();
            if( $width >= $height )
            {
                $image->resize(1600, null, function ($constraint) {
                    $constraint->aspectRatio();
                });
            }
            else
            {
                $image->resize(null, 768, function ($constraint) {
                    $constraint->aspectRatio();
                });
            }
            //save main photo
            $image->save($path . $newName . '.jpg');
            
            $image->resize(300, 225, function ($constraint) {
                $constraint->aspectRatio();
            });
            //save thumbnail
            $image->save($path . $newName . '_th.jpg');
            
            $newFile = new Photo;
            $newFile->folder = $folder;
            $newFile->filename = $newName;
            $newFile->old_name = $oldname;
            $newFile->save();
            
            $response['success'] = true;
            $response['id'] = $newFile->id;
        }
        else
        {
            $response['message'] = Lang::get('uploads.errors.save_failed');
        }
        return $response;
    }
    
    public function delete($id)
    {
        $response = array('success' => false);
        
        $file = Photo::find($id);
        if( !$file )
        {
            return $response;
        }
        
        $path = base_path() . '/public/uploads/photos/' . $file->folder . '/' . $file->filename;
        @unlink($path . '.jpg');
        @unlink($path . '_th.jpg');
        @unlink($path . '_o.jpg');
        
        $file->delete();
        $response['success'] = true;
        return $response;
    }

}
