import { Vec2 } from '../../../shared/physics.js';
import { MechanicsLab } from './MechanicsLab.js';
import { ThermoLab } from './ThermoLab.js';
import { OpticsLab } from './OpticsLab.js';
import { ElectroLab } from './ElectroLab.js';
import { ChatController } from './ChatController.js';
import { MissionManager } from './MissionManager.js';
import { i18n } from '../../../shared/I18nManager.js';

export const translations = {
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
        sim_speed: "Скорость",
        labs_hub: "Центр Лабораторий",
        chat_bot_name: "TechPhys Помощник",
        chat_welcome: "Привет! Я твой ИИ-помощник. Задавай любые вопросы по физике или по работе симулятора!",
        chat_placeholder: "Ваш вопрос...",
        chip_newton: "Законы Ньютона",
        chip_mkt: "Что такое МКТ?",
        chip_optics: "Зеркала и линзы",
        chip_electro: "Заряды и поля",
        tutorial_title: "🚀 Быстрый старт",
        tutorial_step_1: "Выберите лабораторию во вкладках сверху. Каждая имеет свой набор инструментов.",
        tutorial_step_2: "Добавляйте объекты через левое меню. Вы можете перетаскивать их мышкой!",
        tutorial_step_3: "Следите за графиками в правой панели и экспортируйте данные в CSV.",
        tutorial_ok: "Понятно, в бой!"
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
        sim_speed: "Speed",
        labs_hub: "Labs Hub",
        chat_bot_name: "TechPhys Assistant",
        chat_welcome: "Hello! I am your AI assistant. Ask me anything about physics or how this simulator works!",
        chat_placeholder: "Your question...",
        chip_newton: "Newton's Laws",
        chip_mkt: "What is KMT?",
        chip_optics: "Lenses & Mirrors",
        chip_electro: "Charges & Fields",
        tutorial_title: "🚀 Quick Start",
        tutorial_step_1: "Select a lab in the top tabs. Each has its own toolset.",
        tutorial_step_2: "Add objects from the left menu. You can drag them directly on the canvas!",
        tutorial_step_3: "Monitor real-time charts in the right panel and export data to CSV.",
        tutorial_ok: "Got it, let's go!"
    }
};

export let currentLang = 'ru';

export const ACADEMIC_THEORY = {
    mechanics: `
        <h3>🏗️ Механика: Силы и Движение</h3>
        <p><b>1. Второй закон Ньютона:</b> Ускорение тела (a) зависит от силы (F) и массы (m): <b>F = ma</b>. В нашей симуляции тяжелые шары падают быстрее только если на них действуют дополнительные силы, в свободном падении ускорение одинаково!</p>
        <p><b>2. Энергия:</b> Сумма кинетической (движение) и потенциальной (высота) энергии сохраняется: <b>E = mv²/2 + mgh</b>.</p>
    `,
    thermo: `
        <h3>🔥 Термодинамика: Молекулы и Газ</h3>
        <p><b>1. Давление и Температура:</b> Давление газа (P) прямо пропорционально температуре (T). Чем быстрее движутся наши частицы, тем сильнее они бьют по стенкам сосуда.</p>
    `,
    optics: `
        <h3>🔦 Оптика: Лучи и Зеркала</h3>
        <p><b>1. Отражение:</b> Угол падения луча на зеркало всегда равен углу отражения. Это фундаментальный закон геометрической оптики.</p>
    `,
    electro: `
        <h3>⚡ Электростатика: Заряды</h3>
        <p><b>1. Закон Кулона:</b> Одноименные заряды (+) (+) отталкиваются, а разноименные (+) (-) притягиваются.</p>
    `
};

