import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

// Variáveis globais
let scene, camera, renderer, controls;
let cube, sphere, cylinder;
let ambientLight, directionalLight;
let raycaster, mouse;
let selectedObject = null;
let composer, bloomPass, outlinePass;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let clock = new THREE.Clock();
let rotating = {
    cube: true,
    sphere: true,
    cylinder: true
};

// Texturas
const textureLoader = new THREE.TextureLoader();
const textures = {
    none: null,
    brick: {
        map: textureLoader.load('https://threejs.org/examples/textures/brick_diffuse.jpg'),
        normal: textureLoader.load('https://threejs.org/examples/textures/brick_normal.jpg')
    },
    wood: {
        map: textureLoader.load('https://threejs.org/examples/textures/hardwood2_diffuse.jpg'),
        normal: textureLoader.load('https://threejs.org/examples/textures/hardwood2_normal.jpg')
    }
};

// Função de inicialização
function init() {
    // Criar a cena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    // Configurar câmera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Configurar renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Raycaster para seleção de objetos
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Adicionar iluminação
    setupLights();

    // Criar os objetos 3D
    createObjects();

    // Configurar controles da câmera
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Configurar o post-processing
    setupPostProcessing();

    // Adicionar event listeners
    setupEventListeners();

    // Inicializar UI
    setupUI();

    // Iniciar o loop de animação
    animate();
}

// Configurar iluminação
function setupLights() {
    // Luz ambiente
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Luz direcional (simula o sol)
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    
    // Melhorar a qualidade das sombras
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    
    scene.add(directionalLight);
}

// Criar os objetos 3D
function createObjects() {
    // Adicionar um plano (chão)
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaaa,
        side: THREE.DoubleSide,
        roughness: 0.8
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    scene.add(plane);

    // Grelha para referência
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x888888);
    gridHelper.position.y = -1.99;
    scene.add(gridHelper);

    // 1. Cubo
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
    const cubeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3498db,
        roughness: 0.3,
        metalness: 0.2
    });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-2, 0, 0);
    cube.castShadow = true;
    cube.name = 'cube';
    scene.add(cube);

    // 2. Esfera
    const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xe74c3c,
        roughness: 0.1,
        metalness: 0
    });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 0, 0);
    sphere.castShadow = true;
    sphere.name = 'sphere';
    scene.add(sphere);

    // 3. Cilindro
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
    const cylinderMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2ecc71,
        roughness: 0.5,
        metalness: 0.1
    });
    cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(2, 0, 0);
    cylinder.castShadow = true;
    cylinder.name = 'cylinder';
    scene.add(cylinder);
}

// Configurar o post-processing
function setupPostProcessing() {
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Bloom pass
    bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.5,  // strength
        0.4,  // radius
        0.85  // threshold
    );
    bloomPass.enabled = false;
    composer.addPass(bloomPass);

    // Outline pass
    outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        scene,
        camera
    );
    outlinePass.edgeStrength = 3.0;
    outlinePass.edgeGlow = 0.5;
    outlinePass.edgeThickness = 1.0;
    outlinePass.visibleEdgeColor.set(0xffffff);
    outlinePass.hiddenEdgeColor.set(0x222222);
    outlinePass.enabled = false;
    composer.addPass(outlinePass);
}

// Configurar event listeners
function setupEventListeners() {
    // Redimensionamento da janela
    window.addEventListener('resize', onWindowResize);
    
    // Seleção de objetos com clique
    renderer.domElement.addEventListener('click', onMouseClick);
    
    // Controles de teclado
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
}

// Configurar a interface do usuário
function setupUI() {
    // Objeto selecionado
    const objectSelect = document.getElementById('object-select');
    objectSelect.addEventListener('change', function() {
        const objectName = this.value;
        selectObjectByName(objectName);
    });

    // Controle de cor
    const colorPicker = document.getElementById('color-picker');
    colorPicker.addEventListener('input', function() {
        if (selectedObject) {
            selectedObject.material.color.set(this.value);
        }
    });

    // Controle de escala
    const scaleSlider = document.getElementById('scale-slider');
    const scaleValue = document.getElementById('scale-value');
    scaleSlider.addEventListener('input', function() {
        if (selectedObject) {
            const scale = parseFloat(this.value);
            selectedObject.scale.set(scale, scale, scale);
            scaleValue.textContent = scale.toFixed(1);
        }
    });

    // Controle de textura
    const textureSelect = document.getElementById('texture-select');
    textureSelect.addEventListener('change', function() {
        if (selectedObject) {
            applyTexture(selectedObject, this.value);
        }
    });

    // Botão de reset
    const resetBtn = document.getElementById('reset-btn');
    resetBtn.addEventListener('click', function() {
        if (selectedObject) {
            resetObject(selectedObject);
        }
    });

    // Botão de rotação
    const rotateBtn = document.getElementById('rotate-btn');
    rotateBtn.addEventListener('click', function() {
        if (selectedObject) {
            const name = selectedObject.name;
            rotating[name] = !rotating[name];
            rotateBtn.textContent = rotating[name] ? "Parar" : "Girar";
        }
    });

    // Efeitos de pós-processamento
    const bloomEffect = document.getElementById('bloom-effect');
    bloomEffect.addEventListener('change', function() {
        bloomPass.enabled = this.checked;
    });

    const outlineEffect = document.getElementById('outline-effect');
    outlineEffect.addEventListener('change', function() {
        outlinePass.enabled = this.checked;
        if (this.checked && selectedObject) {
            outlinePass.selectedObjects = [selectedObject];
        }
    });

    // Slider de luz ambiente
    const ambientSlider = document.getElementById('ambient-slider');
    ambientSlider.addEventListener('input', function() {
        ambientLight.intensity = parseFloat(this.value);
    });
}

