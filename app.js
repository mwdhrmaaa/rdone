// Clear old data first
localStorage.clear();

// App State & Data Management
const App = {
    data: {
        workouts: JSON.parse(localStorage.getItem('workouts')) || [],
        schedules: JSON.parse(localStorage.getItem('schedules')) || [],
        journals: JSON.parse(localStorage.getItem('journals')) || [],
        editingWorkoutId: null,
        searchQuery: ''
    },

    save() {
        localStorage.setItem('workouts', JSON.stringify(this.data.workouts));
        localStorage.setItem('schedules', JSON.stringify(this.data.schedules));
        localStorage.setItem('journals', JSON.stringify(this.data.journals));
        this.render();
    },

    init() {
        console.log('App Initializing...');
        // Collapse sidebar by default on mobile
        if (window.innerWidth <= 768) {
            document.querySelector('.app-container').classList.add('sidebar-collapsed');
        }
        // Seed data if empty
        if (this.data.workouts.length === 0) {
            this.seedData();
        }
        this.bindEvents();
        this.switchTab('schedule'); // Show the planner immediately
        this.render();
        
        // Set default date for journal modal if it exists
        const journalDateInput = document.getElementById('journal-date');
        if (journalDateInput) {
            journalDateInput.value = new Date().toISOString().split('T')[0];
        }
        this.registerServiceWorker();
    },

    seedData(force = false) {
        if (!force && this.data.workouts.length > 0) return;
        
        console.log('Seeding effective workout data...');
        const seedWorkouts = [];

        const seedSchedules = [];

        this.data.workouts = seedWorkouts;
        this.data.schedules = seedSchedules;
        this.save();
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

        this.bindForm('schedule-form', () => this.addSchedule());
        this.bindForm('journal-form', () => this.addJournal());

        // Reset App
        const resetBtn = document.getElementById('reset-app');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.showConfirm(
                    'Reset Application?', 
                    'This will clear all your schedules and logs to restart your journey.',
                    () => {
                        this.seedData(true);
                        this.render();
                        // Professional notification would go here
                    }
                );
            });
        }

        // Search Workouts
        const searchInput = document.getElementById('workout-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.data.searchQuery = e.target.value.toLowerCase();
                this.renderWorkoutGrid();
            });
        }

        // Sidebar Toggle
        const toggleBtn = document.getElementById('sidebar-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleSidebar());
        }

        const closeSidebarBtn = document.getElementById('close-sidebar');
        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', () => this.toggleSidebar());
        }

        // Close sidebar on navigation (mobile)
        document.querySelectorAll('.sidebar .nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    document.querySelector('.app-container').classList.add('sidebar-collapsed');
                }
            });
        });
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

    toggleSidebar() {
        const container = document.querySelector('.app-container');
        if (container) {
            container.classList.toggle('sidebar-collapsed');
        }
    },

    // Actions


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
        this.showConfirm(
            'Delete Log?',
            'Are you sure you want to remove this log entry?',
            () => {
                this.data.journals = this.data.journals.filter(j => j.id !== id);
                this.save();
            }
        );
    },

    showConfirm(title, message, onOk) {
        const modal = document.getElementById('confirm-modal');
        const titleEl = document.getElementById('confirm-title');
        const msgEl = document.getElementById('confirm-message');
        const okBtn = document.getElementById('confirm-ok');
        const cancelBtn = document.getElementById('confirm-cancel');

        if (!modal || !titleEl || !msgEl || !okBtn || !cancelBtn) return;

        titleEl.textContent = title;
        msgEl.textContent = message;
        modal.classList.add('active');

        // Clean up old listeners
        const newOkBtn = okBtn.cloneNode(true);
        okBtn.parentNode.replaceChild(newOkBtn, okBtn);
        
        newOkBtn.addEventListener('click', () => {
            onOk();
            modal.classList.remove('active');
        });

        cancelBtn.onclick = () => modal.classList.remove('active');
    },

    // Rendering
    render() {
        this.renderDashboard();

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
        if (scheduledEl) scheduledEl.textContent = this.data.schedules.length;
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
                <div class="day-row" onclick="App.startInlineEdit(event, '${day}')">
                    <div class="day-name">${day} ${day === today ? '<span class="text-accent">(Today)</span>' : ''}</div>
                    <div class="day-workouts" id="workouts-${day}">
                        ${daySchedules.map(s => {
                            const w = s.workoutId ? this.data.workouts.find(work => work.id === s.workoutId) : null;
                            const name = w ? w.name : s.workoutName;
                            return `
                                <div class="scheduled-item" onclick="event.stopPropagation()">
                                    <span>${name}${s.time ? ` @ ${s.time}` : ''}</span>
                                    <span class="remove-btn" onclick="App.removeSchedule('${s.id}')">×</span>
                                </div>
                            `;
                        }).join('')}
                        <span class="add-prompt">+ Click to add</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    startInlineEdit(event, day) {
        // Prevent if already editing this day
        if (document.querySelector(`.inline-schedule-input[data-day="${day}"]`)) return;

        const container = document.getElementById(`workouts-${day}`);
        const prompt = container.querySelector('.add-prompt');
        if (prompt) prompt.style.display = 'none';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'inline-schedule-input';
        input.dataset.day = day;
        input.placeholder = 'Type workout (e.g. Bench Press) and press Enter';
        
        // Add datalist support if possible
        input.setAttribute('list', 'workout-options');

        input.onclick = (e) => e.stopPropagation();
        
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                this.saveInlineSchedule(day, input.value);
            } else if (e.key === 'Escape') {
                this.renderWeeklySchedule();
            }
        };

        input.onblur = () => {
            // Delay to allow for potential clicks or just re-render
            setTimeout(() => this.renderWeeklySchedule(), 200);
        };

        container.appendChild(input);
        input.focus();
    },

    saveInlineSchedule(day, workoutName) {
        if (!workoutName.trim()) {
            this.renderWeeklySchedule();
            return;
        }

        const match = this.data.workouts.find(w => w.name.toLowerCase() === workoutName.toLowerCase());
        this.data.schedules.push({
            id: Date.now().toString(),
            workoutName: workoutName.trim(),
            workoutId: match ? match.id : null,
            day: day,
            time: '' // Inline is quick add, time can be added via modal if needed later
        });
        this.save();
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
    },

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(reg => console.log('Service Worker registered:', reg))
                    .catch(err => console.error('Service Worker registration failed:', err));
            });
        }
    }
};

// Global Access
window.App = App;

// Safe Init
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});


