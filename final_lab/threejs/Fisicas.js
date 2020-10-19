/**
 * Seminario GPC #4  Animación por simulación física.
 * Esferas en habitación cerrada con molinete central
 *
 * @requires three_r96.js, coordinates.js, orbitControls.js, cannon.js, tween.js, stats_r16.js
 * @author rvivo / http://personales.upv.es/rvivo
 * @date 2020
 */

// Globales convenidas por threejs
var renderer, scene, camera;
// Control de camara
var cameraControls;
// Monitor de recursos
var stats;
// Mundo fisico
var world, reloj;
// Objetos
const nesferas = 20;
const nobstacurlos = 100;
var esferas = [];
var obstaculos = [];
var len_suelo = 20
initPhysicWorld();
initVisualWorld();
loadWorld();
render();
createLights();


function getRndInteger(min, max) {
	i = Math.floor(Math.random() * (max - min)) + min;
	while (i < 5 & i > 5) {
		i = Math.floor(Math.random() * (max - min)) + min;
	}
	return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Construye una bola con cuerpo y vista
 */
function esfera(radio, posicion, material) {
	var masa = 100;
	this.body = new CANNON.Body({
		mass: masa,
		material: material
	});
	this.body.addShape(new CANNON.Sphere(radio));
	this.body.position.copy(posicion);
	this.visual = new THREE.Mesh(new THREE.SphereGeometry(radio),
		new THREE.MeshBasicMaterial({
			wireframe: true
		}));
	this.visual.position.copy(this.body.position);
}

function obstaculo(radio, posicion, material) {
	var masa = 100000;
	var textureLoader = new THREE.TextureLoader();
	var map = textureLoader.load('./textures/brick.png');
	this.body = new CANNON.Body({
		mass: masa,
		material: material
	});
	x = getRndInteger(1, 4);
	// box = (getRndInteger(1, 4), getRndInteger(1, 5), getRndInteger(1, 5))
	radio = getRndInteger(1, 5);
	this.body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
	// this.body.addShape(new CANNON.Sphere(radio));
	this.body.position.copy(posicion);
	geom = new THREE.BoxGeometry((1, 1, 1));
	// geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
	var mat = new THREE.MeshPhongMaterial({
		color: 0x689999,
		map: map,
		// transparent:true,
		// opacity:.6,
		shading: THREE.FlatShading,
	});
	this.visual = new THREE.Mesh(geom, mat);
	this.visual.position.copy(this.body.position);
}

function premio(radio, posicion, material) {
	var masa = 100;
	this.body = new CANNON.Body({
		mass: masa,
		material: material
	});
	this.body.addShape(new CANNON.Sphere(radio));
	this.body.position.copy(posicion);
	var geom = new THREE.SphereGeometry(radio)
	// geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
	var mat = new THREE.MeshPhongMaterial({
		color: 0x68c3c0,
		// map: map,
		// transparent:true,
		// opacity:.6,
		shading: THREE.FlatShading,
	});
	this.visual = new THREE.Mesh(geom, mat);
	this.visual.position.copy(this.body.position);
}

function createLights() {

	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)
	shadowLight = new THREE.DirectionalLight(0xffffff, .9);
	shadowLight.position.set(150, 350, 350);
	shadowLight.castShadow = true;
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	scene.add(hemisphereLight);
	scene.add(shadowLight);
}
/**
 * Inicializa el mundo fisico con un
 * suelo y cuatro paredes de altura infinita
 */
