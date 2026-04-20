/**
 * Unified Gallery of Premium Loaders for TechPhys
 */

export class MasterVortexLoader {
    constructor(canvasId, text = "TECHPHYS") {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.text = text;
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.active = true;
        this.hueShift = 0;
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    init() {
        this.resize();
        this.createParticlesFromText();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticlesFromText() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = `bold ${Math.min(window.innerWidth/10, 80)}px "Outfit", sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.text, this.canvas.width/2, this.canvas.height/2);
        
        const data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Lower density for better constellation performance
        const gap = 6; 
        for (let y = 0; y < this.canvas.height; y += gap) {
            for (let x = 0; x < this.canvas.width; x += gap) {
                const index = (y * this.canvas.width + x) * 4;
                if (data[index + 3] > 128) {
                    this.particles.push(new ConstellationParticle(x, y, this.canvas.width/2, this.canvas.height/2));
                }
            }
        }
    }

    animate() {
        if (!this.active) return;
        
        this.ctx.fillStyle = 'rgba(5, 6, 8, 0.2)'; // Faint trail
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Additive blending for glow look
        this.ctx.globalCompositeOperation = 'lighter';
        this.hueShift += 0.5;

        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            p1.update(this.mouse);
            p1.draw(this.ctx);

            // Limited connections for performance
            if (i % 2 === 0) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    if (j % 5 !== 0) continue; 
                    const p2 = this.particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = dx * dx + dy * dy;
                    
                    if (dist < 1500) {
                        this.ctx.strokeStyle = `rgba(${100 + Math.sin(this.hueShift*0.01)*50}, 240, 255, ${0.15 * (1 - dist/1500)})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.beginPath();
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.stroke();
                    }
                }
            }
        }
        
        this.ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(() => this.animate());
    }

    stop() {
        this.active = false;
        if (this.canvas) {
            this.canvas.parentElement.style.opacity = '0';
            setTimeout(() => this.canvas.parentElement.style.display = 'none', 1000);
        }
    }
}

class ConstellationParticle {
    constructor(tx, ty, cx, cy) {
        this.tx = tx; // Target
        this.ty = ty;
        this.x = cx + (Math.random() - 0.5) * window.innerWidth;
        this.y = cy + (Math.random() - 0.5) * window.innerHeight;
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.92;
        this.ease = 0.04 + Math.random() * 0.03;
        this.size = Math.random() * 1.2 + 0.8;
        this.color = Math.random() > 0.5 ? '#00f0ff' : '#ff00ff';
        this.baseSize = this.size;
    }

    update(mouse) {
        let dx = this.tx - this.x;
        let dy = this.ty - this.y;
        this.vx += dx * this.ease;
        this.vy += dy * this.ease;

        // Mouse pulse interaction
        let mdx = mouse.x - this.x;
        let mdy = mouse.y - this.y;
        let mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100) {
            let angle = Math.atan2(mdy, mdx);
            let force = (100 - mdist) / 100;
            this.vx -= Math.cos(angle) * force * 12;
            this.vy -= Math.sin(angle) * force * 12;
            this.size = this.baseSize * 2;
        } else {
            this.size += (this.baseSize - this.size) * 0.1;
        }

        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

/** 3D Wireframe Loader for AR Page */
export class WireframeLoader {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.angle = 0;
        this.active = true;
        this.resize();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        if (!this.active) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = '#00f0ff';
        this.ctx.lineWidth = 1;
        this.angle += 0.01;

        const size = 150;
        const cx = this.canvas.width/2;
        const cy = this.canvas.height/2;

        for (let i = -1; i <= 1; i += 2) {
            for (let j = -1; j <= 1; j += 2) {
                for (let k = -1; k <= 1; k += 2) {
                    this.drawPoint(cx + i*size, cy + j*size, k*size);
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }

    drawPoint(x, y, z) {
        // Simple projection
        const p = this.rotate(x, y, z);
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
        this.ctx.stroke();
    }

    rotate(x, y, z) {
        let rad = this.angle;
        let cosa = Math.cos(rad);
        let sina = Math.sin(rad);
        let x1 = x * cosa - z * sina;
        let z1 = x * sina + z * cosa;
        return { x: x1, y: y };
    }

    stop() {
        this.active = false;
        if (this.canvas) this.canvas.style.display = 'none';
    }
}

/**
 * QuantumPulseLoader: High-performance premium loader for TechPhys Hub
 * Optimized for 60FPS with orbital motion and glow effects
 */
export class QuantumPulseLoader {
    constructor(canvasId, text = "TECHPHYS") {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.text = text;
        this.active = true;
        this.angle = 0;
        this.circles = [
            { r: 90, speed: 0.05, color: '#00f0ff', pCount: 12 },
            { r: 140, speed: -0.04, color: '#ff00ff', pCount: 16 },
            { r: 190, speed: 0.03, color: '#a855f7', pCount: 10 }
        ];
        this.stars = Array.from({length: 100}, () => ({
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
            s: Math.random() * 2
        }));
        
        this.resize();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        if (!this.active) return;
        
        this.ctx.fillStyle = 'rgba(5, 6, 8, 0.08)'; // Higher trail persistence
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.angle += 0.04; // Faster
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        
        this.ctx.globalCompositeOperation = 'lighter';
        
        this.circles.forEach((c, idx) => {
            const rot = this.angle * c.speed * 50;
            
            // Draw Orbit Ring
            this.ctx.strokeStyle = c.color;
            this.ctx.lineWidth = 3;
            this.ctx.globalAlpha = 0.4; // MUCH MORE VISIBLE
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, c.r, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.globalAlpha = 1.0;
            
            // Draw Orbiting Particles
            for(let i=0; i<c.pCount; i++) {
                const step = (Math.PI * 2) / c.pCount;
                const a = rot + i * step;
                const px = cx + Math.cos(a) * c.r;
                const py = cy + Math.sin(a) * c.r;
                
                const grad = this.ctx.createRadialGradient(px, py, 0, px, py, 40);
                grad.addColorStop(0, c.color);
                grad.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = grad;
                this.ctx.beginPath();
                this.ctx.arc(px, py, 40, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.fillStyle = '#fff';
                this.ctx.beginPath();
                this.ctx.arc(px, py, 4, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        // DRAW STARS
        this.ctx.fillStyle = '#fff';
        this.stars.forEach(s => {
            const x = cx + s.x * cx + Math.cos(this.angle) * 20;
            const y = cy + s.y * cy + Math.sin(this.angle) * 20;
            this.ctx.globalAlpha = Math.random() * 0.5 + 0.2;
            this.ctx.fillRect(x, y, s.s, s.s);
        });
        this.ctx.globalAlpha = 1.0;

        // DRAW CENTRAL QUANTUM CORE
        const pulse = Math.sin(this.angle * 3) * 8 + 30;
        const coreGrad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, pulse * 2.5);
        coreGrad.addColorStop(0, '#fff');
        coreGrad.addColorStop(0.2, '#00f0ff');
        coreGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.3)');
        coreGrad.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = coreGrad;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, pulse * 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(() => this.animate());
    }

    stop() {
        this.active = false;
        if (this.canvas) {
            const parent = this.canvas.parentElement;
            if (parent) {
                parent.style.opacity = '0';
                setTimeout(() => parent.style.display = 'none', 1000);
            }
        }
    }
}
