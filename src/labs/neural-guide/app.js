import * as THREE from 'three';
import { MasterVortexLoader } from '../../shared/SpecialEffects.js';

window.onload = () => {
    const loader = new MasterVortexLoader('neuralCanvas');
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            loader.stop();
        }, 1000);
    }, 3500);
};
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PhysicsEngine } from './physics.js';
import { VoiceController } from './voice.js';

// ================= ТЕРМИНАЛ ЛОГОВ =================
const terminal = document.getElementById('terminal-content');
function logTerminal(msg, type='info') {
    const el = document.createElement('div');
    el.innerText = msg;
    if (type === 'err') el.className = 'text-pink-500';
    else if (type === 'success') el.className = 'text-cyan-400';
    else el.className = 'text-cyan-200/50';
    
    if(terminal) {
        terminal.appendChild(el);
        terminal.scrollTop = terminal.scrollHeight;
    }
}

// ================= THREE.JS ИНИЦИАЛИЗАЦИЯ =================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);

// Дефолтная позиция камеры для WebGL-фоллбэка
camera.position.set(0, 1.5, 3); 

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.xr.enabled = true; // Активация WebXR API
document.getElementById('webgl-container').appendChild(renderer.domElement);

// Добавляем AR кнопку
const arOptions = { 
    requiredFeatures: ['hit-test'], 
    optionalFeatures: ['dom-overlay'], 
    domOverlay: { root: document.body } 
};
const arContainer = document.getElementById('ar-button-container');
if(arContainer) arContainer.appendChild(ARButton.createButton(renderer, arOptions));

// Контролы для десктопа (Фоллбэк)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

// ================= ОСВЕЩЕНИЕ И ОКРУЖЕНИЕ =================
const hemiLight = new THREE.HemisphereLight(0x00ffff, 0xff00ff, 0.8);
hemiLight.position.set(0, 5, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(2, 5, 2);
scene.add(dirLight);

// Сетка (Пол) для ориентации в пространстве без AR
const gridHelper = new THREE.GridHelper(20, 40, 0x00ffff, 0xff00ff);
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.15;
scene.add(gridHelper);

// AR Прицел (Reticle) для позиционирования
let reticle;
const reticleGeometry = new THREE.RingGeometry(0.1, 0.12, 32).rotateX(-Math.PI / 2);
const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

let hitTestSource = null;
let hitTestSourceRequested = false;
let xrSessionActive = false;

// Слушатели статуса AR сессии
renderer.xr.addEventListener('sessionstart', () => {
    xrSessionActive = true;
    document.getElementById('status-text').innerText = 'SYSTEM: AR MODE RUNNING / HIT-TEST ACTIVE';
    // В AR сетку убираем, чтобы видеть реальный мир
    gridHelper.visible = false; 
});

renderer.xr.addEventListener('sessionend', () => {
    xrSessionActive = false;
    hitTestSource = null;
    hitTestSourceRequested = false;
    document.getElementById('status-text').innerText = 'SYSTEM: WebGL FALLBACK (NO AR)';
    gridHelper.visible = true;
});


// ================= ФИЗИКА И ОБЪЕКТЫ =================
const physics = new PhysicsEngine();
const objects = []; // Хранит { mesh, body, sprite }

// Материал для всех объектов (Неоновое стекло)
const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
const sphereMat = new THREE.MeshPhysicalMaterial({ 
    color: 0x00ffff, 
    emissive: 0x008888,
    emissiveIntensity: 0.5,
    transmission: 0.9,
    opacity: 1,
    metalness: 0,
    roughness: 0.1,
    ior: 1.5,
    thickness: 0.5,
    clearcoat: 1
});

// Дополнительный Wireframe-каркас для киберпанк-стиля
const wireMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true, transparent: true, opacity: 0.2 });

// Генерация голографического текста
function makeTextSprite(message) {
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size/4;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, size, size/4);
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 5;
    ctx.strokeRect(0,0, size, size/4);

    ctx.font = 'bold 48px "Share Tech Mono"';
    ctx.fillStyle = '#FF00FF'; 
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, size/2, size/8);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.6, 0.15, 0.6); // Масштаб в метрах
    return sprite;
}

