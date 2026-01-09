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
        this.bindEvents();
        this.render();
        
        // Set default date for journal modal
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('journal-date').value = today;
    },

    bindEvents() {
        // Tab Navigation
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;
                this.switchTab(target);
            });
        });

        // Workout Modal
        document.getElementById('open-workout-modal').addEventListener('click', () => {
            this.toggleModal('workout-modal', true);
        });

        // Schedule Modal
        document.getElementById('open-schedule-modal').addEventListener('click', () => {
            this.populateWorkoutSelect();
            this.toggleModal('schedule-modal', true);
        });

        // Journal Modal
        document.getElementById('open-journal-modal').addEventListener('click', () => {
            this.toggleModal('journal-modal', true);
        });

        // Close Modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.toggleModal(modal.id, false);
            });
        });

        // Workout Form Submit
        document.getElementById('workout-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addWorkout();
        });

        // Schedule Form Submit
        document.getElementById('schedule-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSchedule();
        });

        // Journal Form Submit
        document.getElementById('journal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addJournal();
        });
    },

    switchTab(tabId) {
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        document.querySelectorAll('.tab-content').forEach(section => {
            section.classList.toggle('active', section.id === tabId);
        });
        document.getElementById('tab-title').textContent = tabId.charAt(0).toUpperCase() + tabId.slice(1);
    },

    toggleModal(id, show) {
        document.getElementById(id).classList.toggle('active', show);
        if (!show) {
            document.getElementById(id).querySelector('form').reset();
            // Reset journal date to today when closing
            if (id === 'journal-modal') {
                document.getElementById('journal-date').value = new Date().toISOString().split('T')[0];
            }
        }
    },

    // Workout Actions
    addWorkout() {
        const name = document.getElementById('workout-name').value;
        const type = document.getElementById('workout-type').value;
        const desc = document.getElementById('workout-desc').value;

        const newWorkout = {
            id: Date.now().toString(),
            name,
            type,
            desc
        };

        this.data.workouts.push(newWorkout);
        this.save();
        this.toggleModal('workout-modal', false);
    },

    deleteWorkout(id) {
        if (!confirm('Are you sure you want to delete this workout? It will also be removed from your schedule.')) return;
        
        this.data.workouts = this.data.workouts.filter(w => w.id !== id);
        this.data.schedules = this.data.schedules.filter(s => s.workoutId !== id);
        this.save();
    },

    // Schedule Actions
    addSchedule() {
        const workoutId = document.getElementById('schedule-workout-id').value;
        const day = document.getElementById('schedule-day').value;
        const time = document.getElementById('schedule-time').value;

        const newSchedule = {
            id: Date.now().toString(),
            workoutId,
            day,
            time
        };

        this.data.schedules.push(newSchedule);
        this.save();
        this.toggleModal('schedule-modal', false);
    },

    removeSchedule(id) {
        this.data.schedules = this.data.schedules.filter(s => s.id !== id);
        this.save();
    },

    // Journal Actions
    addJournal() {
        const date = document.getElementById('journal-date').value;
        const title = document.getElementById('journal-title').value;
        const content = document.getElementById('journal-content').value;

        const newEntry = {
            id: Date.now().toString(),
            date,
            title,
            content
        };

        this.data.journals.unshift(newEntry); // Newest first
        // Sort by date descending
        this.data.journals.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        this.save();
        this.toggleModal('journal-modal', false);
    },

    deleteJournal(id) {
        if (!confirm('Are you sure you want to delete this entry?')) return;
        this.data.journals = this.data.journals.filter(j => j.id !== id);
        this.save();
    },

    // UI Rendering
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
        
        const todayNameEl = document.getElementById('today-workout-name');
        const todayMetaEl = document.getElementById('today-workout-meta');
        const todayListEl = document.getElementById('today-routine-list');

        if (todaySchedules.length > 0) {
            const firstWorkout = this.data.workouts.find(w => w.id === todaySchedules[0].workoutId);
            todayNameEl.textContent = firstWorkout ? firstWorkout.name : 'Unknown Workout';
            todayMetaEl.textContent = todaySchedules.length > 1 ? `+ ${todaySchedules.length - 1} more scheduled` : 'Ready to go!';
            
            todayListEl.innerHTML = todaySchedules.map(s => {
                const w = this.data.workouts.find(work => work.id === s.workoutId);
                return `
                    <div class="routine-item">
                        <div class="avatar">${w ? w.type.charAt(0) : '?'}</div>
                        <div class="flex-grow">
                            <strong>${w ? w.name : 'Deleted Workout'}</strong>
                            <p class="text-sm text-secondary">${s.time || 'Flexible'}</p>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            todayNameEl.textContent = 'Rest Day';
            todayMetaEl.textContent = 'Recovery is key';
            todayListEl.innerHTML = '<div class="empty-state">No workouts scheduled for today.</div>';
        }

        // Add Journal highlight to dashboard if exists for today
        if (todayJournal) {
            todayListEl.innerHTML += `
                <div class="routine-item" style="border-left: 4px solid var(--accent-color); margin-top: 16px;">
                    <div class="avatar" style="background: var(--card-bg); border: 1px solid var(--accent-color); color: var(--accent-color);">📝</div>
                    <div class="flex-grow">
                        <strong>Log: ${todayJournal.title}</strong>
                        <p class="text-sm text-secondary">Logged today</p>
                    </div>
                </div>
            `;
        }

        document.getElementById('total-scheduled').textContent = this.data.schedules.length;
        document.getElementById('total-workouts').textContent = this.data.workouts.length;
    },

    renderWorkoutGrid() {
        const grid = document.getElementById('workout-grid');
        if (this.data.workouts.length === 0) {
            grid.innerHTML = '<div class="empty-state">No workouts in your library. Add one to get started!</div>';
            return;
        }

        grid.innerHTML = this.data.workouts.map(w => `
            <div class="workout-card">
                <div class="workout-card-header">
                    <span class="badge">${w.type}</span>
                </div>
                <h4 class="mb-2">${w.name}</h4>
                <p>${w.desc || 'No description provided'}</p>
                <div class="card-actions">
                    <button class="btn btn-danger btn-sm" onclick="App.deleteWorkout('${w.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    },

    renderWeeklySchedule() {
        const daysContainer = document.getElementById('calendar-days');
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        daysContainer.innerHTML = days.map(day => {
            const daySchedules = this.data.schedules.filter(s => s.day === day);
            return `
                <div class="day-row">
                    <div class="day-name">${day} ${day === new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()) ? '(Today)' : ''}</div>
                    <div class="day-workouts">
                        ${daySchedules.map(s => {
                            const w = this.data.workouts.find(work => work.id === s.workoutId);
                            return `
                                <div class="scheduled-item">
                                    ${w ? w.name : 'Unknown'} ${s.time ? ` @ ${s.time}` : ''}
                                    <span style="cursor:pointer; margin-left:8px;" onclick="App.removeSchedule('${s.id}')">×</span>
                                </div>
                            `;
                        }).join('') || '<span class="text-secondary">Rest</span>'}
                    </div>
                    <div class="day-actions">
                    </div>
                </div>
            `;
        }).join('');
    },

    renderJournal() {
        const list = document.getElementById('journal-list');
        if (this.data.journals.length === 0) {
            list.innerHTML = '<div class="empty-state">Your journal is empty. What did you do today?</div>';
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
                <p>${j.content}</p>
            </div>
        `).join('');
    },

    populateWorkoutSelect() {
        const select = document.getElementById('schedule-workout-id');
        if (this.data.workouts.length === 0) {
            select.innerHTML = '<option disabled>Please add a workout first</option>';
            return;
        }
        select.innerHTML = this.data.workouts.map(w => `
            <option value="${w.id}">${w.name} (${w.type})</option>
        `).join('');
    }
};

// Start the app
App.init();

// Global handles for HTML onclick attributes
window.App = App;

