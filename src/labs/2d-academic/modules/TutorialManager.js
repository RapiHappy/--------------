export class TutorialManager {
    constructor() {
        this.modal = document.getElementById('tutorial-modal');
        this.finishBtn = document.getElementById('tutorial-ok');
        this.closeBtn = document.getElementById('close-tutorial');
        this.triggerBtn = document.getElementById('tutorial-btn');
        this.nextBtn = document.getElementById('tutorial-next');
        this.prevBtn = document.getElementById('tutorial-prev');
        
        this.steps = document.querySelectorAll('.step');
        this.indicators = document.querySelectorAll('.dot');
        this.currentStep = 0;

        this.setup();
        this.checkAutoShow();
    }

    setup() {
        if (this.finishBtn) this.finishBtn.addEventListener('click', (e) => { e.stopPropagation(); this.hide(); });
        if (this.closeBtn) this.closeBtn.addEventListener('click', (e) => { e.stopPropagation(); this.hide(); });
        if (this.triggerBtn) this.triggerBtn.addEventListener('click', (e) => { e.stopPropagation(); this.show(); });
        if (this.nextBtn) this.nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.nextStep(); });
        if (this.prevBtn) this.prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.prevStep(); });
    }

    checkAutoShow() {
        if (!localStorage.getItem('techphys_tutorial_viewed')) {
            setTimeout(() => this.show(), 4500); 
        }
    }

    show() {
        if (this.modal) {
            this.currentStep = 0;
            this.updateUI();
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

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.updateUI();
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateUI();
        }
    }

    updateUI() {
        this.steps.forEach((s, i) => {
            s.classList.toggle('active', i === this.currentStep);
        });

        this.indicators.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentStep);
        });

        if (this.prevBtn) this.prevBtn.classList.toggle('hidden', this.currentStep === 0);
        
        if (this.currentStep === this.steps.length - 1) {
            if (this.nextBtn) this.nextBtn.classList.add('hidden');
            if (this.finishBtn) this.finishBtn.classList.remove('hidden');
        } else {
            if (this.nextBtn) this.nextBtn.classList.remove('hidden');
            if (this.finishBtn) this.finishBtn.classList.add('hidden');
        }
    }
}
