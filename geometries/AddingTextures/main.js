var Height = window.innerHeight;
var Width = window.innerWidth;
var Scene;
var Camera;
var Renderer;
var Controls;

function initPerspectiveCamera() {
    let fov = 75;
    let aspect = Width / Height;
    let nearClipping = .1;
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

function addDirectionalLight(color = 'yellow', intensity = 2, position = { x: 0, y: 80, z: 50 }) {
    let directionalLight = new THREE.DirectionalLight(new THREE.Color(color), intensity);
    Scene.add(directionalLight);
    let { x, y, z } = position;
    directionalLight.position.set(x, y, z);
    return directionalLight;
}

window.addEventListener('load', function (e) {
    init();

    let boxGeometry = new THREE.BoxGeometry(3, 3, 3);

    // creating box1
    let box1Material = new THREE.MeshLambertMaterial({
        color: new THREE.Color('white'),
        map: new THREE.TextureLoader().load('wall.jpg'),
        alphaMap: new THREE.TextureLoader().load('dots.jpg'),
        transparent: true,
        side: THREE.DoubleSide
    });
    let box1 = new THREE.Mesh(boxGeometry, box1Material);

    // creating box2
    let box2Material = new THREE.MeshLambertMaterial({
        color: new THREE.Color('white'),
        map: new THREE.TextureLoader().load('wall.jpg'),
    });
    let box2 = new THREE.Mesh(boxGeometry, box2Material);

    addAmbientLight();
    let directionalLight = addDirectionalLight();

    Scene.add(box1);
    Scene.add(box2);

    box1.position.set(-6, 0, 0);
    box2.position.set(6, 0, 0);

    Camera.position.set(0, 0, 20);

    function animate() {
        requestAnimationFrame(animate);
        Renderer.render(Scene, Camera);
        Controls.update();
        box1.rotation.y += 0.01;
        box2.rotation.y += 0.01;
    }
    animate();
});