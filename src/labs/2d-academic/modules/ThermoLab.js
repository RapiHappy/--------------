import { Vec2 } from '../../../shared/physics.js';

export class ThermoLab {
    constructor(engine) {
        this.engine = engine;
        this.ctx = engine.ctx;
        this.particles = [];
        this.temp = 300;
        this.vol = 0.8;
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                pos: new Vec2(300, 300),
                vel: new Vec2((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)
            });
        }
    }

    update(dt) {
        if (!dt) return;
        const w = this.engine.canvas.width * this.vol;
        const x0 = (this.engine.canvas.width - w) / 2;
        this.particles.forEach(p => {
            p.pos = p.pos.add(p.vel.mult((this.temp / 300) * dt * 60));
            if (p.pos.x < x0 || p.pos.x > x0 + w) p.vel.x *= -1;
            if (p.pos.y < 50 || p.pos.y > this.engine.canvas.height - 50) p.vel.y *= -1;
        });
    }

    draw() {
        const w = this.engine.canvas.width * this.vol;
        const x0 = (this.engine.canvas.width - w) / 2;
        this.ctx.strokeStyle = this.engine.themeCache.objColor;
        this.ctx.globalAlpha = 0.2;
        this.ctx.strokeRect(x0, 50, w, this.engine.canvas.height - 100);
        this.ctx.globalAlpha = 1.0;
        this.particles.forEach(p => {
            const isSelected = p === this.engine.selection;
            if (isSelected) {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#00f0ff';
                this.ctx.strokeStyle = '#00f0ff';
                this.ctx.lineWidth = 2;
            }
            this.ctx.fillStyle = `hsl(${240 - (this.temp - 100)}, 100%, 50%)`;
            this.ctx.beginPath();
            this.ctx.arc(p.pos.x, p.pos.y, 4, 0, 7);
            this.ctx.fill();
            if (isSelected) this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        });
    }

    getAtPos(pos) {
        return this.particles.find(p => p.pos.dist(pos) < 10);
    }

    getHTML() {
        return `
            <div class="sidebar-group-label" data-i18n="thermo">ТЕРМОДИНАМИКА</div>
            <div class="control-group">
                <label>Температура: <span id="temp-val">${this.temp}K</span></label>
                <input type="range" id="t-temp" min="100" max="500" value="${this.temp}">
            </div>
        `;
    }

    bindEvents() {
        const t = document.getElementById('t-temp');
        if (t) {
            t.oninput = e => {
                this.temp = e.target.value;
                document.getElementById('temp-val').innerText = `${this.temp}K`;
            };
        }
    }

    getDataForLog() {
        return { val1: this.temp, val2: this.vol, value: this.temp * (1 / this.vol) };
    }
}
