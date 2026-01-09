<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\WorkoutController;
use App\Http\Controllers\Private\ScheduleController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// PRIVATE SCOPE (Requires Auth)
Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');

    // Profile Management
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

    // SCHEDULING DOMAIN
    Route::prefix('scheduling')->name('scheduling.')->group(function () {
        Route::resource('workouts', WorkoutController::class);
        Route::resource('schedules', ScheduleController::class);
    });

});

require __DIR__.'/auth.php';
