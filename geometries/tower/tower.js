var Scene;
var Camera;
var Renderer;
var Controls;
var Height = window.innerHeight;
var Width = window.innerWidth;

function initPerspectiveCamera() {
    let fov = 70;
    let aspect = Width / Height;
    let nearClipping = 0.1;
    let farClipping = 1000;
    Camera = new THREE.PerspectiveCamera(fov, aspect, nearClipping, farClipping);
}

function init() {
    Scene = new THREE.Scene();
    Scene.background = new THREE.Color('#ccc');
    initPerspectiveCamera();
    Renderer = new THREE.WebGLRenderer({ antialias: true });
    Renderer.setSize(Width, Height);
    Renderer.shadowMap.enabled = true;
    document.body.appendChild(Renderer.domElement);
    Controls = new THREE.OrbitControls(Camera, Renderer.domElement);
}

window.addEventListener('resize', function (e) {
    Width = window.innerWidth;
    Height = window.innerHeight;
    Renderer.setSize(Width, Height);
    Camera.aspect = Width / Height;
    Camera.updateProjectionMatrix();
});

function addAmbientLight(color = 'white', intensity = .5) {
    let ambientLight = new THREE.AmbientLight(new THREE.Color(color), intensity);
    Scene.add(ambientLight);
}

function addDirectionalLight(color = 'white', intensity = 1, x = 0, y = 15, z = 5) {
    let DirectionalLight = new THREE.DirectionalLight(new THREE.Color(color), intensity);
    DirectionalLight.position.set(x, y, z);
    DirectionalLight.castShadow = true;
    Scene.add(DirectionalLight);
    return DirectionalLight;
}

function addHemisphericalLight(skyColor = 'yellow', groundColor = 'lightGreen', intensity = .5) {
    let HemisphericalLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    Scene.add(HemisphericalLight);
    return HemisphericalLight
}

function getBox(l = 6, b = 2, h = 2, x = 0, y = 0, z = 0) {
    let BoxGeometry = new THREE.BoxGeometry(l, b, h);
    let BoxMaterial = new THREE.MeshLambertMaterial({
        //map: new THREE.TextureLoader().load(''),
        color: new THREE.Color('brown'),
        side: THREE.DoubleSide
    });
    let Box = new THREE.Mesh(BoxGeometry, BoxMaterial);
    Box.position.set(x, y, z);
    Scene.add(Box);
    return Box;
}

function createTower(level) {
    let Tower = new THREE.Group();
    for (let i = 0; i < level; i++) {
        let Level = new THREE.Group();
        for (let j = 0, offset = -1; j < 3; j++, offset += 1) {
            Level.add(getBox(3, .4, .9, 0, i * .5, offset *1.05));
        }
        if (i % 2) {
            Level.rotation.y = Math.PI / 2;
        }
        Tower.add(Level);
    }
    Scene.add(Tower);
    return Tower;
}


window.addEventListener('load', function (e) {
    init();
    addAmbientLight();
    addDirectionalLight();
    Camera.position.set(0, 10, 10);
    let Tower = createTower(15);
    function animate() {
        requestAnimationFrame(animate);
        Renderer.render(Scene, Camera);
        Controls.update();
    }
    animate();
});