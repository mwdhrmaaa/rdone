<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('My Workout Schedule') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-medium">Weekly Routine</h3>
                        <a href="{{ route('scheduling.schedules.create') }}" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
                            Schedule a Workout
                        </a>
                    </div>

                    @if($schedules->isEmpty())
                        <div class="text-center py-12">
                            <p class="text-gray-500">Your schedule is empty. Time to plan some gains!</p>
                        </div>
                    @else
                        <div class="overflow-x-auto">
                            <table class="w-full text-left">
                                <thead>
                                    <tr class="border-b border-gray-200 dark:border-gray-700">
                                        <th class="pb-4 font-semibold uppercase text-xs text-gray-500">Day</th>
                                        <th class="pb-4 font-semibold uppercase text-xs text-gray-500">Workout</th>
                                        <th class="pb-4 font-semibold uppercase text-xs text-gray-500">Time</th>
                                        <th class="pb-4 font-semibold uppercase text-xs text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @php
                                        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                                    @endphp
                                    @foreach($days as $day)
                                        @php
                                            $daySchedules = $schedules->where('day_of_week', $day);
                                        @endphp
                                        <tr class="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                                            <td class="py-4 font-bold">{{ $day }}</td>
                                            <td class="py-4">
                                                @forelse($daySchedules as $schedule)
                                                    <div class="mb-2 last:mb-0 flex items-center gap-2">
                                                        <span class="inline-block px-2 py-0.5 rounded text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200">
                                                            {{ $schedule->workout->name }}
                                                        </span>
                                                    </div>
                                                @empty
                                                    <span class="text-gray-400 text-sm">Rest Day</span>
                                                @endforelse
                                            </td>
                                            <td class="py-4 text-gray-600 dark:text-gray-400">
                                                @foreach($daySchedules as $schedule)
                                                    <div class="mb-2 last:mb-0">
                                                        {{ $schedule->scheduled_at ? \Carbon\Carbon::parse($schedule->scheduled_at)->format('H:i') : 'Anytime' }}
                                                    </div>
                                                @endforeach
                                            </td>
                                            <td class="py-4">
                                                <div class="flex gap-3">
                                                    @foreach($daySchedules as $schedule)
                                                        <a href="{{ route('scheduling.schedules.edit', $schedule) }}" class="text-indigo-600 hover:text-indigo-800 text-sm">Edit</a>
                                                        <form action="{{ route('scheduling.schedules.destroy', $schedule) }}" method="POST" onsubmit="return confirm('Remove from schedule?')">
                                                            @csrf
                                                            @method('DELETE')
                                                            <button type="submit" class="text-red-600 hover:text-red-800 text-sm">Remove</button>
                                                        </form>
                                                    @endforeach
                                                </div>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
