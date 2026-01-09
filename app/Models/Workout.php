<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Workout extends Model
{
    protected $fillable = ['name', 'description', 'type'];

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
