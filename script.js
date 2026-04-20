/**
 * TechPhys Sandbox Ultimate - Final Polish Edition
 * Lead EdTech Developer & Senior Frontend Engineer
 */

// --- TRANSLATIONS DICTIONARY ---
const translations = {
    ru: {
        mechanics: "Механика",
        thermo: "Термодинамика",
        optics: "Оптика",
        electro: "Электростатика",
        theory: "Теория",
        start_lab: "Начать лабораторную",
        presets: "🚀 ГОТОВЫЕ СЦЕНАРИИ",
        select_scenario: "Выбрать сценарий...",
        preset_pendulum: "Маятник (Механика)",
        preset_reflection: "Отражение (Оптика)",
        preset_dipole: "Диполь (Электростатика)",
        tools: "🛠️ ИНСТРУМЕНТЫ",
        toggle_grid: "Сетка: Вкл/Выкл",
        ruler: "Линейка",
        how_it_works: "Как это работает?",
        inspector: "Инспектор",
        no_data: "Нет данных",
        chart_title: "График в реальном времени",
        export: "Экспорт & Отчет",
        tasks: "Задания",
        theory_title: "База Знаний",
        create_ball: "⚽ Создать шар",
        create_spring: "➰ Создать пружину",
        charge_pos: "➕ Заряд (+)",
        charge_neg: "➖ Заряд (-)",
        stiffness: "Жесткость (k)",
        mass: "Масса (m)",
        angle: "Угол (α)",
        sim_control: "⏱️ УПРАВЛЕНИЕ",
        sim_speed: "Скорость",
        labs_hub: "Центр Лабораторий"
    },
    en: {
        mechanics: "Mechanics",
        thermo: "Thermodynamics",
        optics: "Optics",
        electro: "Electrostatics",
        theory: "Theory",
        start_lab: "Start Lab",
        presets: "🚀 PRESETS",
        select_scenario: "Select Scenario...",
        preset_pendulum: "Pendulum (Mechanics)",
        preset_reflection: "Reflection (Optics)",
        preset_dipole: "Dipole (Electrostatics)",
        tools: "🛠️ TOOLS",
        toggle_grid: "Grid: ON/OFF",
        ruler: "Ruler",
        how_it_works: "How it works?",
        inspector: "Inspector",
        no_data: "No data",
        chart_title: "Real-time Chart",
        export: "Export & Report",
        tasks: "Tasks",
        theory_title: "Knowledge Base",
        create_ball: "⚽ Create Ball",
        create_spring: "➰ Create Spring",
        charge_pos: "➕ Charge (+)",
        charge_neg: "➖ Charge (-)",
        stiffness: "Stiffness (k)",
        mass: "Mass (m)",
        angle: "Angle (α)",
        sim_control: "⏱️ SIM CONTROL",
        sim_speed: "Speed",
        labs_hub: "Labs Hub"
    }
};

let currentLang = 'ru';

// --- MATH UTILITIES ---
class Vec2 {
    constructor(x = 0, y = 0) { this.x = x; this.y = y; }
    add(v) { return new Vec2(this.x + v.x, this.y + v.y); }
    sub(v) { return new Vec2(this.x - v.x, this.y - v.y); }
    mult(s) { return new Vec2(this.x * s, this.y * s); }
    mag() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    unit() { const m = this.mag(); return m ? this.mult(1 / m) : new Vec2(); }
    dist(v) { return this.sub(v).mag(); }
    dot(v) { return this.x * v.x + this.y * v.y; }
    reflect(normal) {
        const d = this;
        return d.sub(normal.mult(2 * d.dot(normal)));
    }
}

// --- THEORY DATABASE ---
const ACADEMIC_THEORY = {
    mechanics: `
        <h3>🏗️ Механика: Силы и Движение</h3>
        <p><b>1. Второй закон Ньютона:</b> Ускорение тела (a) зависит от силы (F) и массы (m): <b>F = ma</b>. В нашей симуляции тяжелые шары падают быстрее только если на них действуют дополнительные силы, в свободном падении ускорение одинаково!</p>
        <p><b>2. Энергия:</b> Сумма кинетической (движение) и потенциальной (высота) энергии сохраняется: <b>E = mv²/2 + mgh</b>.</p>
        <div class="theory-tip">💡 Попробуйте создать маятник через меню сценариев и проследить за графиком скорости!</div>
    `,
    thermo: `
        <h3>🔥 Термодинамика: Молекулы и Газ</h3>
        <p><b>1. Давление и Температура:</b> Давление газа (P) прямо пропорционально температуре (T). Чем быстрее движутся наши частицы, тем сильнее они бьют по стенкам сосуда.</p>
        <p><b>2. Изопроцессы:</b> Уменьшение объема при постоянной температуре ведет к росту давления (Закон Бойля-Мариотта).</p>
        <div class="theory-tip">💡 Изменяйте температуру ползунком слева и следите за цветом и скоростью частиц.</div>
    `,
    optics: `
        <h3>🔦 Оптика: Лучи и Зеркала</h3>
        <p><b>1. Отражение:</b> Угол падения луча на зеркало всегда равен углу отражения. Это фундаментальный закон геометрической оптики.</p>
        <p><b>2. Преломление:</b> При переходе в более плотную среду (стеклянная призма) луч отклоняется. В TechPhys призма имитирует этот процесс.</p>
        <div class="theory-tip">💡 Перетаскивайте лазер (красный круг) и вращайте зеркала в инспекторе, чтобы поймать луч!</div>
    `,
    electro: `
        <h3>⚡ Электростатика: Заряды</h3>
        <p><b>1. Закон Кулона:</b> Одноименные заряды (+) (+) отталкиваются, а разноименные (+) (-) притягиваются.</p>
        <p><b>2. Линии поля:</b> Векторы на фоне показывают, куда бы двигался положительный заряд в данной точке.</p>
        <div class="theory-tip">💡 Создайте диполь (плюс и минус) через сценарии и изучите структуру поля.</div>
    `
};

