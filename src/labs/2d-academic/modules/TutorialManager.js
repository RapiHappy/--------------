export class TutorialManager {
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

    show() {
        if (this.modal) {
            this.modal.style.display = 'flex';
            this.modal.classList.remove('hidden');
        }
    }

    hide() {
        if (this.modal) {
            this.modal.style.display = 'none';
            this.modal.classList.add('hidden');
        }
        localStorage.setItem('techphys_tutorial_viewed', 'true');
    }
}
