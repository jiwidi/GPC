/**
 *	Seminario GPC #2. Forma Basica.
 *	Dibujar formas básicas y un modelo importado
 *	Muestra el blucle tipico de inicialización, escena y render
 *
 */

// Variables de consenso
// Motor, escena y camara
var renderer, scene, camera;

// Otras globales
var esferaCubo, angulo = 0;

// Acciones
init();
loadScene();
render();

function init() {

    // Configurar el motor de render y el canvas
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x0000AA));
    document.getElementById("container").appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();

    // Camara
    var ar = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(50, ar, 0.1, 100);
    scene.add(camera);
    camera.position.set(0.5, 3, 9);
    camera.lookAt(new THREE.Vector3(0, 2, 0));
}

function loadScene() {
    // Construir el grafo de escena

    // Materiales
    var material = new THREE.MeshBasicMaterial({
        color: 'yellow',
        wireframe: true
    });

    // Geometrias
    var plano = new THREE.PlaneGeometry(500, 500);
    var geocubo = new THREE.BoxGeometry(2, 2, 2);
    var geoesfera = new THREE.SphereGeometry(1, 30, 30);
    var ciclindroAlto = new THREE.CylinderGeometry(4, 80, 4);
    var cilindroBajo = new THREE.CylinderGeometry(50, 15, 50);

    // Objetos
    var base = new THREE.Mesh(cilindroBajo, material);
    /// Objeto contenedor
    robot = new THREE.Object3D();

    /// Modelo externo


    // Organizacion de la escena
    robot.add(base);
    base.add(new THREE.AxisHelper(1));
    scene.add(robot);
    // esferacubo.add(esfera);
    // scene.add(new THREE.AxisHelper(3));
}

function update() {
    // Variacion de la escena entre frames
}

function render() {
    // Construir el frame y mostrarlo
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}