// --- CORE ENGINE ---
class Engine {
    constructor() {
        this.canvas = document.getElementById('physics-canvas');
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.activeLab = 'mechanics';
        this.labs = {};
        this.history = []; // Academic data buffer (10s at 10Hz)
        this.showGrid = false;
        this.rulerMode = false;
        this.rulerStart = null;
        this.rulerEnd = null;
        this.chartPoints = [];
        this.selection = null;
        this.isDragging = false;
        
        // --- SIM CONTROL (RC PROGRESS) ---
        this.isPaused = false;
        this.timeScale = 1.0;
        this.lastTime = performance.now();
        
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Modules
        this.labs.mechanics = new MechanicsLab(this);
        this.labs.thermo = new ThermoLab(this);
        this.labs.optics = new OpticsLab(this);
        this.labs.electro = new ElectroLab(this);
        
        this.chat = new ChatController(this);
        
        this.setupEventListeners();
        this.updateUI();
        this.loop();
        
        // Data logging interval (10Hz)
        setInterval(() => this.logData(), 100);
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    setupEventListeners() {
        // GLOBAL UI DELEGATION (RELEASE CANDIDATE FINAL)
        document.body.addEventListener('click', (e) => {
            try {
                const el = e.target;
                
                // Simulation Control
                if (el.closest('#play-pause-btn')) {
                    const btn = el.closest('#play-pause-btn');
                    this.isPaused = !this.isPaused;
                    btn.innerHTML = this.isPaused ? '▶' : '⏸';
                    return;
                }
                if (el.closest('#delete-btn')) {
                    this.deleteSelected();
                    return;
                }
                if (el.closest('#clear-all-btn')) {
                    this.clearLabState();
                    return;
                }

                // Language Toggle
                if (el.id === 'lang-toggle') {
                    currentLang = currentLang === 'ru' ? 'en' : 'ru';
                    el.innerText = currentLang.toUpperCase();
                    this.updateLanguage();
                    this.updateUI(); // Refresh tools
                    return;
                }

                // Tab switching
                if (el.closest('.tab-item')) {
                    const btn = el.closest('.tab-item');
                    document.querySelectorAll('.tab-item.active').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.clearLabState(); // Safe switch
                    this.activeLab = btn.dataset.tab;
                    this.selection = null;
                    this.updateUI();
                    return;
                }

                // Tools (Grid, Ruler)
                if (el.closest('#grid-toggle')) {
                    this.showGrid = !this.showGrid;
                    return;
                }
                if (el.closest('#ruler-tool')) {
                    this.rulerMode = !this.rulerMode;
                    const btn = el.closest('#ruler-tool');
                    btn.classList.toggle('active', this.rulerMode);
                    if (!this.rulerMode) {
                        document.getElementById('ruler-display').innerText = "";
                        // BUGFIX: Clear coordinates on tool disable
                        this.rulerStart = this.rulerEnd = null;
                        document.getElementById('ruler-display').style.left = "-1000px";
                    }
                    return;
                }

                // Hub Trigger
                if (el.closest('#hub-btn')) {
                    const modal = document.getElementById('hub-modal');
                    if (modal) {
                        modal.style.display = 'flex';
                        modal.classList.remove('hidden');
                    }
                    return;
                }

                // Modal Triggers (Resurrection Fix)
                if (el.closest('#theory-btn')) {
                    const content = ACADEMIC_THEORY[this.activeLab] || "Theory for this section is coming soon.";
                    const modal = document.getElementById('theory-modal');
                    document.getElementById('theory-content').innerHTML = content;
                    modal.style.display = 'flex';
                    modal.classList.remove('hidden');
                    return;
                }
                if (el.closest('#tutorial-btn')) {
                    const modal = document.getElementById('tutorial-modal');
                    modal.style.display = 'flex';
                    modal.classList.remove('hidden');
                    return; 
                }
                if (el.id === 'lang-toggle') {
                    currentLang = currentLang === 'ru' ? 'en' : 'ru';
                    el.innerText = currentLang.toUpperCase();
                    this.updateLanguage();
                    this.updateUI();
                    return;
                }

                // Modal Close Logic
                if (el.closest('.modal-close') || el.closest('.next-btn') || el.closest('.close-btn') || el.classList.contains('modal-overlay')) {
                    document.querySelectorAll('.modal-overlay').forEach(m => {
                        m.classList.add('hidden');
                        m.style.display = 'none';
                    });
                }

                if (el.closest('#export-csv-btn')) { this.exportCSV(); return; }
                if (el.closest('#screenshot-btn')) { this.takeScreenshot(); return; }

                // Dynamic Tool Clicks (Spawn Objects)
                const toolBtn = el.closest('.tool-btn');
                if (toolBtn && toolBtn.id) {
                    const lab = this.labs[this.activeLab];
                    if (lab && lab.handleToolClick) lab.handleToolClick(toolBtn.id);
                }
            } catch (err) {
                console.error('Critical UI Click Error:', err);
            }
        });

        // Inspector & Select Updates (Real-time RC Fix)
        document.body.addEventListener('input', (e) => {
                try {
                    const el = e.target;
                    if (el.id === 'sim-speed') {
                        this.timeScale = parseFloat(el.value);
                        const label = document.getElementById('speed-val');
                        if (label) label.innerText = `${this.timeScale.toFixed(1)}x`;
                    }
                    if (el.id === 'obj-rotate' && this.selection) {
                        // Rotation Bug Fix: Immediate update on input
                        this.selection.angle = parseFloat(el.value) * (Math.PI / 180);
                    }
                    if (el.id === 'obj-stiffness' && this.selection) {
                        this.selection.k = parseFloat(el.value);
                    }
                    if (el.id === 'obj-mass' && this.selection) {
                        this.selection.m = parseFloat(el.value);
                    }
                    if (el.id === 'scenario-select') {
                        this.loadScenario(el.value);
                    }
                    if (el.id === 't-temp') {
                        this.labs.thermo.temp = el.value;
                    }
                } catch (err) {
                    console.error('Input Update Error:', err);
                }
            });

        // Event for select (backup)
        const scenarioSelect = document.getElementById('scenario-select');
        if (scenarioSelect) {
            scenarioSelect.addEventListener('change', (e) => this.loadScenario(e.target.value));
        }

        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.onclick = () => {
                const current = document.documentElement.getAttribute('data-theme') || 'dark';
                const target = current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', target);
                themeBtn.innerText = target === 'dark' ? '🌙' : '☀️';
            };
        }

        // Canvas Interaction
        this.canvas.onmousedown = (e) => this.handleMouseDown(e);
        this.canvas.onmousemove = (e) => this.handleMouseMove(e);
        this.canvas.onmouseup = (e) => this.handleMouseUp(e);
    }

