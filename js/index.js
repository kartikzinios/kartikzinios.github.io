var container, stats, controls, loader, mesh, grid;
var camera, scene, renderer, light, hotspot;
//Position variables
var targetPos, camPos;
//Orbit variables
var orbitEnabled = false, dist, theta = -2.20;
//Hotspot variables
var hotspotPos, geometry, material, sphere, raycaster, mouse;
//CSS3D variables
var scene2,renderer2;

init();
animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	//Camera
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1 , 10000 );
	camPos = new THREE.Vector3(1300,300,-1210);
	targetPos = new THREE.Vector3(1205,20,-590);
	lookatPos = new THREE.Vector3(1205,20,-590);
	camera.position.set(camPos.x, camPos.y, camPos.z);

	//Scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xaaaaaa);

	//CSS3D Scene
    scene2 = new THREE.Scene();

	//Light
	light = new THREE.HemisphereLight( 0xECF9FF, 0xFFF5E1 );
	light.position.set( 0, -110 , 0 );
	scene.add( light );
	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( -473.09, 334.83, 1817.54 );
	scene.add( light );
	light = new THREE.DirectionalLight( 0xffffff, 0.8 );
	light.position.set( -1079.65, 1304.26, -1971.28 );
	scene.add( light );
	light = new THREE.DirectionalLight( 0xffffff, 0.6 );
	light.position.set( 2377.38, 785.49, 366.78 );
	scene.add( light );

	// FBX Model
	var manager = new THREE.LoadingManager();
	loader = new THREE.FBXLoader(manager);
	loader.load( 'assets/vulcan.fbx', function ( object ) {
		scene.add( object );
		object.position.set(0,-100,0);
	});
	manager.onLoad = function(){
		document.getElementById("overlay").style.display = "none";
	}
	// Hotspot object
	hotspotPos = new THREE.Vector3(1110,-84,-915);
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	material = new THREE.MeshBasicMaterial( {
		map: new THREE.TextureLoader().load( 'assets/hotspot.png' ),
		side: THREE.DoubleSide
	});
	geometry = new THREE.PlaneGeometry( 32, 32 );
	hotspot = new THREE.Mesh(geometry, material);
	scene.add( hotspot );
	hotspot.position.set(hotspotPos.x, hotspotPos.y, hotspotPos.z);
	hotspot.rotation.x =  Math.PI /2;

	//CSS3D Panel HTML
    element = document.createElement('div');
    element.innerHTML = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit';
    element.className = 'panelContainer';

    //CSS3D Panel Object
    div = new THREE.CSS3DObject(element);
    div.position.x = -250;
    div.position.y = 0;
    div.position.z = -915;
    div.rotation.y = Math.PI + 0.5;
    scene2.add(div);
    // div.lookAt(camera.position.x, div.position.y,camera.position.z);
    
    //CSS3D Renderer
    renderer2 = new THREE.CSS3DRenderer();
    renderer2.setSize(window.innerWidth, window.innerHeight);
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.top = 0;
    document.body.appendChild(renderer2.domElement);

	function onMouseDown( event ) {
		mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );

		// See if the ray from the camera into the world hits one of our meshes
		var intersects = raycaster.intersectObject( hotspot );
		
		// Show Panel
		if ( intersects.length > 0 ) {
			document.getElementById("panel").style.display = "block";
		}
	}
	//Hide panel
	document.getElementById('closeBtn').addEventListener('click', function (event) {
		event.preventDefault();
		document.getElementById("panel").style.display = "none";
	});
	//Events
	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'mousedown', onMouseDown, false );

	// Renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.zIndex = 5;
	renderer.shadowMap.enabled = true;
	container.appendChild( renderer.domElement );

	// stats
	stats = new Stats();
	container.appendChild( stats.dom );

	// Toggle Camera Orbit
	var toggle = function() {
	    orbitEnabled = true;
	    return function() {
		    if(orbitEnabled) {
		        orbitEnabled = false;
		        document.getElementById( "orbitBtn" ).style.background = "#5db84b";
		    	document.getElementById( "orbitBtn" ).innerHTML = "Orbit On";
		        return;
		    }
		    orbitEnabled = true;
		    document.getElementById( "orbitBtn" ).style.background = "#bc1f3a";
		    document.getElementById( "orbitBtn" ).innerHTML = "Orbit Off";
		}
	}();

	//Orbit toggle button
	document.getElementById("orbitBtn").addEventListener('click', function (event) {
		event.preventDefault();
		toggle();
	});

	dist = distanceVector(camPos,lookatPos);

	//Orbit Controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.panningMode = THREE.HorizontalPanning;
	controls.minDistance = 0;
	controls.maxDistance = 3000;
	controls.maxPolarAngle = Math.PI / 2;
	// controls.enabled = false;
	controls.target.set( targetPos.x,targetPos.y,targetPos.z );
	controls.update();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	renderer2.render(scene2, camera);
	renderer.render( scene, camera );

	stats.update();

	if(orbitEnabled){
		//Enable oribiting
		if(theta <= -8.42){
			theta = -2.20;
		}
		else{
			theta-=0.001;
		}
		camPos.x = dist * Math.cos(theta) + lookatPos.x; 
		camPos.y = 300;
		camPos.z = dist * Math.sin(theta) + lookatPos.z;
		camera.position.set(camPos.x, camPos.y, camPos.z);
		camera.lookAt(lookatPos.x,lookatPos.y,lookatPos.z);
		div.rotation.y += 0.001;
		// div.lookAt(camera.position.x, 200, camera.position.z);
		// controls.enabled = false;
	}
	else{
		// controls.enabled = true;
	}

	//Printing Camera position
	document.getElementById("camPosition").innerHTML ="Camera X: "+ Math.round(camera.position.x) +" Camera Y: "+ Math.round(camera.position.y) +" Camera Z: "+ Math.round(camera.position.z)+"<br> "+"Target X: "+ Math.round(targetPos.x) +" Target Y: "+ Math.round(targetPos.y) +" Target Z: "+ Math.round(targetPos.z)+"<br> "+"LookAt X: "+ Math.round(lookatPos.x) +" LookAt Y: "+ Math.round(lookatPos.y) +" LookAt Z: "+ Math.round(lookatPos.z);
}
//Change Camera Position
document.getElementById("cameraBtn").addEventListener('click', function (event) {
	var cameraX = document.getElementById( "cameraX" ).value;
	var cameraY = document.getElementById( "cameraY" ).value;
	var cameraZ = document.getElementById( "cameraZ" ).value;
	event.preventDefault();
	camPos.x = cameraX;
	camPos.y = cameraY;
	camPos.z = cameraZ;
	camera.position.set(camPos.x,camPos.y,camPos.y);
	if(orbitEnabled){
		dist = distanceVector(camPos,lookatPos);
	}
});

