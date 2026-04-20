import { Engine } from './modules/Engine.js';
import { LoaderEngine } from './modules/LoaderEngine.js';
import { TutorialManager } from './modules/TutorialManager.js';
import { MissionManager } from './modules/MissionManager.js';
import { PremiumControls } from '../../shared/PremiumControls.js';
import { i18n } from '../../shared/I18nManager.js';

window.onload = () => {
    const loader = new LoaderEngine();

    // Initial state from I18n
    i18n.applyTheme();

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
    window.controls = new PremiumControls();
};