function initPhysicWorld() {
	// Mundo
	world = new CANNON.World();
	world.gravity.set(0, -9.8, 0);
	///world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 10;

	// Material y comportamiento
	var groundMaterial = new CANNON.Material("groundMaterial");
	var materialEsfera = new CANNON.Material("sphereMaterial");
	var obstacleMaterial = new CANNON.Material("obstacleMaterial");
	world.addMaterial(materialEsfera);
	world.addMaterial(groundMaterial);
	world.addMaterial(obstacleMaterial);
	// -existe un defaultContactMaterial con valores de restitucion y friccion por defecto
	// -en caso que el material tenga su friccion y restitucion positivas, estas prevalecen
	var sphereGroundContactMaterial = new CANNON.ContactMaterial(groundMaterial, materialEsfera, {
		friction: 0.3,
		restitution: 0.7
	});
	var sphereObstacleContactMaterial = new CANNON.ContactMaterial(materialEsfera, obstacleMaterial, {
		friction: 0.3,
		restitution: 0.7
	});
	var obstacleGroundContactMaterial = new CANNON.ContactMaterial(obstacleMaterial, groundMaterial, {
		friction: 0.3,
		restitution: 0.7
	});
	world.addContactMaterial(sphereGroundContactMaterial);
	world.addContactMaterial(sphereObstacleContactMaterial);
	world.addContactMaterial(obstacleGroundContactMaterial);

	// Suelo
	var groundShape = new CANNON.Plane();
	var ground = new CANNON.Body({
		mass: 0,
		material: groundMaterial
	});
	ground.addShape(groundShape);
	ground.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
	world.addBody(ground);

	// Paredes
	var backWall = new CANNON.Body({
		mass: 0,
		material: groundMaterial
	});
	backWall.addShape(new CANNON.Plane());
	backWall.position.z = -len_suelo / 2;
	world.addBody(backWall);
	var frontWall = new CANNON.Body({
		mass: 0,
		material: groundMaterial
	});
	frontWall.addShape(new CANNON.Plane());
	frontWall.quaternion.setFromEuler(0, Math.PI, 0, 'XYZ');
	frontWall.position.z = len_suelo / 2;
	world.addBody(frontWall);
	var leftWall = new CANNON.Body({
		mass: 0,
		material: groundMaterial
	});
	leftWall.addShape(new CANNON.Plane());
	leftWall.position.x = -len_suelo / 2;
	leftWall.quaternion.setFromEuler(0, Math.PI / 2, 0, 'XYZ');
	world.addBody(leftWall);
	var rightWall = new CANNON.Body({
		mass: 0,
		material: groundMaterial
	});
	rightWall.addShape(new CANNON.Plane());
	rightWall.position.x = len_suelo / 2;
	rightWall.quaternion.setFromEuler(0, -Math.PI / 2, 0, 'XYZ');
	world.addBody(rightWall);
}

/**
 * Inicializa la escena visual
 */
function initVisualWorld() {
	// Inicializar el motor de render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(new THREE.Color(0x000000));
	document.getElementById('container').appendChild(renderer.domElement);

	// Crear el grafo de escena
	scene = new THREE.Scene();

	// Reloj
	reloj = new THREE.Clock();
	reloj.start();

	// Crear y situar la camara
	var aspectRatio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
	camera.position.set(2, 5, 10);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	// Control de camara
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0, 0, 0);

	// STATS --> stats.update() en update()
	stats = new Stats();
	stats.showPanel(0); // FPS inicialmente. Picar para cambiar panel.
	document.getElementById('container').appendChild(stats.domElement);

	// Callbacks
	window.addEventListener('resize', updateAspectRatio);

	//Suelo visual
	var textureLoader = new THREE.TextureLoader();
	var map = textureLoader.load('./textures/grass.jpg');
	var geometry = new THREE.PlaneGeometry(len_suelo, len_suelo, 32);
	geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
	var material = new THREE.MeshBasicMaterial({
		color: 0xffff00,
		side: THREE.DoubleSide,
		map: map
	});
	var plane = new THREE.Mesh(geometry, material);
	plane.position.x = 2
	// plane.rotate.z
	scene.add(plane);
}

/**
 * Carga los objetos es el mundo físico y visual
 */