export class Engine {
    constructor() {
        this.canvas = document.getElementById('physics-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.activeLab = 'mechanics';
        this.labs = {};
        this.history = [];
        this.showGrid = false;
        this.rulerMode = false;
        this.rulerStart = null;
        this.rulerEnd = null;
        this.chartPoints = [];
        this.selection = null;
        this.isDragging = false;
        
        this.isPaused = false;
        this.timeScale = 1.0;
        this.lastTime = performance.now();
        
        this.themeCache = {
            canvasBg: '#05060a',
            objColor: '#ffffff',
            accent: '#00f0ff'
        };

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.updateThemeCache();
        
        const safeInit = (name, labClass) => {
            try {
                this.labs[name] = new labClass(this);
            } catch (err) {
                console.error(`Failed to init lab [${name}]:`, err);
            }
        };

        safeInit('mechanics', MechanicsLab);
        safeInit('thermo', ThermoLab);
        safeInit('optics', OpticsLab);
        safeInit('electro', ElectroLab);
        
        try {
            this.chat = new ChatController(this);
            this.missions = new MissionManager(this);
        } catch (err) {
            console.error("Failed to init Chat or Missions:", err);
        }
        
        this.setupEventListeners();
        
        window.addEventListener('techphys_theme_change', (e) => {
            const btn = document.getElementById('theme-toggle');
            if (btn) btn.innerText = e.detail.theme === 'dark' ? '🌙' : '☀️';
            this.updateThemeCache();
        });

        this.updateUI();
        this.loop();
        
        setInterval(() => this.logData(), 100);
    }

    updateThemeCache() {
        const style = getComputedStyle(document.documentElement);
        this.themeCache.canvasBg = style.getPropertyValue('--canvas-bg').trim() || '#0a0b10';
        this.themeCache.objColor = style.getPropertyValue('--obj-color').trim() || '#ffffff';
        this.themeCache.accent = style.getPropertyValue('--accent').trim() || '#00f0ff';
        
        // Update Chart font color if needed
    }

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    setupEventListeners() {
        document.body.addEventListener('click', (e) => {
            try {
                const el = e.target;
                
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
                if (el.closest('#hub-btn')) {
                    window.location.href = '../../index.html';
                    return;
                }
                if (el.id === 'lang-toggle') {
                    const next = i18n.lang === 'ru' ? 'en' : 'ru';
                    i18n.setLanguage(next);
                    return;
                }

                if (el.id === 'theme-toggle' || el.closest('#theme-toggle')) {
                    const next = i18n.theme === 'dark' ? 'light' : 'dark';
                    i18n.setTheme(next);
                    return;
                }

                if (el.closest('.tab-item')) {
                    const btn = el.closest('.tab-item');
                    document.querySelectorAll('.tab-item.active').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.clearLabState();
                    this.activeLab = btn.dataset.tab;
                    this.selection = null;
                    this.updateUI();
                    return;
                }

                if (el.closest('#grid-toggle')) {
                    this.showGrid = !this.showGrid;
                    return;
                }
                if (el.closest('#ruler-tool')) {
                    this.rulerMode = !this.rulerMode;
                    const btn = el.closest('#ruler-tool');
                    btn.classList.toggle('active', this.rulerMode);
                    if (!this.rulerMode) {
                        const display = document.getElementById('ruler-display');
                        if (display) {
                            display.innerText = "";
                            display.style.left = "-1000px";
                        }
                        this.rulerStart = this.rulerEnd = null;
                    }
                    return;
                }

                if (el.closest('#theory-btn')) {
                    const content = ACADEMIC_THEORY[this.activeLab] || "Theory for this section is coming soon.";
                    const modal = document.getElementById('theory-modal');
                    const contentEl = document.getElementById('theory-content');
                    if (contentEl) contentEl.innerHTML = content;
                    if (modal) {
                        modal.style.display = 'flex';
                        modal.classList.remove('hidden');
                    }
                    return;
                }

                if (el.closest('.modal-close') || el.classList.contains('modal-overlay')) {
                    document.querySelectorAll('.modal-overlay').forEach(m => {
                        m.classList.add('hidden');
                        m.style.display = 'none';
                    });
                }

                const toolBtn = el.closest('.tool-btn');
                if (toolBtn && toolBtn.id) {
                    const lab = this.labs[this.activeLab];
                    if (lab && lab.handleToolClick) lab.handleToolClick(toolBtn.id);
                }
            } catch (err) {
                console.error('Critical UI Click Error:', err);
            }
        });

        document.body.addEventListener('input', (e) => {
            const el = e.target;
            if (el.id === 'sim-speed') {
                this.timeScale = parseFloat(el.value);
                const label = document.getElementById('speed-val');
                if (label) label.innerText = `${this.timeScale.toFixed(1)}x`;
            }
            if (el.id === 'obj-rotate' && this.selection) {
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
            if (el.id === 'mission-diff-select') {
                this.missions.setDifficulty(el.value);
            }
        });

        const refreshBtn = document.getElementById('refresh-missions-btn');
        if (refreshBtn) {
            refreshBtn.onclick = () => this.missions.generateAIMissions(true);
        }

        if (this.canvas) {
            this.canvas.onmousedown = (e) => this.handleMouseDown(e);
            this.canvas.onmousemove = (e) => this.handleMouseMove(e);
            this.canvas.onmouseup = (e) => this.handleMouseUp(e);
        }
    }

    handleMouseDown(e) {
        const pos = new Vec2(e.offsetX, e.offsetY);
        const lab = this.labs[this.activeLab];
        
        if (this.rulerMode) {
            this.rulerStart = pos;
            this.rulerEnd = pos;
            return;
        }

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
            if (this.selection.pos) {
                this.selection.pos = new Vec2(pos.x, pos.y);
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
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[currentLang][key]) {
                el.placeholder = translations[currentLang][key];
            }
        });
    }