    handleMouseDown(e) {
        const pos = new Vec2(e.offsetX, e.offsetY);
        const lab = this.labs[this.activeLab];
        
        if (this.rulerMode) {
            this.rulerStart = pos;
            this.rulerEnd = pos;
            return;
        }

        // Global Selection & Dragging Fix
        const found = lab.getAtPos ? lab.getAtPos(pos) : null;
        if (found) {
            this.selection = found;
            this.isDragging = true;
        } else {
            this.selection = null;
        }
        this.updateInspector();
    }

    handleMouseMove(e) {
        const pos = new Vec2(e.offsetX, e.offsetY);
        if (this.rulerMode && this.rulerStart) {
            this.rulerEnd = pos;
        } else if (this.isDragging && this.selection) {
            // Unified Drag & Drop (Supports Optic Prisms, Charges, Balls, Mirrors)
            if (this.selection.pos) {
                this.selection.pos = new Vec2(pos.x, pos.y);
            } else if (this.selection.p1 && this.selection.p2) {
                // Legacy segment dragging fallback
                const center = this.selection.p1.add(this.selection.p2).mult(0.5);
                const delta = pos.sub(center);
                this.selection.p1 = this.selection.p1.add(delta);
                this.selection.p2 = this.selection.p2.add(delta);
            }
        }
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    updateLanguage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                if (el.tagName === 'OPTION') el.text = translations[currentLang][key];
                else el.textContent = translations[currentLang][key];
            }
        });
    }

    clearLabState() {
        const lab = this.labs[this.activeLab];
        if (!lab) return;
        
        // Reset specific lab collections but preserve background rendering logic
        if (lab.objects) lab.objects = [];
        if (lab.charges) lab.charges = [];
        if (lab.particles) lab.particles = [];
        if (lab.lasers) lab.lasers = [];
        
        this.selection = null;
        this.updateInspector();
    }

    deleteSelected() {
        if (!this.selection) return;
        const lab = this.labs[this.activeLab];
        
        try {
            // Mechanics: Balls, Springs
            if (lab.objects) {
                const idx = lab.objects.indexOf(this.selection);
                if (idx !== -1) {
                    const deleted = lab.objects.splice(idx, 1)[0];
                    // If mass is deleted, remove attached springs
                    if (deleted.type === 'ball') {
                        lab.objects = lab.objects.filter(o => o.type !== 'spring' || o.pivot !== deleted.pos);
                    }
                }
            }
            // Electro: Charges
            if (lab.charges) {
                const idx = lab.charges.indexOf(this.selection);
                if (idx !== -1) lab.charges.splice(idx, 1);
            }
            // Optics: Objects (Mirrors/Prisms)
            if (this.activeLab === 'optics' && lab.objects) {
                const idx = lab.objects.indexOf(this.selection);
                if (idx !== -1) lab.objects.splice(idx, 1);
            }
            
            this.selection = null;
            this.updateInspector();
        } catch (e) {
            console.error("Delete Error:", e);
        }
    }

    updateInspector() {
        const panel = document.getElementById('inspector-data');
        if (!this.selection) {
            panel.innerHTML = `<div class="empty-state" data-i18n="no_data">${translations[currentLang].no_data}</div>`;
            return;
        }

        let html = '';
        const t = translations[currentLang];

        // Object Type Label
        html += `<div class="inspector-item" style="opacity: 0.7; font-size: 0.7rem; margin-bottom: 5px;">${this.selection.type.toUpperCase()}</div>`;

        if (this.selection.angle !== undefined) {
            const deg = Math.round(this.selection.angle * (180 / Math.PI));
            html += `<div class="inspector-item">
                <label data-i18n="angle">${t.angle}</label>
                <input type="range" id="obj-rotate" min="0" max="360" value="${deg}">
                <b>${deg}°</b>
            </div>`;
        }

        if (this.selection.k !== undefined) {
             html += `<div class="inspector-item">
                <label data-i18n="stiffness">${t.stiffness}</label>
                <input type="range" id="obj-stiffness" min="1" max="20" value="${this.selection.k}">
                <b>${this.selection.k} N/m</b>
            </div>`;
        }

        if (this.selection.m !== undefined) {
             html += `<div class="inspector-item">
                <label data-i18n="mass">${t.mass}</label>
                <div style="display:flex; gap:10px; align-items:center">
                    <input type="range" id="obj-mass" min="1" max="50" value="${this.selection.m}" style="flex:1">
                    <b style="min-width:40px">${this.selection.m}кг</b>
                </div>
            </div>`;
        }

        panel.innerHTML = html || `<div class="empty-state" data-i18n="no_data">${t.no_data}</div>`;
    }

    updateUI() {
        const controls = document.getElementById('dynamic-controls');
        if (!controls) return; // Robustness fix for initialization
        
        const lab = this.labs[this.activeLab];
        if (lab && lab.getHTML) {
            controls.innerHTML = lab.getHTML();
        }
        
        // Clean chart for mode switch
        this.chartPoints = [];
    }

    logData() {
        const lab = this.labs[this.activeLab];
        const data = lab.getDataForLog();
        this.history.push({ t: Date.now(), ...data });
        if (this.history.length > 100) this.history.shift(); // Keep last 10s

        // Update Charts
        this.chartPoints.push(data.value);
        if (this.chartPoints.length > 50) this.chartPoints.shift();
        this.drawChart();
    }

    drawChart() {
        const canvas = document.getElementById('chartCanvas');
        if (!canvas) return;
        
        // --- FIX: Sync internal resolution with parent dimensions ---
        if (canvas.parentElement) {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = 150; // Fixed height in px
        }
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (this.chartPoints.length < 2) return;
        
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const max = Math.max(...this.chartPoints) || 1;
        const min = Math.min(...this.chartPoints) || 0;
        const range = (max - min) || 1;

        this.chartPoints.forEach((p, i) => {
            const x = (i / 49) * canvas.width;
            const y = canvas.height - ((p - min) / range) * canvas.height;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
        
        // Add a subtle glow
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00f0ff';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // --- NEW: Chart Labels & Axis ---
        const style = getComputedStyle(document.documentElement);
        const textColor = style.getPropertyValue('--text-secondary').trim();
        ctx.fillStyle = textColor;
        ctx.font = '10px Outfit';
        ctx.fillText(max.toFixed(1), 5, 12);
        ctx.fillText(min.toFixed(1), 5, canvas.height - 5);
        
        // Vertical axis line
        ctx.strokeStyle = style.getPropertyValue('--glass-border').trim();
        ctx.beginPath();
        ctx.moveTo(30, 0); ctx.lineTo(30, canvas.height);
        ctx.stroke();
    }

    exportCSV() {
        let csv = "Timestamp,Parameter1,Parameter2\n";
        this.history.forEach(h => { csv += `${h.t},${h.val1},${h.val2}\n`; });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `techphys_${this.activeLab}_data.csv`;
        a.click();
    }

    takeScreenshot() {
        const temp = document.createElement('canvas');
        temp.width = this.canvas.width;
        temp.height = this.canvas.height;
        const tctx = temp.getContext('2d');
        tctx.drawImage(this.canvas, 0, 0);
        
        // Watermark
        tctx.fillStyle = "rgba(255,255,255,0.5)";
        tctx.font = "bold 20px Outfit";
        tctx.fillText("TechPhys Ultimate", 20, temp.height - 20);
        
        const link = document.createElement('a');
        link.download = 'snapshot.png';
        link.href = temp.toDataURL();
        link.click();
    }

    loop() {
        const currentTime = performance.now();
        const dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        try {
            // CRITICAL: Clear canvas first to prevent ghosting
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            const style = getComputedStyle(document.documentElement);
            const canvasBg = style.getPropertyValue('--canvas-bg').trim() || '#0a0b10';
            this.ctx.fillStyle = canvasBg;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            if (this.showGrid) this.drawGrid();
            
            const lab = this.labs[this.activeLab];
            if (lab) {
                const effectiveDt = this.isPaused ? 0 : dt * this.timeScale;
                lab.update(effectiveDt);
                lab.draw();
            }
            
            if (this.rulerMode && this.rulerStart && this.rulerEnd) this.drawRuler();
        } catch (e) { console.error("Engine crash:", e); }
        requestAnimationFrame(() => this.loop());
    }

    loadScenario(type) {
        if (!type) return;

        // 1. SMART SWITCH: Determine and switch laboratory tab first
        let targetTab = 'mechanics';
        if (type === 'reflection') targetTab = 'optics';
        if (type === 'dipole') targetTab = 'electro';

        // Update active lab state and UI classes
        this.activeLab = targetTab;
        document.querySelectorAll('.tab-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === targetTab);
        });

        // 2. SAFE CLEAR: Clear all states before spawning scenario objects
        Object.values(this.labs).forEach(lab => {
            if (lab.objects) lab.objects = [];
            if (lab.particles) lab.particles = [];
            if (lab.charges) lab.charges = [];
        });

        // 3. SPAWN: Initialize scenario specific objects
        if (type === 'pendulum') {
            const center = this.canvas.width / 2;
            this.labs.mechanics.objects.push({ 
                pos: new Vec2(center + 100, 250), 
                pivot: new Vec2(center, 50), 
                angle: Math.PI / 4,
                angleVel: 0,
                angleAccel: 0,
                length: 220,
                type: 'pendulum'
            });
        } else if (type === 'reflection') {
            this.labs.optics.objects = [
                { pos: new Vec2(500, 300), length: 450, angle: 1.1, type: 'mirror' },
                { pos: new Vec2(700, 300), type: 'prism', angle: 0.5 }
            ];
        } else if (type === 'dipole') {
            const centerW = this.canvas.width / 2;
            const centerH = this.canvas.height / 2;
            this.labs.electro.charges = [
                { pos: new Vec2(centerW - 100, centerH), q: 100 },
                { pos: new Vec2(centerW + 100, centerH), q: -100 }
            ];
        }

        this.updateUI();
        this.selection = null;
        this.updateInspector();
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        this.ctx.lineWidth = 1;
        const step = 50;
        for(let x=0; x<this.canvas.width; x+=step) {
            this.ctx.beginPath(); this.ctx.moveTo(x,0); this.ctx.lineTo(x, this.canvas.height); this.ctx.stroke();
        }
        for(let y=0; y<this.canvas.height; y+=step) {
            this.ctx.beginPath(); this.ctx.moveTo(0,y); this.ctx.lineTo(this.canvas.width, y); this.ctx.stroke();
        }
    }

    drawRuler() {
        this.ctx.strokeStyle = 'var(--accent)';
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.rulerStart.x, this.rulerStart.y);
        this.ctx.lineTo(this.rulerEnd.x, this.rulerEnd.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        const d = this.rulerStart.dist(this.rulerEnd);
        const meters = (d / 100).toFixed(2);
        const display = document.getElementById('ruler-display');
        display.style.left = this.rulerEnd.x + 10 + 'px';
        display.style.top = this.rulerEnd.y + 10 + 'px';
        display.innerText = `${d.toFixed(0)} px | ${meters} m`;
    }
}

