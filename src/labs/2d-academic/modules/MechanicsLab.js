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
        if (!dt || dt > 0.1) return; // Prevent huge leaps

        // 1. Force Accumulation Phase
        const springs = this.objects.filter(o => o.type === 'spring');
        springs.forEach(s => {
            const posA = s.objA ? s.objA.pos : s.posA;
            const posB = s.objB ? s.objB.pos : s.posB;
            if (!posA || !posB) return;

            const diff = posB.sub(posA);
            const dist = diff.mag();
            const stretch = dist - s.restLen;
            const forceMag = stretch * s.k;
            const force = diff.unit().mult(forceMag);

            // Apply force to objects
            if (s.objB && s.objB.vel) {
                const accel = force.mult(-1 / (s.objB.m || 10));
                s.objB.vel = s.objB.vel.add(accel.mult(dt * 60));
                // Damping
                const relVel = s.objB.vel;
                s.objB.vel = s.objB.vel.sub(relVel.mult(s.damping * 0.1 * dt * 60));
            }
            if (s.objA && s.objA.vel) {
                const accel = force.mult(1 / (s.objA.m || 10));
                s.objA.vel = s.objA.vel.add(accel.mult(dt * 60));
                // Damping
                const relVel = s.objA.vel;
                s.objA.vel = s.objA.vel.sub(relVel.mult(s.damping * 0.1 * dt * 60));
            }
        });

        // 2. Integration & Collision Phase
        this.objects.forEach(o => {
            const isDragged = this.engine.isDragging && this.engine.selection === o;
            if (isDragged || o.pinned) {
                if (o.vel && !o.pinned) o.vel = new Vec2(0, 0); 
                // If pinned, we might want to keep vel=0 always or just skip acceleration
                if (o.pinned && o.vel) o.vel = new Vec2(0, 0);
                
                // Still allow dragging pinned objects? Usually yes, but they stay where dropped.
                if (isDragged) {
                    // Update position is handled by Engine.js handleMouseMove
                }
                
                if (!isDragged || o.pinned) return;
            }

            if (o.type === 'ball') {
                // Gravity
                o.vel.y += this.gravity * 20 * dt;
                
                // Mass-dependent Air Resistance (Damping)
                // Heavier balls are less affected by air drag
                const dragConst = 0.5; // Adjustable drag factor
                const dampingBase = 1 - (dragConst / (o.m || 10)) * dt;
                o.vel = o.vel.mult(Math.max(0, dampingBase));

                // Position update
                o.pos = o.pos.add(o.vel.mult(dt));

                // Visual Rotation based on horizontal velocity
                o.angle = (o.angle || 0) + (o.vel.x / (o.radius || 20)) * dt;

                const radius = o.m ? (10 + Math.sqrt(o.m) * 3) : (o.radius || 20);

                // Ground and Walls
                if (o.pos.y > this.engine.canvas.height - radius) {
                    o.pos.y = this.engine.canvas.height - radius;
                    o.vel.y *= -0.6; // Bounce
                    o.vel.x *= 0.95; // Friction
                }
                if (o.pos.y < radius) {
                    o.pos.y = radius;
                    o.vel.y *= -0.6;
                }
                if (o.pos.x > this.engine.canvas.width - radius) {
                    o.pos.x = this.engine.canvas.width - radius;
                    o.vel.x *= -0.6;
                }
                if (o.pos.x < radius) {
                    o.pos.x = radius;
                    o.vel.x *= -0.6;
                }

                // Slope Collisions
                this.objects.filter(s => s.type === 'slope').forEach(slope => {
                    const A = slope.pos;
                    const B = slope.end;
                    const line = B.sub(A);
                    const lineLen = line.mag();
                    if (lineLen === 0) return;

                    const t = Math.max(0, Math.min(1, o.pos.sub(A).dot(line) / (lineLen * lineLen)));
                    const projection = A.add(line.mult(t));
                    const distVec = o.pos.sub(projection);
                    const dist = distVec.mag();
                    const radius = o.m ? (10 + Math.sqrt(o.m) * 3) : (o.radius || 20);

                    if (dist < radius) {
                        const normal = distVec.unit();
                        // Push out
                        const overlap = radius - dist;
                        o.pos = o.pos.add(normal.mult(overlap));

                        // REALISTIC SLOPE PHYSICS: Gravity projection
                        // Gravity pulls object ALONG the slope surface
                        const slopeDir = new Vec2(normal.y, -normal.x); // Tangent to slope
                        const gravityMag = this.gravity * 20;
                        const gravityVec = new Vec2(0, gravityMag);
                        const gravAlongSlope = gravityVec.dot(slopeDir);
                        
                        // Apply acceleration along slope
                        o.vel = o.vel.add(slopeDir.mult(gravAlongSlope * dt));

                        // Reflect velocity (Bounce)
                        if (o.vel.dot(normal) < 0) {
                            const bounce = 0.3;
                            o.vel = o.vel.reflect(normal).mult(bounce);
                        }
                        
                        // Apply friction along slope
                        const friction = slope.friction || 0.1;
                        o.vel = o.vel.mult(1 - friction * dt * 60);
                    }
                });
            }
        });
    }

    draw() {
        this.ctx.shadowBlur = 0;
        const objColor = this.engine.themeCache.objColor;
        const accent = this.engine.themeCache.accent;

        this.objects.forEach(o => {
            const isSelected = o === this.engine.selection;

            if (isSelected) {
                this.ctx.save();
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = '#00f0ff';
                this.ctx.strokeStyle = '#00f0ff';
                this.ctx.lineWidth = 3;
            }

            if (o.type === 'ball') {
                const radius = o.m ? (10 + Math.sqrt(o.m) * 3) : (o.radius || 20);

                // Vector Arrows
                this.drawVector(o.pos, o.vel, accent, 'v');
                
                // Info Text (Mass & Speed)
                const speed = o.vel.mag() / 20;
                if (isSelected || speed > 0.1) {
                    this.ctx.save();
                    this.ctx.fillStyle = objColor;
                    this.ctx.font = 'bold 12px Outfit, sans-serif';
                    this.ctx.globalAlpha = 0.8;
                    const massText = o.m ? `[${o.m}kg] ` : '';
                    const speedText = speed > 0.1 ? `${speed.toFixed(1)} m/s` : '';
                    this.ctx.fillText(`${massText}${speedText}`, o.pos.x + radius + 5, o.pos.y - 10);
                    this.ctx.restore();
                }

                // Ball Body
                this.ctx.fillStyle = isSelected ? accent : (this.engine.theme === 'dark' ? '#ffffff' : '#1e293b');
                if (o.pinned) {
                    // Pinned style: thicker border or different color
                    this.ctx.strokeStyle = '#ff3b3b';
                    this.ctx.lineWidth = 3;
                }
                
                this.ctx.beginPath();
                this.ctx.arc(o.pos.x, o.pos.y, radius, 0, Math.PI * 2);
                this.ctx.fill();

                // Draw a rotation line (visual rolling effect)
                this.ctx.strokeStyle = this.engine.theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(o.pos.x, o.pos.y);
                this.ctx.lineTo(o.pos.x + Math.cos(o.angle || 0) * radius, o.pos.y + Math.sin(o.angle || 0) * radius);
                this.ctx.stroke();
                
                if (isSelected) {
                    this.ctx.strokeStyle = '#00f0ff';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }

                if (o.pinned) {
                    // Draw a small cross or pin head
                    this.ctx.fillStyle = '#ff3b3b';
                    this.ctx.beginPath();
                    this.ctx.arc(o.pos.x, o.pos.y, 4, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }

            } else if (o.type === 'pillar') {
                // Pillar Base
                this.ctx.fillStyle = objColor;
                this.ctx.globalAlpha = 0.2;
                this.ctx.fillRect(o.pos.x - 30, o.pos.y + 10, 60, 10);
                this.ctx.globalAlpha = 1.0;

                // Anchor Point
                this.ctx.fillStyle = objColor;
                this.ctx.beginPath();
                this.ctx.arc(o.pos.x, o.pos.y, 8, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = accent;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                // Stick
                this.ctx.fillRect(o.pos.x - 2, o.pos.y, 4, 20);

            } else if (o.type === 'slope') {
                this.ctx.save();
                this.ctx.strokeStyle = objColor;
                this.ctx.lineWidth = 6;
                this.ctx.lineCap = 'round';
                this.ctx.globalAlpha = 0.8;
                
                // Draw Surface
                this.ctx.beginPath();
                this.ctx.moveTo(o.pos.x, o.pos.y);
                this.ctx.lineTo(o.end.x, o.end.y);
                this.ctx.stroke();

                // Draw Support (Triangle)
                this.ctx.lineWidth = 1;
                this.ctx.globalAlpha = 0.1;
                this.ctx.fillStyle = objColor;
                this.ctx.beginPath();
                this.ctx.moveTo(o.pos.x, o.pos.y);
                this.ctx.lineTo(o.end.x, o.end.y);
                this.ctx.lineTo(o.end.x, Math.max(o.pos.y, o.end.y));
                this.ctx.lineTo(o.pos.x, Math.max(o.pos.y, o.end.y));
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.restore();

            } else if (o.type === 'spring') {
                const posA = o.objA ? o.objA.pos : o.posA;
                const posB = o.objB ? o.objB.pos : o.posB;
                if (!posA || !posB) return;

                this.ctx.strokeStyle = isSelected ? accent : '#6366f1';
                this.ctx.lineWidth = 3;
                this.ctx.lineJoin = 'round';
                
                this.ctx.beginPath();
                this.ctx.moveTo(posA.x, posA.y);
                
                const dist = posA.dist(posB);
                const steps = Math.floor(dist / 10) + 5;
                const unit = posB.sub(posA).unit();
                const normal = new Vec2(-unit.y, unit.x);
                
                for (let i = 1; i < steps; i++) {
                    const p = posA.add(posB.sub(posA).mult(i / steps));
                    const offset = (i % 2 === 0 ? 10 : -10);
                    const point = p.add(normal.mult(offset));
                    this.ctx.lineTo(point.x, point.y);
                }
                this.ctx.lineTo(posB.x, posB.y);
                this.ctx.stroke();

                // Small connector circles
                this.ctx.fillStyle = objColor;
                this.ctx.beginPath();
                this.ctx.arc(posA.x, posA.y, 4, 0, Math.PI * 2);
                this.ctx.arc(posB.x, posB.y, 4, 0, Math.PI * 2);
                this.ctx.fill();

                if (isSelected) {
                    this.ctx.strokeStyle = accent;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.arc(posA.x, posA.y, 10, 0, Math.PI * 2);
                    this.ctx.arc(posB.x, posB.y, 10, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
            }

            if (isSelected) {
                this.ctx.restore();
            }
        });

        // Draw Ground Line
        this.ctx.strokeStyle = objColor;
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 0.2;
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
        return this.objects.find(o => {
            if (o.pos && !o.end) {
                return o.pos.dist(pos) < 25;
            }
            if (o.pos && o.end) {
                // Distance to slope line segment
                const A = o.pos;
                const B = o.end;
                const line = B.sub(A);
                const lineLen = line.mag();
                if (lineLen === 0) return A.dist(pos) < 25;
                const t = Math.max(0, Math.min(1, pos.sub(A).dot(line) / (lineLen * lineLen)));
                const projection = A.add(line.mult(t));
                return pos.dist(projection) < 20;
            }
            if (o.type === 'spring') {
                const posA = o.objA ? o.objA.pos : o.posA;
                const posB = o.objB ? o.objB.pos : o.posB;
                if (!posA || !posB) return false;
                
                if (pos.dist(posA) < 20) return { obj: o, part: 'endA' };
                if (pos.dist(posB) < 20) return { obj: o, part: 'endB' };
                
                const mid = posA.add(posB).mult(0.5);
                return pos.dist(mid) < 25;
            }
            return false;
        });
    }

    handleDrag(obj, part, pos) {
        if (obj.type === 'spring') {
            if (part === 'endA') {
                obj.objA = null; // Detach
                obj.posA = pos;
            } else if (part === 'endB') {
                obj.objB = null; // Detach
                obj.posB = pos;
            } else {
                // Move whole spring if dragged by center
                // Not strictly needed but could be added
            }
        } else if (obj.pos) {
            obj.pos = pos;
            if (obj.vel) obj.vel = new Vec2(0,0);
        }
    }

    onMouseUp(obj, part, pos) {
        if (obj.type === 'spring' && (part === 'endA' || part === 'endB')) {
            // Try to attach to nearest ball or pillar
            const targets = this.objects.filter(o => (o.type === 'ball' || o.type === 'pillar') && o !== obj);
            const nearest = targets.find(t => t.pos.dist(pos) < 30);
            
            if (nearest) {
                if (part === 'endA') {
                    obj.objA = nearest;
                    obj.posA = null;
                } else {
                    obj.objB = nearest;
                    obj.posB = null;
                }
            }
        }
    }

    getHTML() {
        return `
            <div class="sidebar-group-label" data-i18n="tools">ИНСТРУМЕНТЫ</div>
            <button class="tool-btn" id="m-ball" data-i18n="create_ball">⚽ Создать шар</button>
            <button class="tool-btn" id="m-spring" data-i18n="create_spring">➰ Создать пружину</button>
            <button class="tool-btn" id="m-pillar" data-i18n="create_pillar">⚓ Создать опору</button>
            <button class="tool-btn" id="m-slope" data-i18n="create_slope">📐 Создать наклон</button>
        `;
    }

    handleToolClick(id) {
        const spawnX = this.engine.canvas.width / 2;
        const spawnY = 100;
        if (id === 'm-ball') {
            this.objects.push({ 
                pos: new Vec2(spawnX, spawnY), 
                vel: new Vec2((Math.random() - 0.5) * 50, 0), 
                type: 'ball',
                m: 10,
                radius: 20,
                pinned: false
            });
        } else if (id === 'm-spring') {
            // New spring logic: connect to nearest ball or pillar, or create one
            const targets = this.objects.filter(o => o.type === 'ball' || o.type === 'pillar');
            const target = targets.length ? targets[targets.length - 1] : null;
            
            this.objects.push({
                type: 'spring',
                objA: null, // Fixed point
                posA: new Vec2(spawnX, 50),
                objB: target,
                posB: target ? null : new Vec2(spawnX, 250),
                k: 5,
                restLen: 150,
                damping: 0.5
            });
        } else if (id === 'm-pillar') {
            this.objects.push({
                pos: new Vec2(spawnX, spawnY),
                type: 'pillar'
            });
        } else if (id === 'm-slope') {
            this.objects.push({
                pos: new Vec2(200, 400),
                end: new Vec2(600, 550),
                type: 'slope',
                friction: 0.1
            });
        }
    }

    getDataForLog() {
        const v = this.objects.length ? Math.abs(this.objects[0].vel?.y || 0) : 0;
        return { val1: v, val2: this.gravity, value: v };
    }

    getSnapshot() {
        const maxV = this.objects.reduce((max, o) => Math.max(max, o.vel ? o.vel.mag() : 0), 0);
        return {
            objectCount: this.objects.length,
            ballCount: this.objects.filter(o => o.type === 'ball').length,
            springCount: this.objects.filter(o => o.type === 'spring').length,
            maxSpeed: maxV,
            gravity: this.gravity,
            timeScale: this.engine.timeScale,
            isPaused: this.engine.isPaused
        };
    }
}
