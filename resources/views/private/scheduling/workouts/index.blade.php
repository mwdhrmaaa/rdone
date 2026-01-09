<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Workout Management') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-medium">Available Workouts</h3>
                        <a href="{{ route('scheduling.workouts.create') }}" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
                            Add New Workout
                        </a>
                    </div>

                    @if($workouts->isEmpty())
                        <div class="text-center py-12">
                            <p class="text-gray-500">No workouts found. Start by creating one!</p>
                        </div>
                    @else
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            @foreach($workouts as $workout)
                                <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition duration-300">
                                    <div class="flex justify-between items-start mb-4">
                                        <h4 class="text-xl font-bold">{{ $workout->name }}</h4>
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                            {{ $workout->type }}
                                        </span>
                                    </div>
                                    <p class="text-gray-600 dark:text-gray-300 mb-6 truncate">{{ $workout->description }}</p>
                                    <div class="flex gap-2">
                                        <a href="{{ route('scheduling.workouts.edit', $workout) }}" class="text-sm text-indigo-600 hover:underline">Edit</a>
                                        <form action="{{ route('scheduling.workouts.destroy', $workout) }}" method="POST" onsubmit="return confirm('Are you sure?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="text-sm text-red-600 hover:underline">Delete</button>
                                        </form>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