// --- MODULE: MECHANICS ---
class MechanicsLab {
    constructor(engine) {
        this.engine = engine; this.ctx = engine.ctx;
        this.objects = []; this.gravity = 9.8; this.time = 0;
    }
    update(dt) {
        if (!dt) return;
        this.time += dt;
        this.objects.forEach(o => {
            if (o.type === 'ball') {
                o.vel.y += this.gravity * 20 * dt;
                o.pos = o.pos.add(o.vel.mult(dt));
                if (o.pos.y > this.engine.canvas.height - 20) { o.pos.y = this.engine.canvas.height - 20; o.vel.y *= -0.7; }
            } else if (o.type === 'pendulum') {
                // Pendulum physics: alpha = -(g/L) * sin(theta)
                const L = o.length || 200;
                const pivot = o.pivot || new Vec2(this.engine.canvas.width/2, 50);
                o.angleAccel = -(this.gravity * 2 / L) * Math.sin(o.angle);
                o.angleVel += o.angleAccel * dt * 60;
                o.angleVel *= Math.pow(0.99, dt * 60); 
                o.angle += o.angleVel * dt * 60;
                o.pos = new Vec2(
                    pivot.x + Math.sin(o.angle) * L,
                    pivot.y + Math.cos(o.angle) * L
                );
            } else if (o.type === 'spring') {
                const pivot = o.pivot || new Vec2(o.pos.x, 50);
                const restLen = o.restLen || 150;
                const k = o.k || 5; 
                const m = o.m || 10;
                
                const currentLen = o.pos.y - pivot.y;
                const x = currentLen - restLen;
                const force = -k * x;
                const accel = force / m + this.gravity;
                
                o.vel.y += accel * dt * 60;
                o.vel.y *= Math.pow(0.98, dt * 60);
                o.pos.y += o.vel.y * dt * 60;
                
                if (o.pos.y > this.engine.canvas.height - 20) {
                    o.pos.y = this.engine.canvas.height - 20;
                    o.vel.y *= -0.5;
                }
            }
        });
    }
    draw() {
        this.ctx.shadowBlur = 0;
        const style = getComputedStyle(document.documentElement);
        const objColor = style.getPropertyValue('--obj-color').trim();
        
        this.objects.forEach(o => {
            const isSelected = o === this.engine.selection;
            
            if (isSelected) {
                this.ctx.save();
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = '#00f0ff';
                this.ctx.strokeStyle = '#00f0ff';
                this.ctx.lineWidth = 3;
            }

            if (o.type === 'pendulum') {
                const pivot = o.pivot || new Vec2(this.engine.canvas.width/2, 50);
                this.ctx.strokeStyle = isSelected ? '#00f0ff' : objColor;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath(); this.ctx.moveTo(pivot.x, pivot.y); this.ctx.lineTo(o.pos.x, o.pos.y); this.ctx.stroke();
            } else if (o.type === 'spring') {
                const pivot = o.pivot || new Vec2(o.pos.x, 50);
                this.ctx.strokeStyle = isSelected ? '#00f0ff' : '#3b82f6';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(pivot.x, pivot.y);
                const steps = 15;
                for(let i=1; i<=steps; i++) {
                    const py = pivot.y + (o.pos.y - pivot.y) * (i/steps);
                    const px = pivot.x + (i % 2 === 0 ? 15 : -15);
                    this.ctx.lineTo(px, py);
                }
                this.ctx.lineTo(o.pos.x, o.pos.y);
                this.ctx.stroke();
            }
            
            this.ctx.fillStyle = isSelected ? '#00f0ff' : '#ffffff';
            this.ctx.beginPath(); this.ctx.arc(o.pos.x, o.pos.y, 20, 0, 7); this.ctx.fill();
            if (isSelected) {
                this.ctx.stroke();
                this.ctx.restore();
            }
        });
    }
    getAtPos(pos) {
        return this.objects.find(o => o.pos.dist(pos) < 25);
    }
    getHTML() { 
        return `
            <div class="sidebar-group-label" data-i18n="tools">ИНСТРУМЕНТЫ</div>
            <button class="tool-btn" id="m-ball" data-i18n="create_ball">⚽ Создать шар</button>
            <button class="tool-btn" id="m-spring" data-i18n="create_spring">➰ Создать пружину</button>
        `; 
    }
    handleToolClick(id) {
        // FIXED COORDINATES: spawn ball in the upper middle area
        const spawnX = this.engine.canvas.width / 2;
        const spawnY = 100; 
        if (id === 'm-ball') {
            this.objects.push({ pos: new Vec2(spawnX, spawnY), vel: new Vec2((Math.random()-0.5)*50, 0), type: 'ball'});
        } else if (id === 'm-spring') {
            this.objects.push({ 
                pos: new Vec2(spawnX, 250), pivot: new Vec2(spawnX, 50), 
                vel: new Vec2(0, 0), type: 'spring', k: 5, m: 10, restLen: 150 
            });
        }
    }
    getDataForLog() { 
        const v = this.objects.length ? Math.abs(this.objects[0].vel.y) : 0;
        return { val1: v, val2: this.gravity, value: v }; 
    }
}

