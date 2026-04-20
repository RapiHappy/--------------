import { i18n } from './I18nManager.js';

export class PremiumControls {
    constructor() {
        this.render();
    }

    render() {
        if (document.getElementById('premium-controls')) return;

        const container = document.createElement('div');
        container.id = 'premium-controls';
        container.className = 'premium-controls-container';
        
        const langHtml = `
            <div class="control-pill lang-switcher" id="global-lang-toggle">
                <span class="${i18n.lang === 'ru' ? 'active' : ''}" data-lang="ru">RU</span>
                <span class="${i18n.lang === 'en' ? 'active' : ''}" data-lang="en">EN</span>
                <div class="pill-slider ${i18n.lang === 'en' ? 'right' : ''}"></div>
            </div>
        `;

        const themeHtml = `
            <div class="control-pill theme-switcher" id="global-theme-toggle">
                <span class="icon">${i18n.theme === 'dark' ? '🌙' : '☀️'}</span>
            </div>
        `;

        container.innerHTML = langHtml + themeHtml;
        document.body.appendChild(container);

        this.addStyles();
        this.addEvents();
    }

    addEvents() {
        const langSwitch = document.getElementById('global-lang-toggle');
        langSwitch.onclick = () => {
            const next = i18n.lang === 'ru' ? 'en' : 'ru';
            i18n.setLanguage(next);
        };

        const themeSwitch = document.getElementById('global-theme-toggle');
        themeSwitch.onclick = () => {
            const next = i18n.theme === 'dark' ? 'light' : 'dark';
            icon.innerText = next === 'dark' ? '🌙' : '☀️';
            icon.classList.add('pop-animation');
            setTimeout(() => icon.classList.remove('pop-animation'), 400);
        };

        window.addEventListener('techphys_theme_change', (e) => {
            const themeSwitch = document.getElementById('global-theme-toggle');
            if (themeSwitch) {
                const icon = themeSwitch.querySelector('.icon');
                if (icon) icon.innerText = e.detail.theme === 'dark' ? '🌙' : '☀️';
            }
        });
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .premium-controls-container {
                position: fixed;
                top: 24px;
                right: 24px;
                z-index: 9999;
                display: flex;
                gap: 12px;
                pointer-events: auto;
            }
            .control-pill {
                background: rgba(13, 17, 23, 0.7);
                backdrop-filter: blur(12px) saturate(180%);
                -webkit-backdrop-filter: blur(12px) saturate(180%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 50px;
                height: 44px;
                display: flex;
                align-items: center;
                padding: 0 4px;
                cursor: pointer;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .control-pill:hover {
                transform: scale(1.05);
                border-color: rgba(0, 240, 255, 0.4);
            }
            .lang-switcher {
                width: 90px;
                position: relative;
                justify-content: space-around;
            }
            .lang-switcher span {
                z-index: 1;
                font-size: 0.75rem;
                font-weight: 800;
                color: rgba(255,255,255,0.4);
                transition: color 0.3s;
                width: 40px;
                text-align: center;
            }
            .lang-switcher span.active {
                color: #fff;
            }
            .pill-slider {
                position: absolute;
                left: 4px;
                width: 40px;
                height: 34px;
                background: #3b82f6;
                border-radius: 40px;
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
            }
            .pill-slider.right {
                transform: translateX(42px);
            }
            .theme-switcher {
                width: 44px;
                justify-content: center;
            }
            .theme-switcher .icon {
                font-size: 1.2rem;
                transition: transform 0.3s;
            }
            @keyframes pop-animation {
                0% { transform: scale(1); }
                50% { transform: scale(1.4); }
                100% { transform: scale(1); }
            }
            .pop-animation { animation: pop-animation 0.4s ease; }
            
            [data-theme="light"] .control-pill {
                background: rgba(255, 255, 255, 0.8);
                border-color: rgba(0, 0, 0, 0.1);
                box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            }
            [data-theme="light"] .lang-switcher span { color: rgba(0,0,0,0.3); }
            [data-theme="light"] .lang-switcher span.active { color: #000; }
        `;
        document.head.appendChild(style);
    }
}