// Função para aplicar textura a um objeto
function applyTexture(object, textureName) {
    const texture = textures[textureName];
    
    if (textureName === 'none') {
        object.material.map = null;
        object.material.normalMap = null;
        object.material.needsUpdate = true;
        return;
    }
    
    if (texture) {
        object.material.map = texture.map;
        object.material.normalMap = texture.normal;
        object.material.needsUpdate = true;
    }
}

// Resetar um objeto para seu estado original
function resetObject(object) {
    // Resetar escala
    object.scale.set(1, 1, 1);
    document.getElementById('scale-slider').value = 1;
    document.getElementById('scale-value').textContent = '1.0';
    
    // Resetar textura
    object.material.map = null;
    object.material.normalMap = null;
    object.material.needsUpdate = true;
    document.getElementById('texture-select').value = 'none';

    // Resetar cor
    let defaultColor;
    switch(object.name) {
        case 'cube': defaultColor = '#3498db'; break;
        case 'sphere': defaultColor = '#e74c3c'; break;
        case 'cylinder': defaultColor = '#2ecc71'; break;
    }
    
    object.material.color.set(defaultColor);
    document.getElementById('color-picker').value = defaultColor;
    
    // Resetar rotação
    object.rotation.set(0, 0, 0);
}

// Selecionar objeto pelo nome
function selectObjectByName(name) {
    let object;
    switch(name) {
        case 'cube': object = cube; break;
        case 'sphere': object = sphere; break;
        case 'cylinder': object = cylinder; break;
    }
    
    if (object) {
        selectObject(object);
    }
}

// Selecionar um objeto
function selectObject(object) {
    selectedObject = object;
    
    // Atualizar UI
    document.getElementById('object-select').value = object.name;
    document.getElementById('color-picker').value = '#' + object.material.color.getHexString();
    
    const scale = object.scale.x;
    document.getElementById('scale-slider').value = scale;
    document.getElementById('scale-value').textContent = scale.toFixed(1);
    
    // Atualizar textura selecionada
    let textureName = 'none';
    if (object.material.map) {
        // Descobrir qual textura está sendo usada
        for (const [name, texture] of Object.entries(textures)) {
            if (name !== 'none' && texture && object.material.map === texture.map) {
                textureName = name;
                break;
            }
        }
    }
    document.getElementById('texture-select').value = textureName;
    
    // Atualizar botão de rotação
    document.getElementById('rotate-btn').textContent = rotating[object.name] ? "Parar" : "Girar";
    
    // Atualizar outline
    if (outlinePass.enabled) {
        outlinePass.selectedObjects = [object];
    }
}

// Função para lidar com o redimensionamento da janela
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// Função para lidar com clique do mouse
function onMouseClick(event) {
    // Calcular posição do mouse normalizada
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Atualizar o raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Encontrar objetos interceptados pelo raio
    const objects = [cube, sphere, cylinder];
    const intersects = raycaster.intersectObjects(objects);
    
    if (intersects.length > 0) {
        selectObject(intersects[0].object);
    }
}

// Função para lidar com teclas pressionadas
function onKeyDown(event) {
    switch(event.code) {
        case 'KeyW': moveForward = true; break;
        case 'KeyA': moveLeft = true; break;
        case 'KeyS': moveBackward = true; break;
        case 'KeyD': moveRight = true; break;
    }
}

// Função para lidar com teclas liberadas
function onKeyUp(event) {
    switch(event.code) {
        case 'KeyW': moveForward = false; break;
        case 'KeyA': moveLeft = false; break;
        case 'KeyS': moveBackward = false; break;
        case 'KeyD': moveRight = false; break;
    }
}

// Função para aplicar movimento da câmera baseado nas teclas
function updateCameraPosition() {
    const delta = 0.1;
    const speed = 2.0;
    
    // Obter direção da câmera (frente/trás)
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    
    // Obter vetor direita
    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction).normalize();
    
    // Aplicar movimentos
    if (moveForward) {
        camera.position.addScaledVector(direction, speed * delta);
    }
    if (moveBackward) {
        camera.position.addScaledVector(direction, -speed * delta);
    }
    if (moveLeft) {
        camera.position.addScaledVector(right, speed * delta);
    }
    if (moveRight) {
        camera.position.addScaledVector(right, -speed * delta);
    }
    
    // Atualizar os controles
    controls.target.set(
        camera.position.x + direction.x,
        camera.position.y + direction.y,
        camera.position.z + direction.z
    );
}

// Loop de animação
function animate() {
    requestAnimationFrame(animate);

    // Atualizar os controles
    controls.update();
    
    // Atualizar posição da câmera com base nas teclas
    if (moveForward || moveBackward || moveLeft || moveRight) {
        updateCameraPosition();
    }

    // Aplicar transformações (rotação) se estiver habilitado
    if (rotating.cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }

    if (rotating.sphere) {
        sphere.rotation.y += 0.01;
    }

    if (rotating.cylinder) {
        cylinder.rotation.x += 0.01;
    }

    // Renderizar a cena com post-processing
    composer.render();
}

// Iniciar a aplicação
init();