<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Workout;

class WorkoutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $workouts = Workout::all();
        return view('private.scheduling.workouts.index', compact('workouts'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('private.scheduling.workouts.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|max:255',
        ]);

        Workout::create($validated);

        return redirect()->route('scheduling.workouts.index')->with('success', 'Workout created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Workout $workout)
    {
        return view('private.scheduling.workouts.show', compact('workout'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Workout $workout)
    {
        return view('private.scheduling.workouts.edit', compact('workout'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Workout $workout)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|max:255',
        ]);

        $workout->update($validated);

        return redirect()->route('scheduling.workouts.index')->with('success', 'Workout updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workout $workout)
    {
        $workout->delete();

        return redirect()->route('scheduling.workouts.index')->with('success', 'Workout deleted successfully.');
    }
}
