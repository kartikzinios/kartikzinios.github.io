var container, stats, controls, loader, mesh, grid;
var camera, scene, renderer, light;
//Position variables
var targetPos, camPos;
//Orbit variables
var orbitEnabled = false, dist, theta = -2.20;
//Hotspot variables
var hotspotPos, geometry, material, sphere, raycaster, mouse;

init();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	//Camera
	camera = new THREE.PerspectiveCamera( 43, window.innerWidth / window.innerHeight, 10 , 10000 );
	camPos = new THREE.Vector3(1326,300,-1642);
	targetPos = new THREE.Vector3(1362,20,-712);
	camera.position.set(camPos.x, camPos.y, camPos.z);


	//Scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );

	//Light
	light = new THREE.HemisphereLight( 0xA9A9A9, 0xcccccc );
	light.position.set( 0, 2000 , 0 );
	scene.add( light );
	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 2000, 100 );
	light.castShadow = true;
	light.shadow.camera.top = 180;
	light.shadow.camera.bottom = -100;
	light.shadow.camera.left = -120;
	light.shadow.camera.right = 120;
	scene.add( light );

	// FBX Model
	loader = new THREE.FBXLoader();
	loader.load( 'assets/vulcan.fbx', function ( object ) {
		scene.add( object );
		object.position.set(0,-100,0);

	},function(){
		setTimeout(function(){
			document.getElementById("overlay").style.display = "none";
		},5000);
	},function(error){
		console.log("There is an error loading the fbx model");
	});


	// Hotspot object
	// hotspotPos = new THREE.Vector3(1362,100,-712);
	hotspotPos = new THREE.Vector3(1100,-50,-900);
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	geometry = new THREE.SphereGeometry( 10, 32, 32 );
	material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
	sphere = new THREE.Mesh( geometry, material );
	scene.add( sphere );
	sphere.position.set(hotspotPos.x, hotspotPos.y, hotspotPos.z);

	function onMouseDown( event ) {
		mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );
		
		// See if the ray from the camera into the world hits one of our meshes
		var intersects = raycaster.intersectObject( sphere );
		
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

	dist = distanceVector(camPos,targetPos);

	//Orbit Controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.target.set( targetPos.x,targetPos.y,targetPos.z );
	controls.panningMode = THREE.HorizontalPanning;
	controls.minDistance = 0;
	controls.maxDistance = 3000;
	controls.maxPolarAngle = Math.PI / 2;

	animate();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );

	stats.update();

	//Printing Camera position
	document.getElementById("camPosition").innerHTML ="Camera X: "+ Math.round(camera.position.x) +" Camera Y: "+ Math.round(camera.position.y) +" Camera Z: "+ Math.round(camera.position.z)+"<br> "+"Target X: "+ Math.round(targetPos.x) +" Target Y: "+ Math.round(targetPos.y) +" Target Z: "+ Math.round(targetPos.z)+"<br> ";

	//Input values
	var targetX = document.getElementById( "targetX" ).value;
	var targetY = document.getElementById( "targetY" ).value;
	var targetZ = document.getElementById( "targetZ" ).value;

	//Change Camera Position
	document.getElementById("cameraBtn").addEventListener('click', function (event) {
		event.preventDefault();
		camPos.x = targetX;
		camPos.y = targetY;
		camPos.z = targetZ;
		camera.position.set(camPos.x,camPos.y,camPos.y);
		dist = distanceVector(camPos,targetPos);

	});

	//Change Target Position 
	document.getElementById("targetBtn").addEventListener('click', function (event) {
		event.preventDefault();
		targetPos.x = targetX;
		targetPos.y = targetY;
		targetPos.z = targetZ;
		if(!orbitEnabled){
			controls.target.set(targetPos.x,targetPos.y,targetPos.z);
		}
		else{
			camera.lookAt(targetPos.x,targetPos.y,targetPos.z);
		}
		dist = distanceVector(camPos,targetPos);
	});

	if(orbitEnabled){
		//Enable oribiting
		if(theta <= -8.42){
			theta = -2.20;
		}
		else{
			theta-=0.001;
		}
		camPos.x = dist * Math.cos(theta) + targetPos.x; 
		camPos.y = 300;
		camPos.z = dist * Math.sin(theta) + targetPos.z;
		camera.position.set(camPos.x,camPos.y,camPos.z);
		camera.lookAt(targetPos.x,targetPos.y,targetPos.z);
	}
	else{
		controls.update();
	}
}

function distanceVector( v1, v2 ){
	var dx = v1.x - v2.x;
	var dy = v1.y - v2.y;
	var dz = v1.z - v2.z;
	return Math.sqrt( dx * dx + dy * dy + dz * dz );
}