function loadWorld() {
	// Genera las esferas
	var materialEsfera;
	var materialObstaculo;
	for (i = 0; i < world.materials.length; i++) {
		if (world.materials[i].name === "sphereMaterial") materialEsfera = world.materials[i];
		if (world.materials[i].name === "obstacleMaterial") materialObstaculo = world.materials[i];
	}
	var e = new esfera(1 / 2, new CANNON.Vec3(-1, i + 1, 0), materialEsfera);
	world.addBody(e.body);
	scene.add(e.visual);
	esferas.push(e)

	for (var i = 0; i < nobstacurlos; i++) {
		var obs = new obstaculo(1 / 2, new CANNON.Vec3(getRndInteger(-19, 19), getRndInteger(1, 10), getRndInteger(-19, 19)), materialObstaculo);
		world.addBody(obs.body);
		scene.add(obs.visual);
		obstaculos.push(obs);
	};
	var prem = new premio(5, new CANNON.Vec3(getRndInteger(-19, 19), getRndInteger(1, 10), getRndInteger(-19, 19)), materialObstaculo);
	world.addBody(prem.body);
	scene.add(prem.visual);



	//
	// Coordinates.drawGrid({
	// 	size: len_suelo,
	// 	scale: 1,
	// 	orientation: "x"
	// });

	scene.add(new THREE.AxisHelper(5));
	window.addEventListener('keydown', function movekey(event) {
		if (event.keyCode == 39 || event.keyCode == 68) {
			esferas[0].body.applyImpulse(new CANNON.Vec3(+300, 0, 0), esferas[0].body.position)
			esferas[0].visual.position.copy(esferas[0].body.position);
			// Luces
			// shadowLight.position.x += 10;
		} else if ((event.keyCode == 38 || event.keyCode == 87)) {
			esferas[0].body.applyImpulse(new CANNON.Vec3(0, 0, -300), esferas[0].body.position)
			esferas[0].visual.position.copy(esferas[0].body.position);
			console.log("w")
		} else if ((event.keyCode == 37 || event.keyCode == 65)) {
			esferas[0].body.applyImpulse(new CANNON.Vec3(-300, 0, 0), esferas[0].body.position)
			esferas[0].visual.position.copy(esferas[0].body.position);
			// shadowLight.position.x -= 10;
			console.log("a")

		} else if ((event.keyCode == 40 || event.keyCode == 83)) {
			esferas[0].body.applyImpulse(new CANNON.Vec3(0, 0, 300), esferas[0].body.position)
			esferas[0].visual.position.copy(esferas[0].body.position);
			console.log("s")
		} else if ((event.keyCode == 32)) {
			if (esferas[0].body.position.y < 1) {
				esferas[0].body.applyImpulse(new CANNON.Vec3(0, 1000, 0), esferas[0].body.position)
				esferas[0].visual.position.copy(esferas[0].body.position);
				console.log("space")
			}
		}
	}, false);
}

/**
 * Isotropía frente a redimension del canvas
 */
function updateAspectRatio() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

/**
 * Actualizacion segun pasa el tiempo
 */
function update() {
	var segundos = reloj.getDelta(); // tiempo en segundos que ha pasado
	world.step(segundos); // recalcula el mundo tras ese tiempo

	for (var i = 0; i < esferas.length; i++) {
		esferas[i].visual.position.copy(esferas[i].body.position);
		esferas[i].visual.quaternion.copy(esferas[i].body.quaternion);
	};

	for (var i = 0; i < obstaculos.length; i++) {
		obstaculos[i].visual.position.copy(obstaculos[i].body.position);
		obstaculos[i].visual.quaternion.copy(obstaculos[i].body.quaternion);
	};
	camera.position.x = esferas[0].body.position.x
	camera.position.y = esferas[0].body.position.y + 10
	camera.position.z = esferas[0].body.position.z + 10

	// Actualiza el monitor
	stats.update();

	// Actualiza el movimeinto del molinete
	TWEEN.update();
}

/**
 * Update & render
 */
function render() {
	requestAnimationFrame(render);
	update();
	renderer.render(scene, camera);
}