// Глобальная функция создания физического объекта
function spawnObject(mass, speed) {
    let spawnPosition = new THREE.Vector3(0, 2, -2); // Дефолт перед камерой
    let velocity = new THREE.Vector3(0, 0, 0);

    // Если в AR мы нашли плоскость (Reticle виден)
    if (xrSessionActive && reticle.visible) {
        spawnPosition.setFromMatrixPosition(reticle.matrix);
        spawnPosition.y += 0.5; // Сбрасываем с высоты 0.5м над столом
    } else {
        // Фоллбэк: Выстреливаем из камеры
        spawnPosition.copy(camera.position);
    }

    // Если задана скорость, стреляем по направлению взгляда
    if (speed > 0) {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        velocity.copy(direction.multiplyScalar(speed));
        // Стреляем чуток вперед, чтоб не в самой камере спавнить
        spawnPosition.addScaledVector(direction, 0.5); 
    }

    // Визуальный радиус зависит от кубического корня массы
    const radius = Math.max(0.05 * Math.pow(mass, 1/3), 0.05); 

    // Визуал (Группа из стекла и сетки)
    const meshGroup = new THREE.Group();
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    const wire = new THREE.Mesh(sphereGeo, wireMaterial);
    mesh.add(wire);
    meshGroup.scale.set(radius, radius, radius);
    scene.add(meshGroup);

    // Голограмма текста
    const sprite = makeTextSprite(`m:${mass} v:${speed}`);
    scene.add(sprite);

    // Физика
    const body = physics.addSphere(mass, radius, spawnPosition, velocity);

    objects.push({ mesh: meshGroup, body, sprite });
    logTerminal(`>> ОБЪЕКТ ДОБАВЛЕН (m: ${mass}kg, v: ${speed}m/s)`, 'success');
}

function clearScene() {
    objects.forEach(obj => {
        scene.remove(obj.mesh);
        scene.remove(obj.sprite);
        physics.removeBody(obj.body);
    });
    objects.length = 0;
    logTerminal('>> СИМУЛЯЦИЯ ОЧИЩЕНА.', 'info');
}

// ================= ГОЛОСОВОЕ УПРАВЛЕНИЕ =================
const micBtn = document.getElementById('mic-btn');
const voiceController = new VoiceController(
    // Callback парсинга команд
    (command) => {
        if (command.action === 'SPAWN_SPHERE') {
            spawnObject(command.mass, command.speed);
        } else if (command.action === 'CLEAR') {
            clearScene();
        }
    }, 
    // Callback статусов
    (status, msg) => {
        if (status === 'start') {
            micBtn.classList.add('mic-recording');
            document.getElementById('status-text').innerText = 'SYSTEM: LISTENING VOICE COMAND...';
        } else if (status === 'end') {
            micBtn.classList.remove('mic-recording');
            document.getElementById('status-text').innerText = xrSessionActive ? 'SYSTEM: AR MODE RUNNING' : 'SYSTEM: WebGL FALLBACK';
        } else if (status === 'log') {
            logTerminal(msg, 'success');
        } else if (status === 'log-err') {
            logTerminal(msg, 'err');
        }
    }
);

if (!voiceController.recognition) {
    logTerminal('>> VOICE_RECOGNITION NOT SUPPORTED!', 'err');
    micBtn.style.opacity = '0.3';
}

micBtn.addEventListener('click', () => {
    voiceController.startListening();
});

// ================= ИГРОВОЙ ЦИКЛ =================
const clock = new THREE.Clock();

function render(timestamp, frame) {
    const dt = Math.min(clock.getDelta(), 0.1);

    // 1. Физика
    physics.update(dt);

    // 2. Синхронизация 3D объектов с физикой
    objects.forEach(obj => {
        obj.mesh.position.copy(obj.body.position);
        obj.mesh.quaternion.copy(obj.body.quaternion);

        // Спрайты летят чуть выше шара и всегда смотрят на камеру
        obj.sprite.position.copy(obj.body.position);
        obj.sprite.position.y += obj.mesh.scale.y * 1.5 + 0.1;
    });

    // 3. Логика WebXR Hit Test
    if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (hitTestSourceRequested === false) {
            session.requestReferenceSpace('viewer').then((referenceSpace) => {
                session.requestHitTestSource({ space: referenceSpace }).then((source) => {
                    hitTestSource = source;
                });
            });
            session.addEventListener('end', () => {
                hitTestSourceRequested = false;
                hitTestSource = null;
            });
            hitTestSourceRequested = true;
        }

        if (hitTestSource) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);
            if (hitTestResults.length > 0) {
                const hit = hitTestResults[0];
                const pose = hit.getPose(referenceSpace);
                reticle.visible = true;
                reticle.matrix.fromArray(pose.transform.matrix);
            } else {
                reticle.visible = false;
            }
        }
    }

    // В WebGL режиме обновляем контролы
    if (!xrSessionActive) {
        controls.update();
    }

    // 4. Отрисовка
    renderer.render(scene, camera);
}

// Запускаем цикл (специальный метод для WebXR)
renderer.setAnimationLoop(render);

// Адаптивность 
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Приветствие
setTimeout(() => {
    logTerminal('>> SYSTEM ONLINE. НАЖМИТЕ ЗНАЧОК МИКРОФОНА ДЛЯ ВВОДА.', 'info');
}, 1000);
