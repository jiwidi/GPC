// Seminario GPC #2 Forma Basica.
// Dibujar formas basicas y un modelo importad
// Muestra el bucle tipico de inicializacion, escena y render


// Variables de consenso
// Motor, escena y camara
var renderer, scene, camara;

// Otras globales
var esferCubo, angulo = 0;

// Acciones
IntersectionObserver();
loadScene();
render();

function init() {
    // Configurar el motor de render y el canvas
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x0000AA));
    document.getElementById("container").appendChild(renderer.domElement);

    // Escena
    scene = new THREE.scene()

    //Camara
    var ar = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspecctiveCamera(50, ar, 0.1, 100);
    scene.add(camera);
    camera.position.set(0.5, 2, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function loadScene() {
    // Construir el grafo de la escena

    // Materiales
    var material = new THREE.MeshBasicMaterial({
        color: "yellow",
        wireframe: true
    });
    //Geometrias
    var geocubo = new THREE.BoxGeometry(2, 2, 2);
    //Objectos
    var cubo = new THREE.Mesh(geocubo, material);
    // Organizacion de la escena
    scene.add(cubo);


}

function update() {
    // variacion de la escena entre frames
}

function render() {
    // Construir el frame y mostrarlo
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);

}