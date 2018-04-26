<?php
namespace App\Traits;
use Illuminate\Database\Eloquent\ModelNotFoundException;
/**
 * Trait UuidModel
 * @package App\Traits
 */
trait UuidModel
{
    /**
     * Binds creating/saving events to create UUids (and also prevent them from being overwritten).
     *
     * @return void
     */
    public static function bootUuidModel()
    {
        static::creating(function ($model) {
            // Don't let people provide their own UUids, we will generate a proper one.
            $timeStamp = time()."";
            $model->_id = base64_encode(self::generateRandomString(4).'-'.substr($timeStamp, strlen($timeStamp) - 6).'-'.self::generateRandomString(4));
        });
    
        static::saving(function ($model) {
            // What's that, trying to change the UUid huh?  Nope, not gonna happen.
            $original__id = $model->getOriginal('_id');
    
            if ($original__id !== $model->_id) {
                $model->_id = $original__id;
            }
        });
    }
    
    /**
     * Scope a query to only include models matching the supplied UUid.
     * Returns the model by default, or supply a second flag `false` to get the Query Builder instance.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     *
     * @param  \Illuminate\Database\Schema\Builder $query The Query Builder instance.
     * @param  string                              $uuid  The UUid of the model.
     * @param  bool|true                           $first Returns the model by default, or set to `false` to chain for query builder.
     * @return \Illuminate\Database\Eloquent\Model|\Illuminate\Database\Eloquent\Builder
     */
    public function scopeUuid($query, $_id, $first = true)
    {
        if (!is_string($uuid)) {
            throw (new ModelNotFoundException)->setModel(get_class($this));
        }
    
        $search = $query->where('_id', $_id);
    
        return $first ? $search->firstOrFail() : $search;
    }
    
    /**
     * Scope a query to only include models matching the supplied id or UUid.
     * Returns the model by default, or supply a second flag `false` to get the Query Builder instance.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     *
     * @param  \Illuminate\Database\Schema\Builder $query The Query Builder instance.
     * @param  string                              $uuid  The UUid of the model.
     * @param  bool|true                           $first Returns the model by default, or set to `false` to chain for query builder.
     * @return \Illuminate\Database\Eloquent\Model|\Illuminate\Database\Eloquent\Builder
     */
    public function scopeIdOrUuId($query, $id_or__id, $first = true)
    {
        if (!is_string($id_or__id) && !is_numeric($id_or__id)) {
            throw (new ModelNotFoundException)->setModel(get_class($this));
        }
    
        $search = $query->where('_id', $id_or__id);
    
        return $first ? $search->firstOrFail() : $search;
    }

    public static function generateRandomString($length = 10) 
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
}