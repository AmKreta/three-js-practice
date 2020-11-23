var height = window.innerHeight;
var width = window.innerWidth;
var Scene, Camera, Renderer;

function getPerspectiveCamera() {
    const fov = 45;
    const farClipping = 1000;
    const nearClipping = 0.1;
    const aspect = width / height;
    return new THREE.PerspectiveCamera(fov, aspect, nearClipping, farClipping);
}

function init() {
    Scene = new THREE.Scene();
    Scene.background = new THREE.Color('#ccc');
    Camera = getPerspectiveCamera();
    Renderer = new THREE.WebGLRenderer({ antialias: true });
    Renderer.setSize(width, height);
    Renderer.shadowMap.enabled = true;
    document.body.appendChild(Renderer.domElement);
    window.addEventListener('resize', function (e) {
        width = window.innerWidth;
        height = window.innerHeight;
        Renderer.setSize(width, height);
        Camera.aspect = width / height;
        Camera.updateProjectionMatrix();
    });
}

function addBox(l = 2, b = 2, h = 2) {
    const BoxGeometry = new THREE.BoxGeometry(l, b, h);
    const BoxMaterial = new THREE.MeshLambertMaterial({ color: new THREE.Color('red') });
    const Box = new THREE.Mesh(BoxGeometry, BoxMaterial);
    Scene.add(Box);
    return Box;
}

function addDirectionalLight(color = 'white', intensity = 1.5, x = 7, y = -15, z = 7, target = [0, 0, 0]) {
    const directionalLight = new THREE.DirectionalLight(new THREE.Color(color), intensity);
    directionalLight.position.set(x, y, z);
    Scene.add(directionalLight);
    return directionalLight;
}

function addAmbientLight(color = 'white', intensity = 0.5) {
    color = 0xFFFFFF;
    intensity = .5;
    light = new THREE.AmbientLight(new THREE.Color(color), intensity);
    Scene.add(light);
}

window.addEventListener('load', (e) => {
    init();
    let box1 = addBox();
    let box2 = addBox();
    let box3 = addBox();
    box1.position.x = -6;
    box3.position.x = 6;
    addDirectionalLight();
    addAmbientLight();
    Camera.position.z = 10;
    Camera.position.y = 10;
    Camera.lookAt(0, 0, 0);
    function animate() {
        requestAnimationFrame(animate);
        Renderer.render(Scene, Camera);
        box1.rotation.y += .01
        box2.rotation.y += .01
        box3.rotation.y += .01
    }

    animate();
});