// --- MODULE: THERMODYNAMICS ---
class ThermoLab {
    constructor(engine) {
        this.engine = engine; this.ctx = engine.ctx;
        this.particles = []; this.temp = 300; this.vol = 0.8;
        for(let i=0; i<30; i++) this.particles.push({ pos: new Vec2(300, 300), vel: new Vec2((Math.random()-0.5)*10, (Math.random()-0.5)*10)});
    }
    update(dt) {
        if (!dt) return;
        const w = this.engine.canvas.width * this.vol;
        const x0 = (this.engine.canvas.width - w) / 2;
        this.particles.forEach(p => {
            p.pos = p.pos.add(p.vel.mult((this.temp/300) * dt * 60));
            if (p.pos.x < x0 || p.pos.x > x0 + w) p.vel.x *= -1;
            if (p.pos.y < 50 || p.pos.y > this.engine.canvas.height - 50) p.vel.y *= -1;
        });
    }
    draw() {
        const w = this.engine.canvas.width * this.vol;
        const x0 = (this.engine.canvas.width - w) / 2;
        this.ctx.strokeStyle = 'rgba(255,255,255,0.1)'; 
        this.ctx.strokeRect(x0, 50, w, this.engine.canvas.height - 100);
        this.particles.forEach(p => {
            const isSelected = p === this.engine.selection;
            if (isSelected) {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#00f0ff';
                this.ctx.strokeStyle = '#00f0ff';
                this.ctx.lineWidth = 2;
            }
            this.ctx.fillStyle = `hsl(${240 - (this.temp-100)}, 100%, 50%)`;
            this.ctx.beginPath(); this.ctx.arc(p.pos.x, p.pos.y, 4, 0, 7); this.ctx.fill();
            if (isSelected) this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        });
    }
    getAtPos(pos) {
        return this.particles.find(p => p.pos.dist(pos) < 10);
    }
    getHTML() { return `<div class="sidebar-group-label">СРЕДА</div><input type="range" id="t-temp" min="100" max="500" value="300">`; }
    bindEvents() { 
        const t = document.getElementById('t-temp');
        if (t) t.oninput = e => this.temp = e.target.value; 
    }
    getDataForLog() { return { val1: this.temp, val2: this.vol, value: this.temp * (1/this.vol) }; }
}

