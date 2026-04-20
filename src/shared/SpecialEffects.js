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
        this.ctx.font = 'bold 80px "Outfit", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.text, this.canvas.width/2, this.canvas.height/2);
        
        const data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let y = 0; y < this.canvas.height; y += 4) {
            for (let x = 0; x < this.canvas.width; x += 4) {
                const index = (y * this.canvas.width + x) * 4;
                if (data[index + 3] > 128) {
                    this.particles.push(new VortexParticle(x, y, this.canvas.width/2, this.canvas.height/2));
                }
            }
        }
    }

    animate() {
        if (!this.active) return;
        this.ctx.fillStyle = 'rgba(6, 8, 13, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            p.update(this.mouse);
            p.draw(this.ctx);
        });
        
        requestAnimationFrame(() => this.animate());
    }

    stop() {
        this.active = false;
        this.canvas.parentElement.style.opacity = '0';
        setTimeout(() => this.canvas.parentElement.style.display = 'none', 1000);
    }
}

class VortexParticle {
    constructor(tx, ty, cx, cy) {
        this.tx = tx; // Target X
        this.ty = ty; // Target Y
        this.x = cx + (Math.random() - 0.5) * 500;
        this.y = cy + (Math.random() - 0.5) * 500;
        this.originX = this.x;
        this.originY = this.y;
        this.size = Math.random() * 2 + 1;
        this.color = `hsl(${180 + Math.random() * 40}, 100%, 70%)`;
        this.ease = 0.05 + Math.random() * 0.05;
        this.friction = 0.95;
        this.vx = 0;
        this.vy = 0;
    }

    update(mouse) {
        // Formation logic
        let dx = this.tx - this.x;
        let dy = this.ty - this.y;
        this.vx += dx * this.ease;
        this.vy += dy * this.ease;
        
        // Mouse interaction
        let mdx = mouse.x - this.x;
        let mdy = mouse.y - this.y;
        let mdist = Math.sqrt(mdx*mdx + mdy*mdy);
        if (mdist < 100) {
            let angle = Math.atan2(mdy, mdx);
            let force = (100 - mdist) / 100;
            this.vx -= Math.cos(angle) * force * 20;
            this.vy -= Math.sin(angle) * force * 20;
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
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        ctx.save();
        ctx.translate(this.canvas.width/2, this.canvas.height/2);
        ctx.rotate(this.angle);
        
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff00ff';
        
        // Draw nested rotating squares for 3D feel
        for(let i=0; i<5; i++) {
            ctx.rotate(this.angle * 0.2);
            let s = 100 + i * 30;
            ctx.strokeRect(-s/2, -s/2, s, s);
        }
        
        ctx.restore();
        this.angle += 0.02;
        requestAnimationFrame(() => this.animate());
    }

    stop() {
        this.active = false;
        this.canvas.parentElement.style.opacity = '0';
        setTimeout(() => this.canvas.parentElement.style.display = 'none', 1000);
    }
}

/** Neural Pulse Loader for AI Phase */
export class PulseLoader {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.pulses = [];
        this.active = true;
        this.resize();
        this.animate();
        setInterval(() => this.spawnPulse(), 600);
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    spawnPulse() {
        if(!this.active) return;
        this.pulses.push({ r: 0, a: 1 });
    }

    animate() {
        if (!this.active) return;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const cx = this.canvas.width/2;
        const cy = this.canvas.height/2;
        
        this.pulses.forEach((p, i) => {
            p.r += 3;
            p.a -= 0.005;
            if (p.a <= 0) this.pulses.splice(i, 1);
            
            ctx.strokeStyle = `rgba(168, 85, 247, ${p.a})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
            ctx.stroke();
        });
        
        requestAnimationFrame(() => this.animate());
    }

    stop() {
        this.active = false;
        this.canvas.parentElement.style.opacity = '0';
        setTimeout(() => this.canvas.parentElement.style.display = 'none', 1000);
    }
}
