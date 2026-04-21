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
        title_theme: "Переключить тему (День/Ночь)"
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
        title_theme: "Switch theme (Day/Night)"
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
        this.selection = null;
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
                // Constrain to canvas
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

    handleMouseUp() {
        this.isDragging = false;
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
        if (!canvas || !canvas.parentElement) return;
        
        const rect = canvas.parentElement.getBoundingClientRect();
        if (rect.width === 0) return; // Parent is hidden or not ready

        canvas.width = rect.width;
        canvas.height = 150;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Filter out bad data
        const validPoints = this.chartPoints.filter(p => p !== null && p !== undefined && !isNaN(p));
        if (validPoints.length < 2) return;
        
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        
        const max = Math.max(...validPoints);
        const min = Math.min(...validPoints);
        const range = (max - min) || 1;

        // Draw axis labels
        ctx.fillStyle = this.themeCache.objColor;
        ctx.font = '10px Inter, sans-serif';
        ctx.globalAlpha = 0.6;
        ctx.fillText(max.toFixed(2), 5, 15);
        ctx.fillText(min.toFixed(2), 5, canvas.height - 5);
        ctx.globalAlpha = 1.0;

        validPoints.forEach((p, i) => {
            const x = (i / (validPoints.length - 1)) * canvas.width;
            const y = canvas.height - 10 - ((p - min) / range) * (canvas.height - 20);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Add glow
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
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
