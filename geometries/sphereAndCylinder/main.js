var Height;
var Width;
var Scene;
var Camera;
var Renderer;
var Controls;
var envMap;

function setWidthHeight() {
    Height = window.innerHeight;
    Width = window.innerWidth;
}

function initPrespectiveCamera() {
    let fov = 75;
    let aspect = Width / Height;
    let nearClipping = 0.1;
    let farClipping = 1000;
    Camera = new THREE.PerspectiveCamera(fov, aspect, nearClipping, farClipping);
}

function initEnvMap() {
    envMap = new THREE.CubeTextureLoader().setPath('./skybox/').load([
        'xp.jpg', 'xn.jpg', 'yp.jpg', 'yn.jpg', 'zp.jpg', 'zn.jpg'
    ]);
    Scene.background = envMap;
}

function init() {
    setWidthHeight();
    Scene = new THREE.Scene();
    initPrespectiveCamera();
    initEnvMap();
    Renderer = new THREE.WebGLRenderer({ antialias: true });
    Renderer.setSize(Width, Height);
    Renderer.shadowMap.enabled = true;
    document.body.appendChild(Renderer.domElement);
    Controls = new THREE.OrbitControls(Camera, Renderer.domElement);
    Controls.update();
    window.addEventListener('resize', function (e) {
        setWidthHeight();
        Renderer.setSize(Width, Height);
        Camera.aspect = Width / Height;
        Camera.updateProjectionMatrix();
    });
}


function addAmbientLight(color = 'white', intensity = 0.5) {
    let ambientLight = new THREE.AmbientLight(new THREE.Color(color), intensity);
    Scene.add(ambientLight);
}

function addDirectionalLight(color = 'white', intensity = 0.5, position = { x: 0, y: 60, z: 45 }) {
    let directionalLight = new THREE.DirectionalLight(new THREE.Color(color), intensity);
    let { x, y, z } = position;
    directionalLight.position.set(x, y, z);
    Scene.add(directionalLight);
    return directionalLight;
}

function GenerateCapsule(size = 2) {

    let Capsule = new THREE.Group();

    let material = new THREE.MeshLambertMaterial({ wireframe: false, envMap: envMap });

    let semiSphereGeometryTop = new THREE.SphereGeometry(size, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    let semiSphereTop = new THREE.Mesh(semiSphereGeometryTop, material);
    Capsule.add(semiSphereTop);

    let semiSphereGeometryBottom = new THREE.SphereGeometry(size, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    let semiSphereBottom = new THREE.Mesh(semiSphereGeometryBottom, material);
    Capsule.add(semiSphereBottom);

    let cylindricalGeometry = new THREE.CylinderGeometry(size, size, size * 2, 20, 1, true);
    let cylinder = new THREE.Mesh(cylindricalGeometry, material);
    Capsule.add(cylinder);

    semiSphereBottom.rotation.z = -Math.PI;
    semiSphereBottom.position.y = -size;
    semiSphereTop.position.y = size;

    Scene.add(Capsule);
    return Capsule;
}

window.addEventListener('load', function (e) {

    init();
    addAmbientLight('white', 2);
    addDirectionalLight();

    let capsule = GenerateCapsule(10);

    Camera.position.z = 30;
    function animate() {
        requestAnimationFrame(animate);
        Renderer.render(Scene, Camera);
        capsule.rotation.y += 0.01;
        capsule.rotation.z += 0.01;
    }
    animate();

});