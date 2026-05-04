// OS Boot Welcome Screen Logic
window.addEventListener('load', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingGlow = document.querySelector('.loading-glow');
    const loadingText = document.getElementById('loading-text');
    const loadingPercentage = document.getElementById('loading-percentage');
    const terminalLogs = document.getElementById('terminal-logs');

    let progress = 0;
    const stages = [
        "INITIALIZING CORE KERNEL...",
        "MOUNTING VIRTUAL DRIVES...",
        "LOADING UI ASSETS...",
        "PORTFOLIO LOADING...",
        "SYSTEM READY."
    ];

    const fakeLogs = [
        "[OK] Network protocols established.",
        "[OK] Graphics module initialized at 60fps.",
        "[WARNING] Slight memory fragmentation detected... Auto-resolving.",
        "[OK] Resolving modules...",
        "[OK] User profile 'Rudra Miyani' authenticated.",
        "[OK] Fetching project data...",
        "[OK] Handshake with WebGL canvas successful.",
    ];

    let logIndex = 0;
    const addLog = setInterval(() => {
        if (logIndex < fakeLogs.length && progress < 90) {
            const line = document.createElement('div');
            line.className = 'log-line';
            if (fakeLogs[logIndex].includes('[WARNING]')) line.classList.add('warning');
            else line.classList.add('success');

            line.innerText = `> ${fakeLogs[logIndex]}`;
            terminalLogs.appendChild(line);
            terminalLogs.scrollTop = terminalLogs.scrollHeight;
            logIndex++;
        }
    }, 250);

    const simulateLoading = setInterval(() => {
        // Random increment between 1 and 10 to make it look realistic
        progress += Math.floor(Math.random() * 8) + 1;

        if (progress >= 100) {
            progress = 100;
            clearInterval(simulateLoading);
            clearInterval(addLog);

            // Finalize loading state
            loadingBar.style.width = '100%';
            loadingGlow.style.left = '100%';
            loadingPercentage.innerText = '100%';
            loadingText.innerText = stages[stages.length - 1];
            loadingText.style.color = 'var(--accent-2)';

            // Hide the boot screen after a short hold
            setTimeout(() => {
                welcomeScreen.classList.add('hidden');

                // Start Hero Animations & Typing right when it starts sliding up
                initHeroAnimations();

                setTimeout(() => {
                    welcomeScreen.style.display = 'none';
                }, 1200); // Wait for the transition
            }, 800);

        } else {
            loadingBar.style.width = progress + '%';
            loadingGlow.style.left = progress + '%';
            loadingPercentage.innerText = progress + '%';

            // Update text based on progress stage
            const stageIndex = Math.min(Math.floor(progress / 20), stages.length - 2);
            loadingText.innerText = stages[stageIndex];
        }
    }, 130);
});

// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

let scrollVelocity = 0;
lenis.on('scroll', (e) => {
    scrollVelocity = e.velocity;
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Code
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const magneticElements = document.querySelectorAll('.magnetic');

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows precisely
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

// Smooth trailing animation for outline
function animateCursor() {
    let distX = mouseX - outlineX;
    let distY = mouseY - outlineY;

    outlineX += distX * 0.15;
    outlineY += distY * 0.15;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Magnetic Button Effect and Cursor Expansion
magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Move element slightly
        gsap.to(el, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.8,
            ease: 'power3.out'
        });
        cursorOutline.classList.add('hover-active');
    });

    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)'
        });
        cursorOutline.classList.remove('hover-active');
    });
});

// --- GSAP Animations ---

// 1. Initial Load Animations
const tl = gsap.timeline({ paused: true });

tl.from('.hero-bg-text', {
    scale: 1.2,
    opacity: 0,
    duration: 1.5,
    delay: 0.5,
    ease: 'power3.out'
})
    .from('.hero-content .reveal-text', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, "-=0.8")
    .from('nav', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, "-=1")
    .call(typeHeroText, null, "-=1");

