export class I18nManager {
    constructor() {
        this.lang = localStorage.getItem('techphys_lang') || 'ru';
        this.theme = localStorage.getItem('techphys_theme') || 'dark';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('lang', this.lang);
        document.documentElement.setAttribute('data-theme', this.theme);
        this.applyTheme();
    }

    setLanguage(lang) {
        this.lang = lang;
        localStorage.setItem('techphys_lang', lang);
        document.documentElement.setAttribute('lang', lang);
        window.location.reload(); // Reload to refresh all labels
    }

    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem('techphys_theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        this.applyTheme();
        window.dispatchEvent(new CustomEvent('techphys_theme_change', { detail: { theme } }));
    }

    applyTheme() {
        if (this.theme === 'light') {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        } else {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        }
    }

    t(key, translations) {
        return translations[this.lang]?.[key] || key;
    }
}

export const i18n = new I18nManager();
