var container, stats, controls, loader, mesh, grid;
var camera, scene, renderer, light, hotspot;
//Position variables
var targetPos, camPos;
//Orbit variables
var orbitEnabled = false, dist, theta = -2.20;
//Hotspot variables
var hotspotPos, geometry, material, sphere, raycaster,raycaster2, mouse;
var scene2;
var renderer2;
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
	hotspotPos1 = new THREE.Vector3(1110,134,-915);
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
	material1 = new THREE.MeshBasicMaterial( {
		map: new THREE.TextureLoader().load( 'assets/hotspot.png' ),
		side: THREE.DoubleSide
	});
	geometry1 = new THREE.PlaneGeometry( 32, 32 );
	hotspot1 = new THREE.Mesh(geometry, material);
	hotspot1.position.set(hotspotPos1.x, hotspotPos1.y, hotspotPos1.z);
	hotspot1.rotation.y = Math.PI + 0.5;
	

	//Events
	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'mousedown', onMouseDown, false );

	// Renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.zIndex = 5;
	renderer.shadowMap.enabled = true;
	document.body.appendChild(renderer.domElement);

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

	//CSS3D Scene
    scene2 = new THREE.Scene();

    //HTML
    element = document.createElement('div');
    element.innerHTML = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit';
    element.className = 'three-div';

    //CSS Object
    div = new THREE.CSS3DObject(element);
    div.position.x = 1100;
    div.position.y = 0;
    div.position.z = -915;
    div.rotation.y = Math.PI + 0.5;
    

    //CSS3D Renderer
    renderer2 = new THREE.CSS3DRenderer();
    renderer2.setSize(window.innerWidth, window.innerHeight);
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.top = 0;
    renderer2.domElement.style.zIndex = 0;
    document.body.appendChild(renderer2.domElement);

    //Orbit Controls
	controls = new THREE.OrbitControls( camera, renderer2.domElement );
	controls.target.set( targetPos.x,targetPos.y,targetPos.z );
	controls.panningMode = THREE.HorizontalPanning;
	controls.minDistance = 0;
	controls.maxDistance = 3000;
	controls.maxPolarAngle = Math.PI / 2;
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	renderer2.render(scene2, camera);

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
		hotspot1.rotation.y += 0.001;
	}

	//Printing Camera position
	document.getElementById("camPosition").innerHTML ="Camera X: "+ Math.round(camera.position.x) +" Camera Y: "+ Math.round(camera.position.y) +" Camera Z: "+ Math.round(camera.position.z)+"<br> "+"LookAt X: "+ Math.round(lookatPos.x) +" LookAt Y: "+ Math.round(lookatPos.y) +" LookAt Z: "+ Math.round(lookatPos.z);
}

//Change LookAt Position
document.getElementById("lookatBtn").addEventListener('click', function (event) {
	var lookatX = document.getElementById( "lookatX" ).value;
	var lookatY = document.getElementById( "lookatY" ).value;
	var lookatZ = document.getElementById( "lookatZ" ).value;
	event.preventDefault();
	lookatPos.x = lookatX;
	lookatPos.y = lookatY;
	lookatPos.z = lookatZ;			
	camera.position.set(camPos.x,camPos.y,camPos.y);
	camera.lookAt(lookatPos.x,lookatPos.y,lookatPos.z);
	if(orbitEnabled){
		dist = distanceVector(camPos,lookatPos);
	}
});
//Reset Orbit Control
document.getElementById("targetBtn").addEventListener('click', function (event) {
	event.preventDefault();
	controls.reset();
});
function distanceVector( v1, v2 ){
	var dx = v1.x - v2.x;
	var dy = v1.y - v2.y;
	var dz = v1.z - v2.z;
	return Math.sqrt( dx * dx + dy * dy + dz * dz );
}
function onMouseDown( event ) {
	mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	// See if the ray from the camera into the world hits one of our meshes
	var intersects = raycaster.intersectObjects( scene.children,true );
	var intersects1 = raycaster.intersectObject( hotspot );
	var intersects2 = raycaster.intersectObject( hotspot1 );


	// Show Panel
	if ( intersects.length > 0 ) {
		console.log(intersects);
		console.log(intersects[0].point)
		var geometry = new THREE.BoxGeometry( 10, 10, 10 );
		var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.set(intersects[0].point.x,-50,intersects[0].point.z);
		cube.scale=intersects[0].distance;
		if(intersects1 == 0 || intersects2 == 0){
			scene.add( cube );
		}
		
		// document.getElementById("panel").style.display = "block";
	}
	
	// Show Panel
	if ( intersects1.length > 0 ) {
		scene2.add(div);
		scene.add( hotspot1 );
		scene.remove( hotspot );
	}
	else if ( intersects2.length > 0 ) {
		scene2.remove(div);
		scene.remove( hotspot1 );
		scene.add( hotspot );
	}
}
//Hide panel
document.getElementById('closeBtn').addEventListener('click', function (event) {
	event.preventDefault();
	document.getElementById("panel").style.display = "none";
});