// --- MODULE: OPTICS (RAYCASTING) ---
class OpticsLab {
    constructor(engine) {
        this.engine = engine; this.ctx = engine.ctx;
        // Mirrors now use center pos + angle + length for better interaction
        this.objects = [{pos: new Vec2(550, 250), length: 300, angle: 0.2, type:'mirror'}];
        this.laser = { pos: new Vec2(50, 300), type: 'laser' };
    }
    update(dt) {}
    draw() {
        const style = getComputedStyle(document.documentElement);
        const objColor = style.getPropertyValue('--obj-color').trim();

        // Laser Source (Draggable)
        const isLaserSelected = this.laser === this.engine.selection;
        const laserPos = this.laser.pos || this.laser; // Robust fallback
        if (isLaserSelected) {
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = '#00f0ff';
        }
        this.ctx.fillStyle = isLaserSelected ? '#00f0ff' : 'red'; 
        this.ctx.beginPath(); 
        this.ctx.arc(laserPos.x, laserPos.y, 12, 0, 7); 
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        let rayPos = new Vec2(laserPos.x, laserPos.y);
        let rayDir = new Vec2(1, 0);
        
        this.ctx.strokeStyle = '#f00';
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = 'red';
        this.ctx.beginPath();
        this.ctx.moveTo(rayPos.x, rayPos.y);

        for(let i=0; i<10; i++) {
            let nearest = null;
            let minDist = 2000;
            
            this.objects.forEach(obj => {
                const hits = this.getIntersections(rayPos, rayDir, obj);
                hits.forEach(hit => {
                    if (hit.dist < minDist) { minDist = hit.dist; nearest = { hit, obj }; }
                });
            });

            if (nearest) {
                const hitPoint = rayPos.add(rayDir.mult(nearest.hit.dist));
                this.ctx.lineTo(hitPoint.x, hitPoint.y);
                rayPos = hitPoint;
                
                // Reflection/Refraction
                if (nearest.obj.type === 'mirror') {
                    const normal = nearest.hit.normal;
                    rayDir = rayDir.reflect(normal);
                } else if (nearest.obj.type === 'prism') {
                    // Simplified refraction for prism
                    rayDir = new Vec2(rayDir.x, rayDir.y + 0.2).unit();
                }
            } else {
                const endPos = rayPos.add(rayDir.mult(2000));
                this.ctx.lineTo(endPos.x, endPos.y);
                break;
            }
        }
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;

        // Draw Objects
        this.objects.forEach(o => {
            const isSelected = o === this.engine.selection;
            if (isSelected) {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = '#00f0ff';
                this.ctx.strokeStyle = '#00f0ff';
                this.ctx.lineWidth = 4;
            } else {
                this.ctx.strokeStyle = objColor;
                this.ctx.lineWidth = 2;
            }

            if (o.type === 'mirror' || o.type === 'prism') {
                const pts = o.type === 'mirror' ? this.getMirrorPoints(o) : this.getPrismPoints(o);
                this.ctx.beginPath();
                this.ctx.moveTo(pts[0].x, pts[0].y);
                for(let k=1; k<pts.length; k++) this.ctx.lineTo(pts[k].x, pts[k].y);
                if (o.type === 'prism') this.ctx.closePath();
                this.ctx.stroke();
            }
            this.ctx.shadowBlur = 0;
        });
    }

    getMirrorPoints(o) {
        if (o.p1 && o.p2) return [o.p1, o.p2]; // Backwards compatibility
        if (!o.pos) return [new Vec2(0,0), new Vec2(0,0)]; // Safety fallback
        const halfLen = (o.length || 200) / 2;
        const angle = o.angle || 0;
        const p1 = new Vec2(o.pos.x - Math.cos(angle) * halfLen, o.pos.y - Math.sin(angle) * halfLen);
        const p2 = new Vec2(o.pos.x + Math.cos(angle) * halfLen, o.pos.y + Math.sin(angle) * halfLen);
        return [p1, p2];
    }
    
