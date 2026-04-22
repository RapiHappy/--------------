export class ChatController {
    constructor(engine) {
        this.engine = engine;
        this.isOpen = false;
        this.messages = [];
        
        // Safe API Key Loading
        try {
            const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};
            this.hfToken = env.VITE_HF_TOKEN || '';
            this.hfModel = env.VITE_HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2';
        } catch (e) {
            console.error("AI: Environment variables are inaccessible.", e);
            this.hfToken = '';
            this.hfModel = 'mistralai/Mistral-7B-Instruct-v0.2';
        }
        
        if (!this.hfToken) {
            console.warn("TechPhys AI: Hugging Face Token missing. AI features will be disabled.");
        }
        
        this.setupUI();
    }

    setupUI() {
        this.window = document.getElementById('chat-window');
        this.container = document.getElementById('chat-messages');
        this.input = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('chat-send');
        this.toggleBtn = document.getElementById('chat-header-toggle');
        this.reopenBtn = document.getElementById('chat-reopen-btn');
        this.closeBtn = document.getElementById('chat-close');

        if (this.sendBtn) this.sendBtn.addEventListener('click', (e) => { e.stopPropagation(); this.sendMessage(); });
        if (this.input) this.input.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.stopPropagation(); this.sendMessage(); } });
        if (this.toggleBtn) this.toggleBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggle(); });
        if (this.reopenBtn) this.reopenBtn.addEventListener('click', (e) => { e.stopPropagation(); this.open(); });
        if (this.closeBtn) this.closeBtn.addEventListener('click', (e) => { e.stopPropagation(); this.close(); });

        document.querySelectorAll('.chat-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                e.stopPropagation();
                this.input.value = chip.innerText;
                this.sendMessage();
            });
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.window.classList.remove('closed');
        this.isOpen = true;
    }

    close() {
        this.window.classList.add('closed');
        this.isOpen = false;
    }

    async sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        this.input.value = '';

        const typingId = this.addTypingIndicator();

        try {
            const systemPrompt = `You are TechPhys AI, a brilliant physics assistant. Answer concisely. 
Current Lab: ${this.engine.activeLab}.
Commands: [COMMAND: SPAWN_BALL], [COMMAND: CLEAR], [COMMAND: SET_GRAVITY, val].`;

            if (!this.hfToken) {
                this.removeTypingIndicator(typingId);
                this.addMessage("Ошибка: Токен не найден.", 'bot');
                return;
            }

            // Using the more stable v1/chat/completions endpoint
            const hfUrl = `https://api-inference.huggingface.co/v1/chat/completions`;
            const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(hfUrl)}`;

            const response = await fetch(proxiedUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.hfToken}`
                },
                body: JSON.stringify({
                    model: "google/gemma-2-9b-it",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: text }
                    ],
                    max_tokens: 500
                })
            });

            if (!response.ok) throw new Error(`API Error ${response.status}`);

            const data = await response.json();
            const aiText = data.choices[0].message.content;

            this.removeTypingIndicator(typingId);
            this.processAiResponse(aiText);

        } catch (err) {
            this.removeTypingIndicator(typingId);
            this.addMessage(`AI Error: ${err.message}`, 'bot');
            console.error(err);
        }
    }

    processAiResponse(content) {
        // Parse custom command format [COMMAND: ACTION, PARAMS]
        const commandMatch = content.match(/\[COMMAND:\s*(\w+),\s*(.*?)\]/);
        let cleanText = content.replace(/\[COMMAND:.*?\]/g, '').trim();

        this.addMessage(cleanText, 'bot');

        if (commandMatch) {
            const action = commandMatch[1];
            const params = commandMatch[2];
            this.executeCommand(action, params);
        }
    }

    executeCommand(action, params) {
        console.log("AI Command:", action, params);
        // Map AI commands to Engine actions
        if (action === 'SPAWN_BALL') {
            const lab = this.engine.labs.mechanics;
            lab.handleToolClick('create-ball');
        }
        if (action === 'CLEAR') {
            this.engine.clearLabState();
        }
        if (action === 'SET_GRAVITY') {
            const val = parseFloat(params);
            if (!isNaN(val)) this.engine.labs.mechanics.gravity = val;
        }
        if (action === 'SHOW_MISSIONS') {
            if (this.engine.missions) this.engine.missions.generateAIMissions(true);
        }
    }

    addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        msg.innerText = text;
        this.container.appendChild(msg);
        this.container.scrollTop = this.container.scrollHeight;
    }

    addTypingIndicator() {
        const id = 'typing-' + Date.now();
        const msg = document.createElement('div');
        msg.className = 'message bot typing';
        msg.id = id;
        msg.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        this.container.appendChild(msg);
        this.container.scrollTop = this.container.scrollHeight;
        return id;
    }

    removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    async requestMissions(category, difficulty) {
        try {
            const systemPrompt = `You are a physics educational system. Generate 3 distinct interactive sandbox missions for the category: ${category}. Difficulty: ${difficulty}. 
Return valid JSON ONLY in this format: 
{ "missions": [ { "id": "u1", "title": {"ru": "...", "en": "..."}, "desc": {"ru": "...", "en": "..."}, "checkCondition": "VARIABLE OPERATOR VALUE" } ] }

Available Variables:
- mechanics: ballCount, springCount, objectCount, maxSpeed, gravity, timeScale
- thermo: temp, vol, particleCount
- optics: mirrorCount, prismCount, objectCount
- electro: chargeCount, posChargeCount, negChargeCount

Operators: >, <, >=, <=, ===
Examples: "maxSpeed > 50", "temp > 400", "mirrorCount >= 2", "timeScale < 0.5".
Ensure the mission description matches the technical checkCondition.`;

            let missionsStr = "";

            if (this.hfToken) {
                const hfUrl = `https://api-inference.huggingface.co/v1/chat/completions`;
                const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(hfUrl)}`;

                const response = await fetch(proxiedUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.hfToken}`
                    },
                    body: JSON.stringify({
                        model: "google/gemma-2-9b-it",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: "Please return the 3 missions in the requested JSON format." }
                        ],
                        max_tokens: 1000
                    })
                });
                
                if (!response.ok) throw new Error(`API Error ${response.status}`);

                const data = await response.json();
                missionsStr = data.choices[0].message.content;
            } else {
                throw new Error("Hugging Face Token not configured.");
            }

            // Robust JSON Extraction: Find the first '{' and last '}'
            const startIdx = missionsStr.indexOf('{');
            const endIdx = missionsStr.lastIndexOf('}') + 1;
            if (startIdx === -1 || endIdx === 0) throw new Error("No JSON found in response");
            
            const cleaned = missionsStr.substring(startIdx, endIdx);
            const parsed = JSON.parse(cleaned);
            
            if (!parsed.missions) throw new Error("Missions field not found in JSON");
            return parsed.missions;
        } catch (err) {
            console.error("AI Mission Fetch Error:", err);
            return null;
        }
    }
}
