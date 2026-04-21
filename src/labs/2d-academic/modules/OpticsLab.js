import { Vec2 } from '../../../shared/physics.js';

export class OpticsLab {
    constructor(engine) {
        this.engine = engine;
        this.ctx = engine.ctx;
        this.objects = [{ pos: new Vec2(550, 250), length: 300, angle: 0.2, type: 'mirror' }];
        this.laser = { pos: new Vec2(50, 300), type: 'laser' };
    }

    update(dt) { }

    draw() {
        const objColor = this.engine.themeCache.objColor;

        const isLaserSelected = this.laser === this.engine.selection;
        const laserPos = this.laser.pos || this.laser;
        if (isLaserSelected) {
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = '#00f0ff';
        }
        this.ctx.fillStyle = isLaserSelected ? '#00f0ff' : 'red';
        this.ctx.beginPath();
        this.ctx.arc(laserPos.x, laserPos.y, 12, 0, 7);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        let rayPos = new Vec2(laserPos.x, laserPos.y);
        let rayDir = new Vec2(1, 0);

        this.ctx.strokeStyle = '#f00';
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = 'red';
        this.ctx.beginPath();
        this.ctx.moveTo(rayPos.x, rayPos.y);

        for (let i = 0; i < 10; i++) {
            let nearest = null;
            let minDist = 2000;

            this.objects.forEach(obj => {
                const hits = this.getIntersections(rayPos, rayDir, obj);
                hits.forEach(hit => {
                    if (hit.dist < minDist) {
                        minDist = hit.dist;
                        nearest = { hit, obj };
                    }
                });
            });

            if (nearest) {
                const hitPoint = rayPos.add(rayDir.mult(nearest.hit.dist));
                this.ctx.lineTo(hitPoint.x, hitPoint.y);
                rayPos = hitPoint;

                if (nearest.obj.type === 'mirror') {
                    const normal = nearest.hit.normal;
                    rayDir = rayDir.reflect(normal);
                } else if (nearest.obj.type === 'prism') {
                    rayDir = new Vec2(rayDir.x, rayDir.y + 0.2).unit();
                }
            } else {
                const endPos = rayPos.add(rayDir.mult(2000));
                this.ctx.lineTo(endPos.x, endPos.y);
                break;
            }
        }
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;

        this.objects.forEach(o => {
            const isSelected = o === this.engine.selection;
            if (isSelected) {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = '#00f0ff';
                this.ctx.strokeStyle = '#00f0ff';
                this.ctx.lineWidth = 4;
            } else {
                this.ctx.strokeStyle = objColor;
                this.ctx.lineWidth = 2;
            }

            if (o.type === 'mirror' || o.type === 'prism') {
                const pts = o.type === 'mirror' ? this.getMirrorPoints(o) : this.getPrismPoints(o);
                this.ctx.beginPath();
                this.ctx.moveTo(pts[0].x, pts[0].y);
                for (let k = 1; k < pts.length; k++) this.ctx.lineTo(pts[k].x, pts[k].y);
                if (o.type === 'prism') this.ctx.closePath();
                this.ctx.stroke();

                // Draw angle label if selected or always for clarity
                if (isSelected && o.angle !== undefined) {
                    const deg = Math.round(o.angle * (180 / Math.PI));
                    this.ctx.fillStyle = '#00f0ff';
                    this.ctx.font = 'bold 14px Inter, sans-serif';
                    this.ctx.fillText(`${deg}°`, o.pos.x + 20, o.pos.y - 20);
                }
            }
            this.ctx.shadowBlur = 0;
        });
    }

    getMirrorPoints(o) {
        if (o.p1 && o.p2) return [o.p1, o.p2];
        if (!o.pos) return [new Vec2(0, 0), new Vec2(0, 0)];
        const halfLen = (o.length || 200) / 2;
        const angle = o.angle || 0;
        const p1 = new Vec2(o.pos.x - Math.cos(angle) * halfLen, o.pos.y - Math.sin(angle) * halfLen);
        const p2 = new Vec2(o.pos.x + Math.cos(angle) * halfLen, o.pos.y + Math.sin(angle) * halfLen);
        return [p1, p2];
    }