//Change LookAt Position
document.getElementById("lookatBtn").addEventListener('click', function (event) {
	var lookatX = document.getElementById( "lookatX" ).value;
	var lookatY = document.getElementById( "lookatY" ).value;
	var lookatZ = document.getElementById( "lookatZ" ).value;
	event.preventDefault();
	lookatPos.x = lookatX;
	lookatPos.y = lookatY;
	lookatPos.z = lookatZ;			
	camera.lookAt(lookatPos);
});
//Change Target Position
document.getElementById("targetBtn").addEventListener('click', function (event) {
	var targetX = document.getElementById( "targetX" ).value;
	var targetY = document.getElementById( "targetY" ).value;
	var targetZ = document.getElementById( "targetZ" ).value;
	event.preventDefault();
	targetPos.x = targetX;
	targetPos.y = targetY;
	targetPos.z = targetZ;
	controls.target.set(targetPos);
	controls.reset();
	controls.update();
	// console.log(controls.target.x);
});
var camToSave = {};
camToSave.position = camera.position.clone();
function restoreCamera(position){
    camera.position.set(position.x, position.y, position.z);
}
function distanceVector( v1, v2 ){
	var dx = v1.x - v2.x;
	var dy = v1.y - v2.y;
	var dz = v1.z - v2.z;
	return Math.sqrt( dx * dx + dy * dy + dz * dz );
}
