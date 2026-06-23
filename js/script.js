// =============================================================
// 1. AOS (Scroll Animations)
// =============================================================
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
    });
});

// =============================================================
// 2. Vanilla Tilt (3D Card Hover)
// =============================================================
document.addEventListener('DOMContentLoaded', function() {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 12,
        speed: 400,
        glare: true,
        "max-glare": 0.15,
    });
});

// =============================================================
// 3. Three.js (3D Background)
// =============================================================
(function() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    document.getElementById('bg-canvas').appendChild(canvas);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(1, 1, 2);
    scene.add(dirLight);
    const backLight = new THREE.DirectionalLight(0x818cf8, 0.6);
    backLight.position.set(-1, -0.5, -2);
    scene.add(backLight);

    // Main object: Torus Knot
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 180, 24);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x6366f1,
        metalness: 0.3,
        roughness: 0.2,
        transparent: true,
        opacity: 0.5,
        wireframe: false,
        emissive: 0x4f46e5,
        emissiveIntensity: 0.1,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Wireframe overlay
    const wireGeo = new THREE.TorusKnotGeometry(1.22, 0.42, 120, 16);
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0xa78bfa,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    // Particles
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 2000;
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        pos[i] = (Math.random() - 0.5) * 30;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const particlesMat = new THREE.PointsMaterial({
        color: 0x818cf8,
        size: 0.035,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Animation
    function animate() {
        const elapsed = performance.now() * 0.0008;
        mesh.rotation.x = elapsed * 0.3;
        mesh.rotation.y = elapsed * 0.5;
        wireMesh.rotation.x = mesh.rotation.x;
        wireMesh.rotation.y = mesh.rotation.y;
        particles.rotation.y = elapsed * 0.02;
        particles.rotation.x = Math.sin(elapsed * 0.01) * 0.1;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
})();

// =============================================================
// 4. Modal helpers
// =============================================================
function openModal(id) {
    document.getElementById(id).style.display = 'block';
    document.body.style.overflow = 'hidden';
}
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    document.body.style.overflow = 'auto';
}
window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(m => {
        if (e.target === m) {
            m.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        document.body.style.overflow = 'auto';
    }
});