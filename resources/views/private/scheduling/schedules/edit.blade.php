<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Edit Scheduled Workout') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <form action="{{ route('scheduling.schedules.update', $schedule) }}" method="POST" class="max-w-xl">
                        @csrf
                        @method('PATCH')
                        <div class="mb-6">
                            <label for="workout_id" class="block text-sm font-medium mb-2">Select Workout</label>
                            <select name="workout_id" id="workout_id" required class="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                                @foreach($workouts as $workout)
                                    <option value="{{ $workout->id }}" {{ $schedule->workout_id == $workout->id ? 'selected' : '' }}>
                                        {{ $workout->name }} ({{ $workout->type }})
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div class="mb-6">
                            <label for="day_of_week" class="block text-sm font-medium mb-2">Day of Week</label>
                            <select name="day_of_week" id="day_of_week" required class="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                                @foreach(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as $day)
                                    <option value="{{ $day }}" {{ $schedule->day_of_week == $day ? 'selected' : '' }}>{{ $day }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="mb-6">
                            <label for="scheduled_at" class="block text-sm font-medium mb-2">Time (Optional)</label>
                            <input type="time" name="scheduled_at" id="scheduled_at" value="{{ $schedule->scheduled_at ? \Carbon\Carbon::parse($schedule->scheduled_at)->format('H:i') : '' }}" class="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                        </div>

                        <div class="flex items-center gap-4">
                            <button type="submit" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
                                Update Schedule
                            </button>
                            <a href="{{ route('scheduling.schedules.index') }}" class="text-sm text-gray-600 dark:text-gray-400 hover:underline">Cancel</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
