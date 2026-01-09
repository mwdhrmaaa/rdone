// App State & Data Management
const App = {
    data: {
        workouts: JSON.parse(localStorage.getItem('workouts')) || [],
        schedules: JSON.parse(localStorage.getItem('schedules')) || [],
        journals: JSON.parse(localStorage.getItem('journals')) || []
    },

    save() {
        localStorage.setItem('workouts', JSON.stringify(this.data.workouts));
        localStorage.setItem('schedules', JSON.stringify(this.data.schedules));
        localStorage.setItem('journals', JSON.stringify(this.data.journals));
        this.render();
    },

    init() {
        console.log('App Initializing...');
        // Seed data if empty
        if (this.data.workouts.length === 0) {
            this.seedData();
        }
        this.bindEvents();
        this.render();
        
        // Set default date for journal modal if it exists
        const journalDateInput = document.getElementById('journal-date');
        if (journalDateInput) {
            journalDateInput.value = new Date().toISOString().split('T')[0];
        }
    },

    seedData() {
        console.log('Seeding effective workout data...');
        const seedWorkouts = [
            { id: 'w1', name: 'Bench Press', type: 'Strength', desc: 'Chest, Shoulders, Triceps. 3 sets of 8-12 reps.' },
            { id: 'w2', name: 'Barbell Rows', type: 'Strength', desc: 'Back and Biceps. 3 sets of 10 reps.' },
            { id: 'w3', name: 'Back Squats', type: 'Strength', desc: 'Quads and Glutes. 3 sets of 8 reps.' },
            { id: 'w4', name: 'Overhead Press', type: 'Strength', desc: 'Shoulder focus. 3 sets of 10 reps.' },
            { id: 'w5', name: 'Deadlift', type: 'Strength', desc: 'Posterior chain. 3 sets of 5 reps.' },
            { id: 'w6', name: 'Pull Ups', type: 'Strength', desc: 'Back and Biceps. 3 sets to failure.' },
            { id: 'w7', name: 'Lunges', type: 'Strength', desc: 'Leg focus. 3 sets of 12 reps per leg.' },
            { id: 'w8', name: 'HIIT Session', type: 'HIIT', desc: '20 mins of high intensity intervals.' }
        ];

        const seedSchedules = [
            { id: 's1', workoutId: 'w1', workoutName: 'Bench Press', day: 'Monday', time: '07:00' },
            { id: 's2', workoutId: 'w4', workoutName: 'Overhead Press', day: 'Monday', time: '07:30' },
            { id: 's3', workoutId: 'w5', workoutName: 'Deadlift', day: 'Tuesday', time: '07:00' },
            { id: 's4', workoutId: 'w6', workoutName: 'Pull Ups', day: 'Tuesday', time: '07:30' },
            { id: 's5', workoutId: 'w3', workoutName: 'Back Squats', day: 'Wednesday', time: '07:00' },
            { id: 's6', workoutId: 'w7', workoutName: 'Lunges', day: 'Wednesday', time: '07:30' },
            { id: 's7', workoutId: 'w1', workoutName: 'Upper Body Hybrid', day: 'Friday', time: '07:00' },
            { id: 's8', workoutId: 'w2', workoutName: 'Barbell Rows', day: 'Friday', time: '07:30' },
            { id: 's9', workoutId: 'w8', workoutName: 'HIIT Cardio', day: 'Saturday', time: '09:00' }
        ];

        this.data.workouts = seedWorkouts;
        this.data.schedules = seedSchedules;
        localStorage.setItem('workouts', JSON.stringify(this.data.workouts));
        localStorage.setItem('schedules', JSON.stringify(this.data.schedules));
    },

    bindEvents() {
        // Tab Navigation
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = btn.dataset.tab;
                console.log('Switching to tab:', target);
                this.switchTab(target);
            });
        });

        // Workout Modal
        const openWorkoutBtn = document.getElementById('open-workout-modal');
        if (openWorkoutBtn) {
            openWorkoutBtn.addEventListener('click', () => this.toggleModal('workout-modal', true));
        }

        // Schedule Modal
        const openScheduleBtn = document.getElementById('open-schedule-modal');
        if (openScheduleBtn) {
            openScheduleBtn.addEventListener('click', () => {
                this.populateWorkoutDatalist();
                this.toggleModal('schedule-modal', true);
            });
        }

        // Journal Modal
        const openJournalBtn = document.getElementById('open-journal-modal');
        if (openJournalBtn) {
            openJournalBtn.addEventListener('click', () => this.toggleModal('journal-modal', true));
        }

        // Close Modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.toggleModal(modal.id, false);
            });
        });

        // Form Submissions
        this.bindForm('workout-form', () => this.addWorkout());
        this.bindForm('schedule-form', () => this.addSchedule());
        this.bindForm('journal-form', () => this.addJournal());
    },

    bindForm(id, action) {
        const form = document.getElementById(id);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                action();
            });
        }
    },

    switchTab(tabId) {
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        document.querySelectorAll('.tab-content').forEach(section => {
            section.classList.toggle('active', section.id === tabId);
        });
        const titleEl = document.getElementById('tab-title');
        if (titleEl) titleEl.textContent = tabId.charAt(0).toUpperCase() + tabId.slice(1);
    },

    toggleModal(id, show) {
        const modal = document.getElementById(id);
        if (!modal) return;
        
        modal.classList.toggle('active', show);
        if (!show) {
            const form = modal.querySelector('form');
            if (form) form.reset();
            if (id === 'journal-modal') {
                const journalDateInput = document.getElementById('journal-date');
                if (journalDateInput) journalDateInput.value = new Date().toISOString().split('T')[0];
            }
        }
    },

    // Actions
    addWorkout() {
        const name = document.getElementById('workout-name').value;
        const type = document.getElementById('workout-type').value;
        const desc = document.getElementById('workout-desc').value;

        this.data.workouts.push({ id: Date.now().toString(), name, type, desc });
        this.save();
        this.toggleModal('workout-modal', false);
    },

    deleteWorkout(id) {
        if (!confirm('Are you sure? This will remove it from library and schedule.')) return;
        this.data.workouts = this.data.workouts.filter(w => w.id !== id);
        this.data.schedules = this.data.schedules.filter(s => s.workoutId !== id);
        this.save();
    },

    addSchedule() {
        const workoutName = document.getElementById('schedule-workout-name').value;
        const day = document.getElementById('schedule-day').value;
        const time = document.getElementById('schedule-time').value;

        const match = this.data.workouts.find(w => w.name.toLowerCase() === workoutName.toLowerCase());
        this.data.schedules.push({
            id: Date.now().toString(),
            workoutName,
            workoutId: match ? match.id : null,
            day,
            time
        });
        this.save();
        this.toggleModal('schedule-modal', false);
    },

    removeSchedule(id) {
        this.data.schedules = this.data.schedules.filter(s => s.id !== id);
        this.save();
    },

    addJournal() {
        const date = document.getElementById('journal-date').value;
        const title = document.getElementById('journal-title').value;
        const content = document.getElementById('journal-content').value;

        this.data.journals.unshift({ id: Date.now().toString(), date, title, content });
        this.data.journals.sort((a, b) => new Date(b.date) - new Date(a.date));
        this.save();
        this.toggleModal('journal-modal', false);
    },

    deleteJournal(id) {
        if (!confirm('Are you sure?')) return;
        this.data.journals = this.data.journals.filter(j => j.id !== id);
        this.save();
    },

    // Rendering
    render() {
        this.renderDashboard();
        this.renderWorkoutGrid();
        this.renderWeeklySchedule();
        this.renderJournal();
    },

    renderDashboard() {
        const todayWeekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
        const todayDate = new Date().toISOString().split('T')[0];
        
        const todaySchedules = this.data.schedules.filter(s => s.day === todayWeekday);
        const todayJournal = this.data.journals.find(j => j.date === todayDate);
        
        const nameEl = document.getElementById('today-workout-name');
        const metaEl = document.getElementById('today-workout-meta');
        const listEl = document.getElementById('today-routine-list');

        if (!nameEl || !metaEl || !listEl) return;

        if (todaySchedules.length > 0) {
            const firstW = todaySchedules[0].workoutId ? this.data.workouts.find(w => w.id === todaySchedules[0].workoutId) : null;
            nameEl.textContent = firstW ? firstW.name : todaySchedules[0].workoutName;
            metaEl.textContent = todaySchedules.length > 1 ? `+ ${todaySchedules.length - 1} more scheduled` : 'Planned Routine';
            
            listEl.innerHTML = todaySchedules.map(s => {
                const w = s.workoutId ? this.data.workouts.find(work => work.id === s.workoutId) : null;
                const name = w ? w.name : s.workoutName;
                return `
                    <div class="routine-item" style="justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div class="avatar">${w ? w.type.charAt(0) : '?'}</div>
                            <div class="flex-grow">
                                <strong>${name}</strong>
                                <p class="text-sm text-secondary">${s.time || 'Planned'}</p>
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="App.quickLog('${name}')">Log It</button>
                    </div>
                `;
            }).join('');
        } else {
            nameEl.textContent = 'Rest Day';
            metaEl.textContent = 'Recovery is key';
            listEl.innerHTML = '<div class="empty-state">No workouts scheduled for today.</div>';
        }

        if (todayJournal) {
            listEl.innerHTML += `
                <div class="routine-item" style="border-left: 4px solid var(--success); margin-top: 16px; background: rgba(34, 197, 94, 0.05);">
                    <div class="avatar" style="background: var(--success); color: white;">✓</div>
                    <div class="flex-grow">
                        <strong>Logged: ${todayJournal.title}</strong>
                        <p class="text-sm text-secondary">Great job today!</p>
                    </div>
                </div>
            `;
        }

        const scheduledEl = document.getElementById('total-scheduled');
        const workoutsEl = document.getElementById('total-workouts');
        if (scheduledEl) scheduledEl.textContent = this.data.schedules.length;
        if (workoutsEl) workoutsEl.textContent = this.data.workouts.length;
    },

    renderWorkoutGrid() {
        const grid = document.getElementById('workout-grid');
        if (!grid) return;
        if (this.data.workouts.length === 0) {
            grid.innerHTML = '<div class="empty-state">No workouts in library.</div>';
            return;
        }

        grid.innerHTML = this.data.workouts.map(w => `
            <div class="workout-card">
                <div class="workout-card-header">
                    <span class="badge">${w.type}</span>
                </div>
                <h4 class="mb-2">${w.name}</h4>
                <p>${w.desc || 'No description'}</p>
                <div class="card-actions">
                    <button class="btn btn-danger btn-sm" onclick="App.deleteWorkout('${w.id}')">Delete</button>
                    <button class="btn btn-secondary btn-sm" onclick="App.quickSchedule('${w.name}')">Schedule</button>
                </div>
            </div>
        `).join('');
    },

    quickSchedule(name) {
        this.switchTab('schedule');
        this.populateWorkoutDatalist();
        this.toggleModal('schedule-modal', true);
        document.getElementById('schedule-workout-name').value = name;
    },

    quickLog(name) {
        this.switchTab('journal');
        this.toggleModal('journal-modal', true);
        document.getElementById('journal-title').value = name;
    },

    renderWeeklySchedule() {
        const daysContainer = document.getElementById('calendar-days');
        if (!daysContainer) return;
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
        
        daysContainer.innerHTML = days.map(day => {
            const daySchedules = this.data.schedules.filter(s => s.day === day);
            return `
                <div class="day-row">
                    <div class="day-name">${day} ${day === today ? '(Today)' : ''}</div>
                    <div class="day-workouts">
                        ${daySchedules.map(s => {
                            const w = s.workoutId ? this.data.workouts.find(work => work.id === s.workoutId) : null;
                            const name = w ? w.name : s.workoutName;
                            return `
                                <div class="scheduled-item">
                                    ${name} ${s.time ? ` @ ${s.time}` : ''}
                                    <span style="cursor:pointer; margin-left:8px;" onclick="App.removeSchedule('${s.id}')">×</span>
                                </div>
                            `;
                        }).join('') || '<span class="text-secondary">Rest</span>'}
                    </div>
                </div>
            `;
        }).join('');
    },

    renderJournal() {
        const list = document.getElementById('journal-list');
        if (!list) return;
        if (this.data.journals.length === 0) {
            list.innerHTML = '<div class="empty-state">No workouts logged yet. Keep moving!</div>';
            return;
        }

        list.innerHTML = this.data.journals.map(j => `
            <div class="journal-entry">
                <div class="journal-entry-header">
                    <div>
                        <span class="date-badge">${new Date(j.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <h4 style="margin-top: 16px;">${j.title}</h4>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="App.deleteJournal('${j.id}')">Delete</button>
                </div>
                <div style="background: rgba(255,255,255,0.02); padding: 16px; border-radius: 12px; font-size: 0.9375rem;">
                    <p style="margin-bottom: 0;">${j.content || 'No performance notes.'}</p>
                </div>
            </div>
        `).join('');
    },

    populateWorkoutDatalist() {
        const datalist = document.getElementById('workout-options');
        if (datalist) {
            datalist.innerHTML = this.data.workouts.map(w => `<option value="${w.name}">`).join('');
        }
    }
};

// Global Access
window.App = App;

// Safe Init
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});


