import { Vec2 } from '../../../shared/physics.js';

export class ElectroLab {
    constructor(engine) {
        this.engine = engine;
        this.ctx = engine.ctx;
        this.charges = [
            { pos: new Vec2(400, 300), q: 100 },
            { pos: new Vec2(600, 300), q: -100 }
        ];
    }

    update() { }

    draw() {
        this.drawVectorField();
        this.charges.forEach(c => {
            const isSelected = c === this.engine.selection;
            if (isSelected) {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = '#00f0ff';
                this.ctx.strokeStyle = '#00f0ff';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(c.pos.x, c.pos.y, 18, 0, 7);
                this.ctx.stroke();
            }

            this.ctx.fillStyle = c.q > 0 ? '#ef4444' : '#3b82f6';
            this.ctx.beginPath();
            this.ctx.arc(c.pos.x, c.pos.y, 15, 0, 7);
            this.ctx.fill();
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.font = 'bold 14px Outfit';
            this.ctx.fillText(c.q > 0 ? '+' : '-', c.pos.x, c.pos.y + 5);
            this.ctx.shadowBlur = 0;
        });
    }

    drawVectorField() {
        const step = 40;
        const objColor = this.engine.themeCache.objColor;
        for (let x = step / 2; x < this.engine.canvas.width; x += step) {
            for (let y = step / 2; y < this.engine.canvas.height; y += step) {
                let E = new Vec2();
                this.charges.forEach(c => {
                    let r = new Vec2(x, y).sub(c.pos);
                    let distSq = r.x * r.x + r.y * r.y;
                    if (distSq > 100) {
                        E = E.add(r.unit().mult(c.q / distSq * 5000));
                    }
                });

                let mag = E.mag();
                if (mag < 0.1) continue;
                let len = Math.min(mag, 20);
                let d = E.unit().mult(len);
                this.ctx.strokeStyle = objColor;
                this.ctx.globalAlpha = Math.min(mag / 10, 0.3);
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x + d.x, y + d.y);
                this.ctx.stroke();
                this.ctx.globalAlpha = 1.0;
            }
        }
    }

    getHTML() {
        return `
            <div class="sidebar-group-label" data-i18n="electro">ЭЛЕКТРОСТАТИКА</div>
            <button class="tool-btn" id="e-pos" data-i18n="charge_pos">➕ Заряд (+)</button>
            <button class="tool-btn" id="e-neg" data-i18n="charge_neg">➖ Заряд (-)</button>
        `;
    }

    handleToolClick(id) {
        const cx = this.engine.canvas.width / 2;
        const cy = this.engine.canvas.height / 2;
        if (id === 'e-pos') {
            this.charges.push({ pos: new Vec2(cx + (Math.random() - 0.5) * 100, cy), q: 100 });
        } else if (id === 'e-neg') {
            this.charges.push({ pos: new Vec2(cx + (Math.random() - 0.5) * 100, cy), q: -100 });
        }
    }

    getAtPos(pos) {
        return this.charges.find(c => c.pos.dist(pos) < 30);
    }

    getDataForLog() {
        return { val1: this.charges.length, val2: 0, value: this.charges.length };
    }

    getSnapshot() {
        return {
            chargeCount: this.charges.length,
            posChargeCount: this.charges.filter(c => c.q > 0).length,
            negChargeCount: this.charges.filter(c => c.q < 0).length,
            isPaused: this.engine.isPaused
        };
    }
}