function initHeroAnimations() {
    tl.play();
}

// 2. Typing Effect for Hero Title
function typeHeroText() {
    const rudraEl = document.getElementById('type-rudra');
    const miyaniEl = document.getElementById('type-miyani');
    const cursor1 = document.querySelector('.type-cursor-1');
    const cursor2 = document.querySelector('.type-cursor-2');

    const text1 = "Rudra";
    const text2 = "Miyani";
    let speed = 65; // Much faster ms per char

    function typeString(el, text, i, onComplete) {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            setTimeout(() => typeString(el, text, i + 1, onComplete), speed);
        } else if (onComplete) {
            onComplete();
        }
    }

    // Type first name
    typeString(rudraEl, text1, 0, () => {
        // Hide first cursor, show second cursor
        cursor1.style.display = 'none';
        cursor2.style.display = 'inline-block';

        // Type second name
        typeString(miyaniEl, text2, 0, () => {
            // Keep blinking cursor at the end, or hide it if you prefer
        });
    });
}

// 3. Parallax Hero Text on Scroll
gsap.to('.hero-bg-text', {
    yPercent: -50,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

gsap.to('.hero-title-wrapper', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// Duplicate Marquee Items for infinite scroll loop seamlessly
const marquees = document.querySelectorAll('.marquee-content');
marquees.forEach(marquee => {
    const clone = marquee.innerHTML;
    marquee.innerHTML += clone; // paste same content to double the width
});

// 3. Reveal Elements on Scroll
const revealElements = document.querySelectorAll('.reveal-up');
revealElements.forEach((el) => {
    gsap.from(el, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
        }
    });
});

const sectionTitles = document.querySelectorAll('.section-title.reveal-text');
sectionTitles.forEach((title) => {
    gsap.from(title, {
        y: 50,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: title,
            start: 'top 85%'
        }
    });
});

// --- ENHANCED INTERACTIVITY ---

// 1. 3D Tilt Effect for Project Cards
const cards = document.querySelectorAll('.project-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            transformOrigin: 'center center',
            ease: 'power2.out',
            duration: 0.5
        });

        // Parallax inner shape
        const shape = card.querySelector('.abstract-shape');
        if (shape) {
            gsap.to(shape, {
                x: (x - centerX) * 0.2,
                y: (y - centerY) * 0.2,
                duration: 0.8,
                ease: 'power2.out'
            });
        }
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            ease: 'elastic.out(1, 0.4)',
            duration: 1.5
        });
        const shape = card.querySelector('.abstract-shape');
        if (shape) {
            gsap.to(shape, { x: 0, y: 0, duration: 1.5, ease: 'elastic.out(1, 0.4)' });
        }
    });
});

// 4. Achievement Items Spotlight & Reveal
const achieveItemsList = document.querySelectorAll('.achieve-item');
achieveItemsList.forEach((item, index) => {
    // Staggered reveal GSAP
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top 95%'
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Spotlight mouse follow
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        item.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        item.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
});

// 5. Expand glowing cursor on inputs
const inputs = document.querySelectorAll('.magnetic-input');
inputs.forEach(input => {
    input.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hover-active');
    });
    input.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hover-active');
    });
});

// 3. Click Shockwave trigger
let shockwave = 0;
window.addEventListener('click', () => {
    shockwave = 1.0;
    gsap.fromTo(cursorDot,
        { scale: 4, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }
    );
});


// --- THREE.JS 3D BACKGROUND ---
const canvas3D = document.querySelector('#webgl');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: canvas3D, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 1. Particles (Floating Tech Dust)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 3000;
const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);

const color1 = new THREE.Color('#00e5ff');
const color2 = new THREE.Color('#ff3366');

