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
        chart_title: "График",
        export: "Экспорт & Отчет",
        tasks: "Задания",
        theory_title: "База Знаний",
        create_ball: "⚽ Создать шар",
        create_spring: "➰ Создать пружину",
        create_pillar: "⚓ Создать опору",
        create_slope: "📐 Создать наклон",
        charge_pos: "➕ Заряд (+)",
        charge_neg: "➖ Заряд (-)",
        stiffness: "Жесткость (k)",
        mass: "Масса (m)",
        angle: "Угол (α)",
        sim_speed: "Скорость",
        labs_hub: "Главная страница",
        chat_bot_name: "TechPhys Помощник",
        chat_welcome: "Привет! Я твой ИИ-помощник. Задавай любые вопросы по физике или по работе симулятора!",
        chat_placeholder: "Ваш вопрос...",
        chip_newton: "Законы Ньютона",
        chip_mkt: "Что такое МКТ?",
        chip_optics: "Зеркала и линзы",
        chip_electro: "Заряды и поля",
        tutorial_title: "🚀 ТехФизика: Быстрый старт",
        tutorial_step_1: "<b>Инструменты:</b> Слева выбирайте объекты и сценарии. Их можно перетаскивать прямо на холсте.",
        tutorial_step_2: "<b>Управление:</b> Кнопка паузы внизу слева останавливает время. Рядом — удаление и очистка.",
        tutorial_step_3: "<b>Теория:</b> Нажмите кнопку «Теория» вверху для доступа к формулам и справке по текущей теме.",
        tutorial_step_4: "<b>Графики:</b> Справа в реальном времени строятся зависимости. Данные можно скачать в CSV.",
        tutorial_step_5: "<b>Темы и Язык:</b> Верхние кнопки переключают RU/EN и День/Ночь для вашего комфорта.",
        tutorial_ok: "Всё понятно, приступим!",
        title_hub: "Вернуться на главную страницу портала",
        title_theory: "Посмотреть формулы и теорию",
        title_help: "Открыть чат с ИИ-помощником",
        title_lang: "Переключить язык (RU/EN)",
        title_theme: "Переключить тему (День/Ночь)",
        pinned: "Закрепить предмет",
        chart_speed: "Скорость (v)",
        chart_height: "Высота (h)",
        chart_energy: "Энергия (E)",
        chart_temp: "Температура (T)",
        chart_pressure: "Давление (P)",
        chart_volume: "Объем (V)",
        chart_force: "Сила (F)",
        chart_potential: "Потенциал (φ)"
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
        chart_title: "Graph",
        export: "Export & Report",
        tasks: "Tasks",
        theory_title: "Knowledge Base",
        create_ball: "⚽ Create Ball",
        create_spring: "➰ Create Spring",
        create_pillar: "⚓ Create Pillar",
        create_slope: "📐 Create Slope",
        charge_pos: "➕ Charge (+)",
        charge_neg: "➖ Charge (-)",
        stiffness: "Stiffness (k)",
        mass: "Mass (m)",
        angle: "Angle (α)",
        sim_speed: "Speed",
        labs_hub: "Home Page",
        chat_bot_name: "TechPhys Assistant",
        chat_welcome: "Hello! I am your AI assistant. Ask me anything about physics or how this simulator works!",
        chat_placeholder: "Your question...",
        chip_newton: "Newton's Laws",
        chip_mkt: "What is KMT?",
        chip_optics: "Lenses & Mirrors",
        chip_electro: "Charges & Fields",
        tutorial_title: "🚀 TechPhys: Quick Start",
        tutorial_step_1: "<b>Tools:</b> Select objects and presets on the left. Drag them directly on the canvas.",
        tutorial_step_2: "<b>Controls:</b> Use the pause button (bottom-left) to stop time. Delete/Clear are nearby.",
        tutorial_step_3: "<b>Theory:</b> Click the 'Theory' button above for formulas and references.",
        tutorial_step_4: "<b>Charts:</b> Real-time data logs on the right. Download records via CSV button.",
        tutorial_step_5: "<b>Settings:</b> Use top toggles for RU/EN and Dark/Light modes.",
        tutorial_ok: "Got it, let's start!",
        title_hub: "Return to the main portal page",
        title_theory: "View formulas and theory",
        title_help: "Open AI assistant chat",
        title_lang: "Switch language (RU/EN)",
        title_theme: "Switch theme (Day/Night)",
        pinned: "Pin Object",
        chart_speed: "Velocity (v)",
        chart_height: "Height (h)",
        chart_energy: "Energy (E)",
        chart_temp: "Temperature (T)",
        chart_pressure: "Pressure (P)",
        chart_volume: "Volume (V)",
        chart_force: "Force (F)",
        chart_potential: "Potential (φ)"
    }
};

