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

    update(dt) {
        if (!dt || this.engine.isPaused) return;

        // Dynamic charge movement (Coulomb Force)
        this.charges.forEach((c1, i) => {
            if (c1 === this.engine.isDragging && this.engine.selection === c1) {
                c1.vel = new Vec2(0, 0);
                return;
            }
            if (!c1.vel) c1.vel = new Vec2(0, 0);

            let totalForce = new Vec2(0, 0);
            this.charges.forEach((c2, j) => {
                if (i === j) return;
                const distVec = c1.pos.sub(c2.pos);
                const distSq = Math.max(distVec.x * distVec.x + distVec.y * distVec.y, 400); // Softening
                const forceMag = (c1.q * c2.q) / distSq * 50;
                totalForce = totalForce.add(distVec.unit().mult(forceMag));
            });

            // F = m*a => a = F/m (assuming m=1 for simplicity)
            c1.vel = c1.vel.add(totalForce.mult(dt * 60));
            // Damping to keep things stable
            c1.vel = c1.vel.mult(Math.pow(0.95, dt * 60));
            c1.pos = c1.pos.add(c1.vel.mult(dt));

            // Bounce off walls
            const r = 15;
            if (c1.pos.x < r || c1.pos.x > this.engine.canvas.width - r) {
                c1.pos.x = Math.max(r, Math.min(this.engine.canvas.width - r, c1.pos.x));
                c1.vel.x *= -0.5;
            }
            if (c1.pos.y < r || c1.pos.y > this.engine.canvas.height - r) {
                c1.pos.y = Math.max(r, Math.min(this.engine.canvas.height - r, c1.pos.y));
                c1.vel.y *= -0.5;
            }
        });
    }

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

    getChartOptions() {
        return [
            { id: 'force', label: 'chart_force' },
            { id: 'potential', label: 'chart_potential' }
        ];
    }

    getDataForLog() {
        const selection = this.engine.selection;
        let force = 0;
        if (selection && selection.q !== undefined) {
            // Find force on selected charge
            const idx = this.charges.indexOf(selection);
            let totalF = new Vec2(0, 0);
            this.charges.forEach((c2, j) => {
                if (idx === j) return;
                const distVec = selection.pos.sub(c2.pos);
                const distSq = Math.max(distVec.x * distVec.x + distVec.y * distVec.y, 400);
                const forceMag = (selection.q * c2.q) / distSq * 50;
                totalF = totalF.add(distVec.unit().mult(forceMag));
            });
            force = totalF.mag();
        }

        let totalPotential = 0;
        for (let i = 0; i < this.charges.length; i++) {
            for (let j = i + 1; j < this.charges.length; j++) {
                const r = this.charges[i].pos.dist(this.charges[j].pos);
                totalPotential += (this.charges[i].q * this.charges[j].q) / Math.max(r, 20);
            }
        }

        return { 
            force: force,
            potential: totalPotential * 0.1
        };
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