for (let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 15;     // x
    posArray[i + 1] = (Math.random() - 0.5) * 15;   // y
    posArray[i + 2] = (Math.random() - 0.5) * 10;   // z

    const mixedColor = color1.clone().lerp(color2, Math.random());
    colorsArray[i] = mixedColor.r;
    colorsArray[i + 1] = mixedColor.g;
    colorsArray[i + 2] = mixedColor.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesGroup = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesGroup);

// 2. Abstract Wireframe Shapes (Floating in space)
const gridHelper = new THREE.GridHelper(30, 60, '#7000ff', '#7000ff');
gridHelper.position.y = -3;
gridHelper.material.opacity = 0.15;
gridHelper.material.transparent = true;
scene.add(gridHelper);

const shape1Geo = new THREE.TorusKnotGeometry(1.2, 0.3, 100, 16);
const shape1Mat = new THREE.MeshBasicMaterial({ color: '#00e5ff', wireframe: true, transparent: true, opacity: 0.15 });
const shape1 = new THREE.Mesh(shape1Geo, shape1Mat);
shape1.position.set(2.5, 2.0, -2);
scene.add(shape1);

// 3. Import External Models (3D & 2D)
let laptopModel = null;
const gltfLoader = new THREE.GLTFLoader();

// First Model: Coding Laptop / Macbook (Built completely with Three.js Geometry to guarantee it loads instantly!)
laptopModel = new THREE.Group();

const laptopMaterial = new THREE.MeshBasicMaterial({
    color: '#ff3366',
    wireframe: true,
    transparent: true,
    opacity: 0.3
});

// Laptop Base (Keyboard side)
const baseGeo = new THREE.BoxGeometry(2.2, 0.1, 1.5);
const baseMesh = new THREE.Mesh(baseGeo, laptopMaterial);
baseMesh.position.set(0, 0, 0);

// Laptop Screen (Monitor side)
const screenGeo = new THREE.BoxGeometry(2.2, 1.4, 0.05);
const screenMesh = new THREE.Mesh(screenGeo, laptopMaterial);
// Positioned at the back edge of the base, tilted backward slightly like an open laptop
screenMesh.position.set(0, 0.7, -0.75);
screenMesh.rotation.x = -0.15;

laptopModel.add(baseMesh);
laptopModel.add(screenMesh);

// Initial position and scaling
laptopModel.position.set(-3.5, 2.0, -4.5);
laptopModel.scale.set(1.2, 1.2, 1.2);

// Auto-tilt to see the keys and screen clearly
laptopModel.rotation.x = Math.PI / 8;
laptopModel.rotation.y = Math.PI / 4;

scene.add(laptopModel);

// 4. 2D Floating Elements (Sprite / Textures)
const textureLoader = new THREE.TextureLoader();
// Creating a 2D floating plane graphic
const planeGeo = new THREE.PlaneGeometry(2, 2);
const planeMat = new THREE.MeshBasicMaterial({
    color: '#7000ff',
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2,
    wireframe: true
});
const floatingPlane = new THREE.Mesh(planeGeo, planeMat);
floatingPlane.position.set(0, 3, -5);
scene.add(floatingPlane);

// Mouse Interaction for 3D
let targetX = 0;
let targetY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    targetX = (event.clientX - windowHalfX) * 0.001;
    targetY = (event.clientY - windowHalfY) * 0.001;
});

// Animation Loop
const clock = new THREE.Clock();

