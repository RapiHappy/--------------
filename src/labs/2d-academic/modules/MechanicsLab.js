import { Vec2 } from '../../../shared/physics.js';

export class MechanicsLab {
    constructor(engine) {
        this.engine = engine;
        this.ctx = engine.ctx;
        this.objects = [];
        this.gravity = 9.8;
        this.time = 0;
    }

    update(dt) {
        if (!dt) return;
        this.time += dt;
        this.objects.forEach(o => {
            const isDragged = this.engine.isDragging && this.engine.selection === o;
            if (isDragged) {
                o.vel = new Vec2(0, 0); // Reset velocity while dragging
                return;
            }

            if (o.type === 'ball') {
                // Physics
                o.vel.y += this.gravity * 20 * dt;
                o.vel.x *= Math.pow(0.995, dt * 60); // Horizontal damping
                o.pos = o.pos.add(o.vel.mult(dt));

                const radius = 20;
                // Bottom
                if (o.pos.y > this.engine.canvas.height - radius) {
                    o.pos.y = this.engine.canvas.height - radius;
                    o.vel.y *= -0.7;
                    o.vel.x *= 0.95; // Friction on ground
                }
                // Top
                if (o.pos.y < radius) {
                    o.pos.y = radius;
                    o.vel.y *= -0.7;
                }
                // Right
                if (o.pos.x > this.engine.canvas.width - radius) {
                    o.pos.x = this.engine.canvas.width - radius;
                    o.vel.x *= -0.7;
                }
                // Left
                if (o.pos.x < radius) {
                    o.pos.x = radius;
                    o.vel.x *= -0.7;
                }

            } else if (o.type === 'pendulum') {
                const L = o.length || 200;
                const pivot = o.pivot || new Vec2(this.engine.canvas.width / 2, 50);
                o.angleAccel = -(this.gravity * 2 / L) * Math.sin(o.angle);
                o.angleVel += o.angleAccel * dt * 60;
                o.angleVel *= Math.pow(0.99, dt * 60);
                o.angle += o.angleVel * dt * 60;
                o.pos = new Vec2(
                    pivot.x + Math.sin(o.angle) * L,
                    pivot.y + Math.cos(o.angle) * L
                );
            } else if (o.type === 'spring') {
                const pivot = o.pivot || new Vec2(o.pos.x, 50);
                const restLen = o.restLen || 150;
                const k = o.k || 5;
                const m = o.m || 10;

                const currentLen = o.pos.y - pivot.y;
                const x = currentLen - restLen;
                const force = -k * x;
                const accel = force / m + this.gravity;

                o.vel.y += accel * dt * 60;
                o.vel.y *= Math.pow(0.98, dt * 60);
                o.pos.y += o.vel.y * dt * 60;

                const radius = 20;
                if (o.pos.y > this.engine.canvas.height - radius) {
                    o.pos.y = this.engine.canvas.height - radius;
                    o.vel.y *= -0.5;
                }
                if (o.pos.y < radius) {
                    o.pos.y = radius;
                    o.vel.y *= -0.5;
                }
            }
        });
    }