    getPrismPoints(o) {
        if (!o.pos) return [new Vec2(0,0), new Vec2(0,0), new Vec2(0,0)]; // Safety
        const s = 60; // size
        const angle = o.angle || 0;
        const p1 = new Vec2(Math.cos(angle) * s, Math.sin(angle) * s).add(o.pos);
        const p2 = new Vec2(Math.cos(angle + 2.094) * s, Math.sin(angle + 2.094) * s).add(o.pos);
        const p3 = new Vec2(Math.cos(angle + 4.188) * s, Math.sin(angle + 4.188) * s).add(o.pos);
        return [p1, p2, p3];
    }

    getIntersections(ro, rd, obj) {
        const hits = [];
        if (obj.type === 'mirror') {
            const pts = this.getMirrorPoints(obj);
            const h = this.intersect(ro, rd, pts[0], pts[1]);
            if (h) {
                const norm = new Vec2(-(pts[1].y - pts[0].y), pts[1].x - pts[0].x).unit();
                hits.push({ dist: h.dist, normal: norm });
            }
        } else if (obj.type === 'prism') {
            const pts = this.getPrismPoints(obj);
            for (let i = 0; i < 3; i++) {
                const p1 = pts[i];
                const p2 = pts[(i + 1) % 3];
                const h = this.intersect(ro, rd, p1, p2);
                if (h) {
                    const norm = new Vec2(-(p2.y - p1.y), p2.x - p1.x).unit();
                    hits.push({ dist: h.dist, normal: norm });
                }
            }
        }
        return hits;
    }

    intersect(ro, rd, p1, p2) {
        const v1 = ro.sub(p1); const v2 = p2.sub(p1); const v3 = new Vec2(-rd.y, rd.x);
        const dot = v2.dot(v3); if (Math.abs(dot) < 0.001) return null;
        const t1 = (v2.x * v1.y - v2.y * v1.x) / dot;
        const t2 = v1.dot(v3) / dot;
        if (t1 > 0.001 && t2 >= 0 && t2 <= 1) return { dist: t1 };
        return null;
    }

    getAtPos(pos) {
        // Laser check
        if (this.laser.pos.dist(pos) < 20) return this.laser;
        
        return this.objects.find(o => {
            if (o.type === 'mirror') {
                const pts = this.getMirrorPoints(o);
                // Better Line-Point hit detection
                const dist = this.distToSegment(pos, pts[0], pts[1]);
                return dist < 20;
            }
            if (o.type === 'prism') return pos.dist(o.pos) < 50;
            return false;
        });
    }

    distToSegment(p, a, b) {
        const l2 = a.dist(b)**2;
        if (l2 === 0) return p.dist(a);
        let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return p.dist(new Vec2(a.x + t * (b.x - a.x), a.y + t * (b.y - a.y)));
    }

    getHTML() { return `
        <div class="sidebar-group-label">ИНСТРУМЕНТЫ</div>
        <button class="tool-btn" id="o-mirror">➕ Зеркало</button>
        <button class="tool-btn" id="o-prism">➕ Призма</button>
    `; }
    handleToolClick(id) {
        const cx = this.engine.canvas.width / 2;
        const cy = this.engine.canvas.height / 2;
        if (id === 'o-mirror') {
            this.objects.push({pos: new Vec2(cx, cy), length: 200, type:'mirror', angle: 0});
        }
        if (id === 'o-prism') {
            this.objects.push({pos: new Vec2(cx, cy), type:'prism', angle: 0});
        }
    }
    getDataForLog() { return { val1: 0, val2: 0, value: 0 }; }
}

// --- MODULE: ELECTROSTATICS (VECTOR FIELD) ---
class ElectroLab {
    constructor(engine) {
        this.engine = engine; this.ctx = engine.ctx;
        this.charges = [{pos: new Vec2(400, 300), q: 100}, {pos: new Vec2(600, 300), q: -100}];
    }
    update() {}
    draw() {
        this.drawVectorField();
        this.charges.forEach(c => {
            const isSelected = c === this.engine.selection;
            if (isSelected) {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = '#00f0ff';
                this.ctx.strokeStyle = '#00f0ff';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath(); this.ctx.arc(c.pos.x, c.pos.y, 18, 0, 7); this.ctx.stroke();
            }
            
            this.ctx.fillStyle = c.q > 0 ? '#ef4444' : '#3b82f6';
            this.ctx.beginPath(); this.ctx.arc(c.pos.x, c.pos.y, 15, 0, 7); this.ctx.fill();
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.font = 'bold 14px Outfit';
            this.ctx.fillText(c.q > 0 ? '+' : '-', c.pos.x, c.pos.y + 5);
            this.ctx.shadowBlur = 0;
        });
    }
    drawVectorField() {
        const step = 40;
        for(let x=step/2; x<this.engine.canvas.width; x+=step) {
            for(let y=step/2; y<this.engine.canvas.height; y+=step) {
                let E = new Vec2();
                this.charges.forEach(c => {
                    let r = new Vec2(x, y).sub(c.pos);
                    let distSq = r.x*r.x + r.y*r.y;
                    if (distSq > 100) {
                        // Correct vector math: Magnitude proportional to Q/R^2, direction is R_unit
                        E = E.add(r.unit().mult(c.q / distSq * 5000));
                    }
                });
                
                let mag = E.mag(); 
                if(mag < 0.1) continue;
                let len = Math.min(mag, 20);
                let d = E.unit().mult(len);
                const objColor = getComputedStyle(document.documentElement).getPropertyValue('--obj-color').trim();
                this.ctx.strokeStyle = objColor;
                this.ctx.globalAlpha = Math.min(mag/10, 0.3);
                this.ctx.beginPath(); this.ctx.moveTo(x, y); this.ctx.lineTo(x+d.x, y+d.y); this.ctx.stroke();
                this.ctx.globalAlpha = 1.0;
            }
        }
    }
    getHTML() { 
        return `
            <div class="sidebar-group-label" data-i18n="tools">ИНСТРУМЕНТЫ</div>
            <button class="tool-btn" id="e-pos" data-i18n="charge_pos">➕ Заряд (+)</button>
            <button class="tool-btn" id="e-neg" data-i18n="charge_neg">➖ Заряд (-)</button>
        `; 
    }
    handleToolClick(id) {
        const cx = this.engine.canvas.width / 2;
        const cy = this.engine.canvas.height / 2;
        if (id === 'e-pos') {
            this.charges.push({pos: new Vec2(cx + (Math.random()-0.5)*100, cy), q: 100}); 
        } else if (id === 'e-neg') {
            this.charges.push({pos: new Vec2(cx + (Math.random()-0.5)*100, cy), q: -100}); 
        }
    }
    getAtPos(pos) {
        return this.charges.find(c => c.pos.dist(pos) < 30);
    }
    getDataForLog() { return { val1: this.charges.length, val2: 0, value: this.charges.length }; }
}

