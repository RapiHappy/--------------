import { i18n } from './I18nManager.js';

/**
 * PremiumControls: Manages the high-end interaction for header toggles
 * Handles Language and Theme switching with smooth transitions
 */
export class PremiumControls {
    constructor() {
        this.init();
    }

    init() {
        this.langBtn = document.getElementById('lang-toggle');
        this.themeBtn = document.getElementById('theme-toggle');
        this.hubBtn = document.getElementById('hub-btn');
        this.theoryBtn = document.getElementById('theory-btn');
        
        if (this.langBtn) {
            this.langBtn.innerText = i18n.lang.toUpperCase();
            this.langBtn.onclick = (e) => {
                e.stopPropagation();
                const next = i18n.lang === 'ru' ? 'en' : 'ru';
                i18n.setLanguage(next);
            };
        }

        if (this.themeBtn) {
            this.themeBtn.innerText = i18n.theme === 'dark' ? '🌙' : '☀️';
            this.themeBtn.onclick = (e) => {
                e.stopPropagation();
                const next = i18n.theme === 'dark' ? 'light' : 'dark';
                i18n.setTheme(next);
            };
        }

        if (this.hubBtn) {
            this.hubBtn.onclick = (e) => {
                e.stopPropagation();
                window.location.href = 'https://rapihappy.github.io/--------------/';
            };
        }

        if (this.theoryBtn) {
            this.theoryBtn.onclick = (e) => {
                e.stopPropagation();
                // Theory button should trigger an event or call engine if available
                window.dispatchEvent(new CustomEvent('techphys_theory_click'));
            };
        }

        // Global listener for theme changes from other sources
        window.addEventListener('techphys_theme_change', (e) => {
            this.updateThemeButton(e.detail.theme);
        });
    }

    updateThemeButton(theme) {
        if (!this.themeBtn) return;
        this.themeBtn.innerText = theme === 'dark' ? '🌙' : '☀️';
        this.themeBtn.classList.add('pop-animation');
        setTimeout(() => this.themeBtn.classList.remove('pop-animation'), 400);
    }
}
