<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Create Workout') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <form action="{{ route('scheduling.workouts.store') }}" method="POST" class="max-w-xl">
                        @csrf
                        <div class="mb-6">
                            <label for="name" class="block text-sm font-medium mb-2">Workout Name</label>
                            <input type="text" name="name" id="name" required class="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. Upper Body Power">
                        </div>

                        <div class="mb-6">
                            <label for="type" class="block text-sm font-medium mb-2">Type</label>
                            <select name="type" id="type" required class="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="strength">Strength</option>
                                <option value="cardio">Cardio</option>
                                <option value="flexibility">Flexibility</option>
                                <option value="hiit">HIIT</option>
                            </select>
                        </div>

                        <div class="mb-6">
                            <label for="description" class="block text-sm font-medium mb-2">Description</label>
                            <textarea name="description" id="description" rows="4" class="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Describe the workout exercises..."></textarea>
                        </div>

                        <div class="flex items-center gap-4">
                            <button type="submit" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
                                Create Workout
                            </button>
                            <a href="{{ route('scheduling.workouts.index') }}" class="text-sm text-gray-600 dark:text-gray-400 hover:underline">Cancel</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