    clearLabState() {
        const lab = this.labs[this.activeLab];
        if (!lab) return;
        
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
            if (lab.objects) {
                const idx = lab.objects.indexOf(this.selection);
                if (idx !== -1) lab.objects.splice(idx, 1);
            }
            if (lab.charges) {
                const idx = lab.charges.indexOf(this.selection);
                if (idx !== -1) lab.charges.splice(idx, 1);
            }
            this.selection = null;
            this.updateInspector();
        } catch (e) {
            console.error("Delete Error:", e);
        }
    }

    updateInspector() {
        const panel = document.getElementById('inspector-data');
        if (!panel) return;

        if (!this.selection) {
            panel.innerHTML = `<div class="empty-state" data-i18n="no_data">${translations[currentLang].no_data}</div>`;
            return;
        }

        let html = '';
        const t = translations[currentLang];
        html += `<div class="inspector-item" style="opacity: 0.7; font-size: 0.7rem; margin-bottom: 5px;">${this.selection.type?.toUpperCase()}</div>`;

        if (this.selection.angle !== undefined) {
            const deg = Math.round(this.selection.angle * (180 / Math.PI));
            html += `<div class="inspector-item">
                <label data-i18n="angle">${t.angle}</label>
                <input type="range" id="obj-rotate" min="0" max="360" value="${deg}">
                <b>${deg}°</b>
            </div>`;
        }

        panel.innerHTML = html || `<div class="empty-state" data-i18n="no_data">${t.no_data}</div>`;
    }

    updateUI() {
        const controls = document.getElementById('dynamic-controls');
        if (!controls) return;
        
        const lab = this.labs[this.activeLab];
        if (lab && lab.getHTML) {
            controls.innerHTML = lab.getHTML();
            if (lab.bindEvents) lab.bindEvents();
        }
        
        this.chartPoints = [];
    }

    logData() {
        const lab = this.labs[this.activeLab];
        if (!lab || !lab.getDataForLog) return;
        const data = lab.getDataForLog();
        this.history.push({ t: Date.now(), ...data });
        if (this.history.length > 100) this.history.shift();

        this.chartPoints.push(data.value);
        if (this.chartPoints.length > 50) this.chartPoints.shift();
        this.drawChart();
    }

    drawChart() {
        const canvas = document.getElementById('chartCanvas');
        if (!canvas) return;
        
        if (canvas.parentElement) {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = 150;
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
    }

    loop() {
        const currentTime = performance.now();
        const dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        try {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.themeCache.canvasBg;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            if (this.showGrid) this.drawGrid();
            
            const lab = this.labs[this.activeLab];
            if (lab) {
                const effectiveDt = this.isPaused ? 0 : dt * this.timeScale;
                lab.update(effectiveDt);
                lab.draw();
            }
            
            if (this.rulerMode && this.rulerStart && this.rulerEnd) this.drawRuler();
        } catch (e) { 
            console.error("Engine crash:", e); 
        }
        requestAnimationFrame(() => this.loop());
    }

    loadScenario(type) {
        if (!type) return;

        let targetTab = 'mechanics';
        if (type === 'reflection') targetTab = 'optics';
        if (type === 'dipole') targetTab = 'electro';

        this.activeLab = targetTab;
        document.querySelectorAll('.tab-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === targetTab);
        });

        this.clearLabState();

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
        this.ctx.strokeStyle = '#00f0ff';
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.rulerStart.x, this.rulerStart.y);
        this.ctx.lineTo(this.rulerEnd.x, this.rulerEnd.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        const d = this.rulerStart.dist(this.rulerEnd);
        const display = document.getElementById('ruler-display');
        if (display) {
            display.style.left = this.rulerEnd.x + 10 + 'px';
            display.style.top = this.rulerEnd.y + 10 + 'px';
            display.innerText = `${d.toFixed(0)} px`;
        }
    }
}
