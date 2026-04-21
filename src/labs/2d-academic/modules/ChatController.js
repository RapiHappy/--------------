export class ChatController {
    constructor(engine) {
        this.engine = engine;
        this.isOpen = false;
        this.messages = [];
        
        // Safe API Key Loading
        try {
            this.geminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
            this.yandexKey = import.meta.env.VITE_YANDEX_API_KEY || '';
            this.folderId = import.meta.env.VITE_YANDEX_FOLDER_ID || '';
        } catch (e) {
            console.error("AI: Environment variables are inaccessible.", e);
            this.geminiKey = '';
            this.yandexKey = '';
            this.folderId = '';
        }
        
        if (!this.geminiKey && !this.yandexKey) {
            console.warn("TechPhys AI: No API keys found. AI features will be disabled.");
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

        if (!this.geminiKey && !this.yandexKey) {
            this.removeTypingIndicator(typingId);
            this.addMessage("Ошибка: API ключи не найдены. Проверьте файл .env.", 'bot');
            return;
        }

        try {
            const systemPrompt = `You are TechPhys AI, a brilliant and helpful physics assistant. Answer questions concisely and scientifically. Use markdown for formulas. 
Current Laboratory: ${this.engine.activeLab}.
Current Missions:
${this.engine.missions ? this.engine.missions.getCurrentMissionsText() : 'None'}

If the user asks to perform an action or needs help with tasks, include a JSON command at the end of your message in the format: [COMMAND: ACTION_NAME, params]. 
Actions include: 
- SPAWN_BALL: Create a ball in mechanics
- CLEAR: Clear all objects in the current lab
- SET_GRAVITY, value: Change gravity
- SHOW_MISSIONS: Generate new AI missions/tasks for the user or refresh current ones.`;

            let aiText = "";

            if (this.yandexKey && this.folderId) {
                // Use Proxy for Yandex GPT
                const response = await fetch("/yandex-api/foundationModels/v1/completion", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Api-Key ${this.yandexKey}`
                    },
                    body: JSON.stringify({
                        modelUri: `gpt://${this.folderId}/yandexgpt-lite/latest`,
                        completionOptions: { stream: false, temperature: 0.6, maxTokens: "1000" },
                        messages: [
                            { role: "system", text: systemPrompt },
                            { role: "user", text: text }
                        ]
                    })
                });
                const data = await response.json();
                if (data.error) throw new Error(data.error.message || "Yandex Error");
                aiText = data.result.alternatives[0].message.text;
            } else if (this.geminiKey) {
                // Use Proxy for Gemini
                const response = await fetch(`/gemini-api/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Question: ${text}` }] }],
                        generationConfig: { temperature: 0.7, topP: 0.95, topK: 40, maxOutputTokens: 1024 }
                    })
                });
                const data = await response.json();
                if (data.error) throw new Error(data.error.message || "Gemini Error");
                aiText = data.candidates[0].content.parts[0].text;
            }

            this.removeTypingIndicator(typingId);
            this.processAiResponse(aiText);

        } catch (err) {
            this.removeTypingIndicator(typingId);
            this.addMessage("Connection error. Please try again.", 'bot');
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

            if (this.yandexKey && this.folderId) {
                console.log("Fetching missions via Proxy to Yandex GPT...");
                const response = await fetch("/yandex-api/foundationModels/v1/completion", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Api-Key ${this.yandexKey}`
                    },
                    body: JSON.stringify({
                        modelUri: `gpt://${this.folderId}/yandexgpt-lite/latest`,
                        completionOptions: { stream: false, temperature: 0.8, maxTokens: "1000" },
                        messages: [
                            { role: "system", text: systemPrompt },
                            { role: "user", text: "Please return the 3 missions in the requested JSON format." }
                        ]
                    })
                });
                const data = await response.json();
                if (!data.result || !data.result.alternatives) {
                    throw new Error("Yandex GPT returned invalid data: " + JSON.stringify(data));
                }
                missionsStr = data.result.alternatives[0].message.text;
            } else if (this.geminiKey) {
                console.log("Fetching missions via Proxy to Gemini...");
                const response = await fetch(`/gemini-api/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: systemPrompt }] }],
                        generationConfig: { responseMimeType: "application/json" }
                    })
                });
                const data = await response.json();
                if (!data.candidates) throw new Error("Invalid Gemini Response: " + JSON.stringify(data));
                missionsStr = data.candidates[0].content.parts[0].text;
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