// --- CHAT CONTROLLER (BUG FIX #1 & #2) ---
class ChatController {
    constructor(engine) {
        this.engine = engine;
        this.setup();
    }
    setup() {
        const wrapper = document.getElementById('chat-container');
        const reopenBtn = document.getElementById('chat-reopen-btn');
        
        const headerToggle = document.getElementById('chat-header-toggle');
        if (headerToggle) {
            headerToggle.onclick = () => document.getElementById('chat-window').classList.toggle('closed');
        }
        
        document.getElementById('chat-close').onclick = () => {
            wrapper.style.display = 'none';
        };

        if (reopenBtn) {
            reopenBtn.onclick = () => {
                wrapper.style.display = 'block';
                document.getElementById('chat-window').classList.remove('closed');
            };
        }

        document.getElementById('chat-send').onclick = () => this.send();
        document.getElementById('chat-input').onkeydown = (e) => { if(e.key === 'Enter') this.send(); };
        document.querySelectorAll('.chat-chip').forEach(c => {
            c.onclick = () => { document.getElementById('chat-input').value = c.innerText; this.send(); };
        });
    }
    send() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim(); if(!text) return;
        this.addMsg(text, 'user'); input.value = '';
        setTimeout(() => this.addMsg(this.getSmartResponse(text), 'bot'), 600);
    }
    getSmartResponse(q) {
        const low = q.toLowerCase();
        if (low.includes("ньютон")) return "Законы Ньютона — фундамент механики. 1-й: инерция; 2-й: F=ma; 3-й: действие равно противодействию. В нашей симуляции 2-й закон работает при каждом взаимодействии объектов!";
        if (low.includes("мкт") || low.includes("газ")) return "Молекулярно-кинетическая теория объясняет макросвойства газа движением молекул. Температура в симуляции задает скорость частиц, а давление — частоту их ударов о стенки.";
        if (low.includes("снеллиус") || low.includes("отражен") || low.includes("зеркал") || low.includes("линз")) return "Оптика в TechPhys поддерживает зеркальное отражение и преломление в призмах. Используйте лазер и зеркала, чтобы увидеть ход лучей!";
        if (low.includes("заряд") || low.includes("поле") || low.includes("кулон")) return "Закон Кулона определяет силу взаимодействия зарядов. В нашей лаборатории электростатики вы видите векторное поле, которое показывает направление этой силы в каждой точке.";
        if (low.includes("как") || low.includes("помощ") || low.includes("инструкц")) return "Все просто! Выберите лабораторию сверху, добавьте объекты кнопками слева и перетаскивайте их мышкой. Следите за параметрами в инспекторе!";
        return "Интересный вопрос! На нашей платформе вы можете проверить это экспериментально прямо сейчас.";
    }
    addMsg(t, s) {
        const box = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.className = `message ${s}`; div.innerText = t;
        box.appendChild(div); box.scrollTop = box.scrollHeight;
    }
}

// MISSION SYSTEM REMOVED AS PER UI CLEANUP REQUEST

// --- TUTORIAL MANAGER ---
class TutorialManager {
    constructor() {
        this.modal = document.getElementById('tutorial-modal');
        this.okBtn = document.getElementById('tutorial-ok');
        this.closeBtn = document.getElementById('close-tutorial');
        this.triggerBtn = document.getElementById('tutorial-btn');
        
        this.setup();
        this.checkAutoShow();
    }
    setup() {
        if (this.okBtn) this.okBtn.onclick = () => this.hide();
        if (this.closeBtn) this.closeBtn.onclick = () => this.hide();
        if (this.triggerBtn) this.triggerBtn.onclick = () => this.show();
    }
    checkAutoShow() {
        if (!localStorage.getItem('techphys_tutorial_viewed')) {
            setTimeout(() => this.show(), 4500); // Show after preloader
        }
    }
    show() { this.modal.classList.remove('hidden'); }
    hide() { 
        this.modal.classList.add('hidden');
        localStorage.setItem('techphys_tutorial_viewed', 'true');
    }
}

// --- MODULE: LOADER ENGINE (Particle Network) ---
class LoaderEngine {
    constructor() {
        this.canvas = document.getElementById('loaderCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.count = 80;
        this.active = true;
        
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    init() {
        this.resize();
        for (let i = 0; i < this.count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        if (!this.active) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            let p1 = this.particles[i];
            p1.x += p1.vx; p1.y += p1.vy;
            
            if (p1.x < 0 || p1.x > this.canvas.width) p1.vx *= -1;
            if (p1.y < 0 || p1.y > this.canvas.height) p1.vy *= -1;
            
            this.ctx.fillStyle = '#00f0ff';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#00f0ff';
            this.ctx.beginPath();
            this.ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            for (let j = i + 1; j < this.particles.length; j++) {
                let p2 = this.particles[j];
                let dist = Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
                if (dist < 120) {
                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${1 - dist/120})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
        requestAnimationFrame(() => this.animate());
    }

    stop() { 
        this.active = false; 
        this.canvas.style.display = 'none';
    }
}

window.onload = () => {
    const loader = new LoaderEngine();

    // Hide preloader with a premium delay
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                loader.stop();
            }, 1000);
        }
    }, 3500);

    window.engine = new Engine();
    window.tutorial = new TutorialManager();
};
