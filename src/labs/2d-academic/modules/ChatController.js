export class ChatController {
    constructor(engine) {
        this.engine = engine;
        this.isOpen = false;
        this.messages = [];
        try {
            this.openaiKey = import.meta?.env?.VITE_OPENAI_API_KEY || '';
        } catch(e) {
            this.openaiKey = '';
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

        if (this.sendBtn) this.sendBtn.onclick = () => this.sendMessage();
        if (this.input) this.input.onkeypress = (e) => { if (e.key === 'Enter') this.sendMessage(); };
        if (this.toggleBtn) this.toggleBtn.onclick = () => this.toggle();
        if (this.reopenBtn) this.reopenBtn.onclick = () => this.open();
        if (this.closeBtn) this.closeBtn.onclick = () => this.close();

        document.querySelectorAll('.chat-chip').forEach(chip => {
            chip.onclick = () => {
                this.input.value = chip.innerText;
                this.sendMessage();
            };
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
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openaiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: "You are TechPhys AI, a brilliant and helpful physics assistant. Answer questions concisely and scientifically. Use markdown for formulas. If the user asks to perform an action in the lab, always include a JSON command at the end of your message in the format: [COMMAND: ACTION_NAME, params]. Actions include: SPAWN_BALL, SPAWN_BOX, CLEAR, SET_GRAVITY." },
                        { role: "user", content: text }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            this.removeTypingIndicator(typingId);

            if (data.error) {
                this.addMessage(`AI Error: ${data.error.message}`, 'bot');
                return;
            }

            const aiText = data.choices[0].message.content;
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
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openaiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        { 
                            role: "system", 
                            content: `You are a physics educational system. Generate 3 distinct interactive sandbox missions for the category: ${category}. Difficulty: ${difficulty}. 
                            Return valid JSON ONLY in this format: 
                            { "missions": [ { "id": "u1", "title": {"ru": "...", "en": "..."}, "desc": {"ru": "...", "en": "..."}, "type": "action_check" } ] }
                            Types: action_check (requires user to do something). Titles and desk must be fun and academic.`
                        }
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.8
                })
            });
            const data = await response.json();
            const missionsStr = data.choices[0].message.content;
            return JSON.parse(missionsStr).missions;
        } catch (err) {
            console.error("AI Mission Fetch Error:", err);
            return null;
        }
    }
}