    getPrismPoints(o) {
        if (!o.pos) return [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0)];
        const s = 60;
        const angle = o.angle || 0;
        const p1 = new Vec2(Math.cos(angle) * s, Math.sin(angle) * s).add(o.pos);
        const p2 = new Vec2(Math.cos(angle + 2.094) * s, Math.sin(angle + 2.094) * s).add(o.pos);
        const p3 = new Vec2(Math.cos(angle + 4.188) * s, Math.sin(angle + 4.188) * s).add(o.pos);
        return [p1, p2, p3];
    }

    getIntersections(ro, rd, obj) {
        const hits = [];
        if (obj.type === 'mirror') {
            const pts = this.getMirrorPoints(obj);
            const h = this.intersect(ro, rd, pts[0], pts[1]);
            if (h) {
                const norm = new Vec2(-(pts[1].y - pts[0].y), pts[1].x - pts[0].x).unit();
                hits.push({ dist: h.dist, normal: norm });
            }
        } else if (obj.type === 'prism') {
            const pts = this.getPrismPoints(obj);
            for (let i = 0; i < 3; i++) {
                const p1 = pts[i];
                const p2 = pts[(i + 1) % 3];
                const h = this.intersect(ro, rd, p1, p2);
                if (h) {
                    const norm = new Vec2(-(p2.y - p1.y), p2.x - p1.x).unit();
                    hits.push({ dist: h.dist, normal: norm });
                }
            }
        }
        return hits;
    }

    intersect(ro, rd, p1, p2) {
        const v1 = ro.sub(p1);
        const v2 = p2.sub(p1);
        const v3 = new Vec2(-rd.y, rd.x);
        const dot = v2.dot(v3);
        if (Math.abs(dot) < 0.001) return null;
        const t1 = (v2.x * v1.y - v2.y * v1.x) / dot;
        const t2 = v1.dot(v3) / dot;
        if (t1 > 0.001 && t2 >= 0 && t2 <= 1) return { dist: t1 };
        return null;
    }

    getAtPos(pos) {
        if (this.laser.pos.dist(pos) < 20) return this.laser;

        return this.objects.find(o => {
            if (o.type === 'mirror') {
                const pts = this.getMirrorPoints(o);
                const dist = this.distToSegment(pos, pts[0], pts[1]);
                return dist < 20;
            }
            if (o.type === 'prism') return pos.dist(o.pos) < 50;
            return false;
        });
    }

    distToSegment(p, a, b) {
        const l2 = a.dist(b) ** 2;
        if (l2 === 0) return p.dist(a);
        let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return p.dist(new Vec2(a.x + t * (b.x - a.x), a.y + t * (b.y - a.y)));
    }

    getHTML() {
        return `
            <div class="sidebar-group-label" data-i18n="tools">ОПТИКА</div>
            <button class="tool-btn" id="o-mirror">➕ Зеркало</button>
            <button class="tool-btn" id="o-prism">➕ Призма</button>
        `;
    }

    handleToolClick(id) {
        const cx = this.engine.canvas.width / 2;
        const cy = this.engine.canvas.height / 2;
        if (id === 'o-mirror') {
            this.objects.push({ pos: new Vec2(cx, cy), length: 200, type: 'mirror', angle: 0 });
        }
        if (id === 'o-prism') {
            this.objects.push({ pos: new Vec2(cx, cy), type: 'prism', angle: 0 });
        }
    }

    getChartOptions() {
        return [
            { id: 'angle', label: 'angle' }
        ];
    }

    getDataForLog() {
        if (this.engine.selection && this.engine.selection.angle !== undefined) {
            const deg = Math.round(this.engine.selection.angle * (180 / Math.PI));
            return { angle: deg };
        }
        return { angle: 0 };
    }

    getSnapshot() {
        return {
            objectCount: this.objects.length,
            mirrorCount: this.objects.filter(o => o.type === 'mirror').length,
            prismCount: this.objects.filter(o => o.type === 'prism').length,
            isPaused: this.engine.isPaused
        };
    }
}