    draw() {
        this.ctx.shadowBlur = 0;
        const objColor = this.engine.themeCache.objColor;

        this.objects.forEach(o => {
            const isSelected = o === this.engine.selection;

            if (isSelected) {
                this.ctx.save();
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = '#00f0ff';
                this.ctx.strokeStyle = '#00f0ff';
                this.ctx.lineWidth = 3;
            }

            // Draw Velocity Vectors for Balls
            if (o.type === 'ball') {
                this.drawVector(o.pos, o.vel, '#00f0ff', 'v');
                
                // Optional: Draw component axes if moving fast enough
                if (o.vel.mag() > 10) {
                    this.ctx.save();
                    this.ctx.setLineDash([2, 4]);
                    this.ctx.globalAlpha = 0.5;
                    this.drawVector(o.pos, new Vec2(o.vel.x, 0), '#ff4757', 'vx');
                    this.drawVector(o.pos, new Vec2(0, o.vel.y), '#2ed573', 'vy');
                    this.ctx.restore();
                }
            }

            if (o.type === 'pendulum') {
                const pivot = o.pivot || new Vec2(this.engine.canvas.width / 2, 50);
                this.ctx.strokeStyle = isSelected ? '#00f0ff' : objColor;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(pivot.x, pivot.y);
                this.ctx.lineTo(o.pos.x, o.pos.y);
                this.ctx.stroke();
            } else if (o.type === 'spring') {
                const pivot = o.pivot || new Vec2(o.pos.x, 50);
                this.ctx.strokeStyle = isSelected ? '#00f0ff' : '#3b82f6';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(pivot.x, pivot.y);
                const steps = 15;
                for (let i = 1; i <= steps; i++) {
                    const py = pivot.y + (o.pos.y - pivot.y) * (i / steps);
                    const px = pivot.x + (i % 2 === 0 ? 15 : -15);
                    this.ctx.lineTo(px, py);
                }
                this.ctx.lineTo(o.pos.x, o.pos.y);
                this.ctx.stroke();
            }

            this.ctx.fillStyle = isSelected ? this.engine.themeCache.accent : '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(o.pos.x, o.pos.y, 20, 0, Math.PI * 2);
            this.ctx.fill();
            
            if (isSelected) {
                this.ctx.stroke();
                this.ctx.restore();
            }
        });

        // Draw Ground Line
        this.ctx.strokeStyle = objColor;
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.engine.canvas.height - 20);
        this.ctx.lineTo(this.engine.canvas.width, this.engine.canvas.height - 20);
        this.ctx.stroke();
        this.ctx.globalAlpha = 1.0;
    }

    drawVector(pos, vel, color, label) {
        const mag = vel.mag();
        if (mag < 5) return;

        const scale = 0.5;
        const end = pos.add(vel.mult(scale));

        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 2;
        
        // Line
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();

        // Arrow head
        const angle = Math.atan2(vel.y, vel.x);
        this.ctx.beginPath();
        this.ctx.moveTo(end.x, end.y);
        this.ctx.lineTo(end.x - 8 * Math.cos(angle - Math.PI/6), end.y - 8 * Math.sin(angle - Math.PI/6));
        this.ctx.lineTo(end.x - 8 * Math.cos(angle + Math.PI/6), end.y - 8 * Math.sin(angle + Math.PI/6));
        this.ctx.closePath();
        this.ctx.fill();

        // Label
        this.ctx.font = '10px Inter, sans-serif';
        this.ctx.fillText(label, end.x + 5, end.y + 5);
        this.ctx.restore();
    }

    getAtPos(pos) {
        return this.objects.find(o => o.pos.dist(pos) < 25);
    }

    getHTML() {
        return `
            <div class="sidebar-group-label" data-i18n="tools">ИНСТРУМЕНТЫ</div>
            <button class="tool-btn" id="m-ball" data-i18n="create_ball">⚽ Создать шар</button>
            <button class="tool-btn" id="m-spring" data-i18n="create_spring">➰ Создать пружину</button>
        `;
    }

    handleToolClick(id) {
        const spawnX = this.engine.canvas.width / 2;
        const spawnY = 100;
        if (id === 'm-ball') {
            this.objects.push({ pos: new Vec2(spawnX, spawnY), vel: new Vec2((Math.random() - 0.5) * 50, 0), type: 'ball' });
        } else if (id === 'm-spring') {
            this.objects.push({
                pos: new Vec2(spawnX, 250), pivot: new Vec2(spawnX, 50),
                vel: new Vec2(0, 0), type: 'spring', k: 5, m: 10, restLen: 150
            });
        }
    }

    getDataForLog() {
        const v = this.objects.length ? Math.abs(this.objects[0].vel.y) : 0;
        return { val1: v, val2: this.gravity, value: v };
    }
}
