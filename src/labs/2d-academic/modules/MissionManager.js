export class MissionManager {
    constructor(engine) {
        this.engine = engine;
        this.difficulty = 'easy';
        this.aiMissions = [];
        this.lastAiFetch = null;
        
        // Base static missions for fallback
        this.staticMissions = [
            { id: 'm1', category: 'mechanics', title: { ru: "Первый закон", en: "First Law" }, desc: { ru: "Создайте шар массой более 5 кг", en: "Create a ball with mass > 5kg" }, check: () => (this.engine.labs.mechanics.objects || []).some(o => (o.m || 0) > 5), done: false },
            { id: 't1', category: 'thermo', title: { ru: "Нагрев", en: "Heating" }, desc: { ru: "Ускорьте время до 2.0x", en: "Set sim speed to 2.0x" }, check: () => this.engine.timeScale >= 2.0, done: false },
            { id: 'o1', category: 'optics', title: { ru: "Да будет свет", en: "Let there be light" }, desc: { ru: "Включите лазер в Оптике", en: "Enable laser in Optics" }, check: () => this.engine.activeLab === 'optics' && (this.engine.labs.optics.lasers || []).length > 0, done: false },
            { id: 'e1', category: 'electro', title: { ru: "Заряд", en: "Charge" }, desc: { ru: "Создайте положительный заряд", en: "Create a positive charge" }, check: () => (this.engine.labs.electro.charges || []).some(c => c.q > 0), done: false }
        ];

        this.init();
    }

    init() {
        this.loadPersistence();
        this.checkDailyReset();
        
        // Bind UI Events
        const diffSelect = document.getElementById('mission-diff-select');
        if (diffSelect) {
            diffSelect.value = this.difficulty;
            diffSelect.onchange = (e) => this.setDifficulty(e.target.value);
        }

        const refreshBtn = document.getElementById('refresh-missions-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.generateAIMissions(true);
            });
        }

        this.render();
        setInterval(() => this.update(), 1000);
        
        setTimeout(() => {
            if (this.aiMissions.length === 0) this.generateAIMissions();
        }, 2000);
    }

    setDifficulty(val) {
        this.difficulty = val;
        this.generateAIMissions(true);
    }

    checkDailyReset() {
        const today = new Date().toDateString();
        const lastDate = localStorage.getItem('techphys_mission_date');
        if (lastDate !== today) {
            this.aiMissions = [];
            localStorage.setItem('techphys_mission_date', today);
            this.savePersistence();
        }
    }

    async generateAIMissions(force = false) {
        if (!this.engine.chat) return;
        
        // Prevent spamming
        const now = Date.now();
        if (!force && this.lastAiFetch && (now - this.lastAiFetch < 60000)) return;
        this.lastAiFetch = now;

        const container = document.getElementById('mission-list');
        if (container) container.innerHTML = '<div class="loading-text">🔄 Генерируем задания от ИИ...</div>';

        const missions = await this.engine.chat.requestMissions(this.engine.activeLab, this.difficulty);
        if (missions) {
            this.aiMissions = missions.map(m => ({ ...m, done: false, type: 'ai' }));
            this.savePersistence();
            this.render();
        } else {
            console.warn("AI Missions failed, using static fallback.");
            if (container) {
                container.innerHTML = `
                    <div class="error-state">
                        <p>⚠️ Не удалось сгенерировать задания от ИИ.</p>
                        <button class="retry-btn" onclick="window.engine.missions.generateAIMissions(true)">Попробовать снова</button>
                    </div>
                `;
            }
            // Still render after a delay or just keep error
        }
    }

    update() {
        let changed = false;
        
        // Check Static
        this.staticMissions.forEach(m => {
            if (!m.done && m.check && m.check()) {
                m.done = true;
                changed = true;
                this.notify(m);
            }
        });

        // Check AI Missions (Generic logic)
        this.aiMissions.forEach(m => {
            if (!m.done && this.genericCheck(m)) {
                m.done = true;
                changed = true;
                this.notify(m);
            }
        });

        if (changed) {
            this.savePersistence();
            this.render();
        }
    }

    genericCheck(m) {
        const d = m.desc.en.toLowerCase();
        const lab = this.engine.labs[this.engine.activeLab];

        // Heuristic checks based on keywords in AI description
        if (d.includes("create") || d.includes("spawn") || d.includes("place")) {
            const count = (lab.objects?.length || 0) + (lab.particles?.length || 0) + (lab.charges?.length || 0);
            return count > 0;
        }
        if (d.includes("pause")) return this.engine.isPaused;
        if (d.includes("speed")) return this.engine.timeScale !== 1.0;
        if (d.includes("delete") || d.includes("clear")) return false; // Hard to check purely by AI text without signal

        return false;
    }

    savePersistence() {
        localStorage.setItem('techphys_ai_missions', JSON.stringify(this.aiMissions));
        localStorage.setItem('techphys_static_missions', JSON.stringify(this.staticMissions.map(m => ({id: m.id, done: m.done}))));
    }

    loadPersistence() {
        const ai = localStorage.getItem('techphys_ai_missions');
        if (ai) this.aiMissions = JSON.parse(ai);

        const stat = localStorage.getItem('techphys_static_missions');
        if (stat) {
            const savedStat = JSON.parse(stat);
            this.staticMissions.forEach(m => {
                const found = savedStat.find(s => s.id === m.id);
                if (found) m.done = found.done;
            });
        }
    }

    notify(m) {
        const lang = document.documentElement.getAttribute('lang') || 'ru';
        const msg = document.createElement('div');
        msg.className = 'mission-toast';
        msg.innerHTML = `
            <div class="icon">🏆</div>
            <div class="text">
                <div class="title">${m.title[lang]}</div>
                <div class="desc">${m.desc[lang]}</div>
            </div>
        `;
        document.body.appendChild(msg);
        setTimeout(() => msg.classList.add('show'), 100);
        setTimeout(() => {
            msg.classList.remove('show');
            setTimeout(() => msg.remove(), 500);
        }, 4000);
    }

    render() {
        const container = document.getElementById('mission-list');
        if (!container) return;

        const lang = document.documentElement.getAttribute('lang') || 'ru';
        const all = this.getAllMissions();
        
        if (all.length === 0) {
            container.innerHTML = '<div class="empty-state">Нет активных заданий</div>';
            return;
        }

        container.innerHTML = all.map(m => `
            <div class="mission-item ${m.done ? 'done' : ''} ${m.type === 'ai' ? 'ai-tag' : ''}">
                <div class="status-dot"></div>
                <div class="mission-info">
                    <div class="mission-title">${m.title[lang]} ${m.type === 'ai' ? '<span class="ai-badge">AI</span>' : ''}</div>
                    <div class="mission-desc">${m.desc[lang]}</div>
                </div>
            </div>
        `).join('');
    }

    getAllMissions() {
        const staticInCategory = this.staticMissions.filter(m => m.category === this.engine.activeLab);
        return [...staticInCategory, ...this.aiMissions];
    }

    getCurrentMissionsText() {
        const lang = document.documentElement.getAttribute('lang') || 'ru';
        const all = this.getAllMissions();
        if (all.length === 0) return "No active tasks.";
        
        return all.map((m, i) => `${i+1}. ${m.title[lang]}: ${m.desc[lang]} [Status: ${m.done ? 'Completed' : 'Active'}]`).join('\n');
    }
}