function tick() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate particles
    particlesGroup.rotation.y = elapsedTime * 0.03 + (scrollVelocity * 0.001);
    particlesGroup.rotation.x = elapsedTime * 0.01;

    // Smooth camera mouse follow
    camera.position.x += (targetX * 2 - camera.position.x) * 0.02;
    camera.position.y += (-targetY * 2 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    // Apply shockwave on click
    if (shockwave > 0) {
        shockwave -= 0.03;
        const scaleEffect = 1 + (shockwave * 0.8);
        particlesGroup.scale.set(scaleEffect, scaleEffect, scaleEffect);
        shape1.scale.set(scaleEffect, scaleEffect, scaleEffect);
        if (laptopModel) laptopModel.scale.set(scaleEffect * 1.2, scaleEffect * 1.2, scaleEffect * 1.2);
    }

    // Animate shapes
    shape1.rotation.x += 0.005 + Math.abs(scrollVelocity * 0.0005);
    shape1.rotation.y += 0.01;

    // Rotate 2D Plane Geometry
    floatingPlane.rotation.z += 0.002;
    floatingPlane.rotation.x = targetY * 0.2;
    floatingPlane.rotation.y = targetX * 0.2;

    // Animate Models
    if (laptopModel) {
        laptopModel.rotation.y -= 0.008 + Math.abs(scrollVelocity * 0.0005);
        // Combine base tilt with mouse movement tracking
        laptopModel.rotation.x = (Math.PI / 8) + targetY * 0.5;
        laptopModel.rotation.z = targetX * 0.5;
    }

    // Link 3D Models to Scroll for Perfect Loop Trajectories
    const scrollY = window.scrollY;
    // Calculate global scroll progress from 0.0 (top) to 1.0 (bottom)
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollProgress = scrollY / maxScroll;

    // Map the scroll progress to a full circle (0 to 360 degrees, or 0 to 2*PI)
    // Multiplied by 2 (i.e. Math.PI * 4) so it completes EXACTLY 2 full orbits
    const scrollAngle = scrollProgress * Math.PI * 4;

    // Background particles gentle parallax
    particlesGroup.position.y = scrollY * 0.001;

    // Wireframe Torus perfectly loops (Starts at exact same coordinate it ends at)
    shape1.rotation.z = scrollAngle * 2;
    shape1.position.x = 2.5 + Math.sin(scrollAngle) * -4;
    shape1.position.y = -1.0 + Math.cos(scrollAngle) * 3; // Starts perfectly visible at y=2.0 

    // 2D Plane weaving perfectly loops
    floatingPlane.position.x = Math.sin(scrollAngle) * 6;
    floatingPlane.position.y = 3 - Math.cos(scrollAngle) * 5;
    floatingPlane.position.z = -5 + Math.sin(scrollAngle) * 3;

    // Coding Laptop exactly returns to start position, starting clearly behind the name on the left!
    if (laptopModel) {
        // Since we use sine of `scrollAngle` mapped precisely from 0 to 4π,
        // it guarantees that exactly at the bottom of the page, it returns to the start position!
        laptopModel.position.x = -3.5 + Math.sin(scrollAngle) * 5.5;
        laptopModel.position.y = 2.0 - Math.sin(scrollAngle * 0.5) * 4;
        laptopModel.position.z = -4.5 + Math.sin(scrollAngle) * 3;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}
tick();

// Handle Window Resize
window.addEventListener('resize', () => {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
window.addEventListener('load', () => {
    setTimeout(() => { ScrollTrigger.refresh(); }, 500);
});

// --- Security Features: Prevent Inspect & Text Selection ---

// 1. Prevent Right-Click Context Menu
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// 2. Prevent Keyboard Shortcuts for Developer Tools
document.addEventListener('keydown', function (e) {
    // Prevent F12
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
    }
    // Prevent Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
    }
    // Prevent Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
    }
    // Prevent Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
    }
    // Prevent Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
    }
    // Prevent Cmd+Option+I/J/U (Mac shortcuts)
    if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
    }
});

// --- Security Features: Prevent Inspect & Text Selection ---

// 1. Prevent Right-Click Context Menu
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// 2. Prevent Keyboard Shortcuts for Developer Tools
document.addEventListener('keydown', function (e) {
    // Prevent F12
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
    }
    // Prevent Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
    }
    // Prevent Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
    }
    // Prevent Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
    }
    // Prevent Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
    }
    // Prevent Cmd+Option+I/J/U (Mac shortcuts)
    if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
    }
});