export let currentLang = 'ru';

export const ACADEMIC_THEORY = {
    mechanics: `
        <div class="theory-section">
            <h3>🏗️ Механика: Фундаментальные законы</h3>
            <div class="formula-box">F = m · a</div>
            <p><b>Второй закон Ньютона:</b> Ускорение тела прямо пропорционально равнодействующей всех сил и обратно пропорционально его массе.</p>
            
            <div class="formula-box">E_k = (m · v²) / 2</div>
            <p><b>Кинетическая энергия:</b> Энергия движения. Зависит от массы и квадрата скорости.</p>
            
            <div class="formula-box">E_p = m · g · h</div>
            <p><b>Потенциальная энергия:</b> Энергия в поле тяжести, зависящая от высоты (h).</p>
            
            <div class="formula-box">g ≈ 9.81 м/с²</div>
            <p><b>Ускорение свободного падения:</b> Константа, определяющая силу тяжести на Земле.</p>
        </div>
    `,
    thermo: `
        <div class="theory-section">
            <h3>🔥 Термодинамика: МКТ и Теплота</h3>
            <div class="formula-box">P · V = n · R · T</div>
            <p><b>Уравнение Менделеева-Клапейрона:</b> Связывает давление, объем и температуру идеального газа.</p>
            
            <div class="formula-box">Q = c · m · ΔT</div>
            <p><b>Количество теплоты:</b> Энергия, необходимая для нагрева тела массой (m) на разность температур (ΔT).</p>
            
            <div class="formula-box">v_rms = √(3kT / m)</div>
            <p><b>Среднеквадратичная скорость:</b> Скорость движения молекул в зависимости от температуры.</p>
        </div>
    `,
    optics: `
        <div class="theory-section">
            <h3>🔦 Оптика: Геометрические законы</h3>
            <div class="formula-box">α = β</div>
            <p><b>Закон отражения:</b> Угол падения равен углу отражения от зеркальной поверхности.</p>
            
            <div class="formula-box">n₁ · sin(α) = n₂ · sin(γ)</div>
            <p><b>Закон Снеллиуса:</b> Описывает преломление света на границе двух сред.</p>
            
            <div class="formula-box">1/F = 1/d + 1/f</div>
            <p><b>Формула тонкой линзы:</b> Отношение фокусного расстояния (F), расстояния до предмета (d) и до изображения (f).</p>
        </div>
    `,
    electro: `
        <div class="theory-section">
            <h3>⚡ Электростатика: Поля и Заряды</h3>
            <div class="formula-box">F = k · (|q₁| · |q₂|) / r²</div>
            <p><b>Закон Кулона:</b> Сила взаимодействия между точечными зарядами в вакууме.</p>
            
            <div class="formula-box">E = F / q</div>
            <p><b>Напряженность поля:</b> Силовая характеристика электрического поля в данной точке.</p>
            
            <div class="formula-box">φ = W / q</div>
            <p><b>Потенциал:</b> Энергетическая характеристика поля, равная отношению потенциальной энергии к заряду.</p>
        </div>
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
        this.chartType = 'speed';
        this.chartHistory = [];
        this.chartMaxHistory = 100;
        this.selection = null;
        this.selectionPart = null;
        this.isDragging = false;
        
        this.isPaused = false;
        this.timeScale = 1.0;
        this.lastTime = performance.now();
        
        this.currentLang = i18n.lang;
        this.themeCache = {
            canvasBg: i18n.theme === 'dark' ? '#05060a' : '#ffffff',
            objColor: i18n.theme === 'dark' ? '#ffffff' : '#1e293b',
            accent: '#3b82f6'
        };

        this.init();
    }

    get activeLabInstance() {
        return this.labs[this.activeLab];
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

        this.updateLanguage();
        this.updateUI();
        this.loop();
        
        setInterval(() => this.logData(), 100);
    }

    updateThemeCache() {
        const style = getComputedStyle(document.documentElement);
        this.themeCache.canvasBg = style.getPropertyValue('--canvas-bg').trim() || (i18n.theme === 'dark' ? '#07080c' : '#ffffff');
        this.themeCache.objColor = style.getPropertyValue('--obj-color').trim() || (i18n.theme === 'dark' ? '#ffffff' : '#1e293b');
        this.themeCache.accent = style.getPropertyValue('--accent').trim() || '#3b82f6';
        
        // Ensure chart and other elements update their colors
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
                // Header Controls (Hub, Lang, Theme) are handled by PremiumControls.js to avoid delegation issues.

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

                // Theory modal handled via CustomEvent 'techphys_theory_click' to avoid conflicts.

                if (el.closest('#export-csv-btn')) {
                    this.exportCSV();
                    return;
                }

                if (el.closest('#clear-chart-btn')) {
                    this.chartHistory = [];
                    this.chartPoints = [];
                    this.history = [];
                    this.drawChart();
                    return;
                }

                if (el.closest('#screenshot-btn')) {
                    this.takeScreenshot();
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
                const val = parseFloat(el.value);
                this.selection.angle = val * (Math.PI / 180);
                const b = el.parentElement.querySelector('b');
                if (b) b.innerText = `${val}°`;
            }
            if (el.id === 'obj-stiffness' && this.selection) {
                const val = parseFloat(el.value);
                this.selection.k = val;
                const b = el.parentElement.querySelector('b');
                if (b) b.innerText = val;
            }
            if (el.id === 'obj-mass' && this.selection) {
                const val = parseFloat(el.value);
                this.selection.m = val;
                const b = el.parentElement.querySelector('b');
                if (b) b.innerText = val;
            }
            if (el.id === 'obj-pinned' && this.selection) {
                this.selection.pinned = el.checked;
            }
            if (el.id === 'obj-friction' && this.selection) {
                const val = parseFloat(el.value);
                this.selection.friction = val;
                const b = el.parentElement.querySelector('b');
                if (b) b.innerText = val;
            }
            if (el.id === 'scenario-select') {
                this.loadScenario(el.value);
            }
            if (el.id === 'mission-diff-select') {
                this.missions.setDifficulty(el.value);
            }
            if (el.id === 'chart-data-select') {
                this.chartType = el.value;
                this.chartPoints = [];
                this.chartHistory = [];
            }
        });

        const refreshBtn = document.getElementById('refresh-missions-btn');
        if (refreshBtn) {
            refreshBtn.onclick = () => this.missions.generateAIMissions(true);
        }

        window.addEventListener('techphys_theory_click', () => {
            const content = ACADEMIC_THEORY[this.activeLab] || "Theory content unavailable.";
            const modal = document.getElementById('theory-modal');
            const contentEl = document.getElementById('theory-content');
            if (contentEl) contentEl.innerHTML = content;
            if (modal) {
                modal.style.display = 'flex';
                modal.classList.remove('hidden');
            }
        });

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
            // Support for complex objects that return { obj, part }
            if (found.obj && found.part) {
                this.selection = found.obj;
                this.selectionPart = found.part;
            } else {
                this.selection = found;
                this.selectionPart = null;
            }
            this.isDragging = true;
        } else {
            this.selection = null;
            this.selectionPart = null;
        }
        this.updateInspector();
    }

    handleMouseMove(e) {
        const pos = new Vec2(e.offsetX, e.offsetY);
        if (this.rulerMode && this.rulerStart) {
            this.rulerEnd = pos;
        } else if (this.isDragging && this.selection) {
            const lab = this.labs[this.activeLab];
            if (lab && lab.handleDrag) {
                lab.handleDrag(this.selection, this.selectionPart, pos);
            } else if (this.selection.pos) {
                // Default drag logic
                const radius = 20;
                const maxX = this.canvas.width - radius;
                const maxY = this.canvas.height - radius;
                
                this.selection.pos = new Vec2(
                    Math.max(radius, Math.min(pos.x, maxX)),
                    Math.max(radius, Math.min(pos.y, maxY))
                );

                // Ensure velocity is zeroed during drag
                if (this.selection.vel) {
                    this.selection.vel = new Vec2(0, 0);
                }
            }
        }
    }

    handleMouseUp(e) {
        if (this.isDragging && this.selection) {
            const lab = this.labs[this.activeLab];
            const pos = new Vec2(e.offsetX, e.offsetY);
            if (lab && lab.onMouseUp) {
                lab.onMouseUp(this.selection, this.selectionPart, pos);
            }
        }
        this.isDragging = false;
        this.selectionPart = null;
    }

    updateLanguage() {
        const lang = i18n.lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = translations[lang][key];
            if (translation) {
                if (el.tagName === 'OPTION') {
                    el.text = translation;
                } else {
                    if (el.hasAttribute('data-i18n-html')) {
                        el.innerHTML = translation;
                    } else {
                        el.textContent = translation;
                    }
                }
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (translations[lang][key]) {
                el.title = translations[lang][key];
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
        const t = translations[i18n.lang];
        html += `<div class="inspector-item" style="opacity: 0.7; font-size: 0.7rem; margin-bottom: 5px;">${this.selection.type?.toUpperCase()}</div>`;

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
                <input type="range" id="obj-stiffness" min="1" max="50" value="${this.selection.k}">
                <b>${this.selection.k}</b>
            </div>`;
        }
        if (this.selection.m !== undefined) {
            html += `<div class="inspector-item">
                <label data-i18n="mass">${t.mass}</label>
                <input type="range" id="obj-mass" min="1" max="100" value="${this.selection.m}">
                <b>${this.selection.m}</b>
            </div>`;
        }
        if (this.selection.pinned !== undefined || this.selection.type === 'ball') {
            const isPinned = this.selection.pinned || false;
            html += `<div class="inspector-item checkbox">
                <label data-i18n="pinned">${t.pinned}</label>
                <input type="checkbox" id="obj-pinned" ${isPinned ? 'checked' : ''}>
            </div>`;
        }
        if (this.selection.friction !== undefined) {
            html += `<div class="inspector-item">
                <label>Friction</label>
                <input type="range" id="obj-friction" min="0" max="1" step="0.01" value="${this.selection.friction}">
                <b>${this.selection.friction}</b>
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
        
        this.updateChartSelect();
    }

    updateChartSelect() {
        const select = document.getElementById('chart-data-select');
        if (!select) return;

        const lab = this.labs[this.activeLab];
        const options = lab.getChartOptions ? lab.getChartOptions() : [];
        
        select.innerHTML = options.map(opt => `
            <option value="${opt.id}">${translations[this.currentLang][opt.label] || opt.label}</option>
        `).join('');

        if (options.length > 0) {
            this.chartType = options[0].id;
        }
        this.chartPoints = [];
        this.chartHistory = [];
    }

    logData() {
        const lab = this.labs[this.activeLab];
        if (!lab || !lab.getDataForLog) return;
        
        const data = lab.getDataForLog();
        const t = Date.now();
        
        // Add to persistent history for export
        this.history.push({ t, ...data });
        if (this.history.length > 500) this.history.shift();

        // Extract value for the specific chart type
        let val = null;
        if (this.chartType === 'energy') {
            // Special case: energy usually returns { kinetic, potential, total }
            val = data.energy || { kinetic: 0, potential: 0, total: 0 };
        } else {
            val = data[this.chartType] || 0;
        }

        this.chartHistory.push({ t, val });
        if (this.chartHistory.length > this.chartMaxHistory) this.chartHistory.shift();
        
        this.drawChart();
    }

    drawChart() {
        const canvas = document.getElementById('chartCanvas');
        if (!canvas || !canvas.parentElement) return;
        
        const rect = canvas.parentElement.getBoundingClientRect();
        if (rect.width === 0) return;

        canvas.width = rect.width;
        canvas.height = rect.height;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (this.chartHistory.length < 2) {
            ctx.fillStyle = this.themeCache.objColor;
            ctx.globalAlpha = 0.3;
            ctx.textAlign = 'center';
            ctx.fillText(translations[this.currentLang].no_data, canvas.width/2, canvas.height/2);
            return;
        }

        const padding = { top: 20, bottom: 20, left: 40, right: 10 };
        const w = canvas.width - padding.left - padding.right;
        const h = canvas.height - padding.top - padding.bottom;

        // Determine range
        let min = Infinity;
        let max = -Infinity;

        this.chartHistory.forEach(point => {
            const val = point.val;
            if (typeof val === 'object') {
                Object.values(val).forEach(v => {
                    min = Math.min(min, v);
                    max = Math.max(max, v);
                });
            } else {
                min = Math.min(min, val);
                max = Math.max(max, val);
            }
        });

        if (max === min) { max = min + 1; min = min - 1; }
        const range = max - min;

        // Draw Grid
        ctx.strokeStyle = this.themeCache.objColor;
        ctx.globalAlpha = 0.05;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (i / 4) * h;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(canvas.width - padding.right, y);
            ctx.stroke();
        }

        // Draw Labels
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = this.themeCache.objColor;
        ctx.font = '10px Outfit';
        ctx.textAlign = 'right';
        ctx.fillText(max.toFixed(1), padding.left - 5, padding.top + 5);
        ctx.fillText(min.toFixed(1), padding.left - 5, padding.top + h + 5);

        // Draw Legend for multi-line
        if (this.chartType === 'energy') {
            const colors = { kinetic: '#3b82f6', potential: '#f472b6', total: '#22d3ee' };
            let lx = padding.left + 5;
            Object.keys(colors).forEach(k => {
                ctx.fillStyle = colors[k];
                ctx.fillRect(lx, 5, 8, 8);
                ctx.fillStyle = this.themeCache.objColor;
                ctx.fillText(k[0].toUpperCase() + k.slice(1), lx + 45, 12);
                lx += 60;
            });
        }

        // Draw Lines
        const drawLine = (getData, color) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            this.chartHistory.forEach((p, i) => {
                const val = getData(p.val);
                const x = padding.left + (i / (this.chartHistory.length - 1)) * w;
                const y = padding.top + h - ((val - min) / range) * h;
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            });
            ctx.stroke();
        };

        if (this.chartType === 'energy') {
            drawLine(v => v.kinetic, '#3b82f6');
            drawLine(v => v.potential, '#f472b6');
            drawLine(v => v.total, '#22d3ee');
        } else {
            drawLine(v => v, '#00f0ff');
        }
    }

    exportCSV() {
        if (!this.history.length) return alert("Нет данных для экспорта");
        const headers = ["timestamp", ...Object.keys(this.history[0]).filter(k => k !== 't')];
        const rows = this.history.map(entry => {
            return [new Date(entry.t).toISOString(), ...headers.slice(1).map(h => entry[h])];
        });
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(r => r.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `techphys_data_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    takeScreenshot() {
        if (!this.canvas) return;
        const link = document.createElement('a');
        link.download = `techphys_snapshot_${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
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
            const p = { pos: new Vec2(center, 50), type: 'pillar' };
            const b = { pos: new Vec2(center + 150, 50), vel: new Vec2(0, 0), type: 'ball', m: 10, radius: 20 };
            const s = { 
                type: 'spring', 
                objA: p, 
                objB: b, 
                restLen: 150, 
                k: 10, 
                damping: 0.1 
            };
            this.labs.mechanics.objects.push(p, b, s);
        }

        this.updateUI();
        this.selection = null;
        this.updateInspector();
    }

    drawGrid() {
        // Use objColor with low opacity for the grid
        this.ctx.strokeStyle = this.themeCache.objColor;
        this.ctx.globalAlpha = 0.08;
        this.ctx.lineWidth = 1;
        const step = 50;
        for(let x=0; x<this.canvas.width; x+=step) {
            this.ctx.beginPath(); this.ctx.moveTo(x,0); this.ctx.lineTo(x, this.canvas.height); this.ctx.stroke();
        }
        for(let y=0; y<this.canvas.height; y+=step) {
            this.ctx.beginPath(); this.ctx.moveTo(0,y); this.ctx.lineTo(this.canvas.width, y); this.ctx.stroke();
        }
        this.ctx.globalAlpha = 1.0;
    }

    drawRuler() {
        this.ctx.strokeStyle = this.themeCache.accent;
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
            display.style.color = this.themeCache.objColor; // Ensure text visibility
            display.style.background = this.themeCache.canvasBg;
            display.style.border = `1px solid ${this.themeCache.accent}`;
            display.innerText = `${d.toFixed(0)} px`;
        }
    }
}
