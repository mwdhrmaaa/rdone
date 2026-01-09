<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User; // Added this use statement for the Schedule model

class Schedule extends Model
{
    protected $fillable = ['user_id', 'workout_id', 'day_of_week', 'scheduled_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function workout()
    {
        return $this->belongsTo(Workout::class);
    }
}

class Workout extends Model
{
    protected $fillable = ['name', 'description', 'type'];

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
