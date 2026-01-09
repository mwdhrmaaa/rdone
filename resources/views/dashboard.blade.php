<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    @php
        $today = now()->format('l');
        $todaySchedules = Auth::user()->schedules()->where('day_of_week', $today)->with('workout')->get();
    @endphp

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <!-- Today's Stats -->
                <div class="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
                    <h3 class="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-2">Today's Workout</h3>
                    @if($todaySchedules->isNotEmpty())
                        <div class="text-3xl font-bold mb-1">
                            {{ $todaySchedules->count() }} Session(s)
                        </div>
                        <p class="text-indigo-100 text-sm italic">{{ $todaySchedules->first()->workout->name }} and more</p>
                    @else
                        <div class="text-3xl font-bold mb-1">Rest Day</div>
                        <p class="text-indigo-100 text-sm italic">Recovery is key!</p>
                    @endif
                </div>

                <!-- Quick Actions -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 col-span-2">
                    <h3 class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Quick Actions</h3>
                    <div class="flex flex-wrap gap-4">
                        <a href="{{ route('scheduling.workouts.create') }}" class="flex-1 min-w-[150px] p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-650 transition text-center group">
                            <span class="block text-indigo-600 dark:text-indigo-400 font-bold group-hover:scale-105 transition">+ Workout</span>
                            <span class="text-xs text-gray-500 italic">Create new routine</span>
                        </a>
                        <a href="{{ route('scheduling.schedules.create') }}" class="flex-1 min-w-[150px] p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-650 transition text-center group">
                            <span class="block text-indigo-600 dark:text-indigo-400 font-bold group-hover:scale-105 transition">Plan Day</span>
                            <span class="text-xs text-gray-500 italic">Add to schedule</span>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Today's Detailed Schedule -->
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100 dark:border-gray-700">
                <div class="p-8">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Today's Routine ({{ $today }})</h3>
                    @forelse($todaySchedules as $schedule)
                        <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-750 rounded-xl mb-4 last:mb-0 hover:shadow-md transition">
                            <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-4 font-bold">
                                {{ substr($schedule->workout->type, 0, 1) }}
                            </div>
                            <div class="flex-1">
                                <h4 class="font-bold text-gray-800 dark:text-gray-200">{{ $schedule->workout->name }}</h4>
                                <p class="text-sm text-gray-500">{{ $schedule->scheduled_at ? \Carbon\Carbon::parse($schedule->scheduled_at)->format('H:i') : 'Flexible Time' }} • {{ ucfirst($schedule->workout->type) }}</p>
                            </div>
                            <a href="{{ route('scheduling.workouts.show', $schedule->workout) }}" class="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">Details</a>
                        </div>
                    @empty
                        <div class="text-center py-12">
                            <div class="mb-4 text-gray-300 dark:text-gray-600">
                                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h4 class="text-gray-500 dark:text-gray-400 font-medium">No sessions scheduled for today</h4>
                            <a href="{{ route('scheduling.schedules.index') }}" class="text-indigo-600 dark:text-indigo-400 text-sm hover:underline mt-2 inline-block">View Full Schedule</a>
                        </div>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
