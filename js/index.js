var container, stats, controls, loader, mesh, grid;
var camera, scene, renderer, light, hotspot;
//Position variables
var targetPos, camPos;
//Orbit variables
var orbitEnabled = false, dist, theta = -2.20;
//Hotspot variables
var hotspotPos, geometry, material, hotspot, geometry1, material1, hotspot1, geometry2, material2, cylinder, raycaster, mouse;
//CSS3D variables
var scene2, renderer2;
var mapModel, oldModel;

init();
animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	//Camera
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 10 , 10000 );
	camPos = new THREE.Vector3(1300,300,-1210);
	targetPos = new THREE.Vector3(1205,20,-590);
	lookatPos = new THREE.Vector3(1205,20,-590);
	camera.position.set(camPos.x, camPos.y, camPos.z);

	//Scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff);
	scene.fog = new THREE.Fog( 0xffffff, 2500, 5000);

	//Light
	light = new THREE.DirectionalLight( 0xffffff, 1.2 ); //sun light
	light.position.set( 2100, 1500, 1075 );
	light.castShadow = true; 
	light.shadow.camera.near = -50;
	light.shadow.camera.far = 3000
	light.shadow.camera.right = 2000
	light.shadow.camera.left = 0
	light.shadow.camera.top	= 0;
	light.shadow.camera.bottom = -2000;
	light.shadowWith = 2048;
	light.shadowMapHeight = 2048;
	scene.add( light );
	// scene.add( new THREE.CameraHelper( light.shadow.camera ) ); //ambient light

	light = new THREE.DirectionalLight( 0xffffff, 0.9 );
	light.position.set( -45, 500, -1429 );
	light.castShadow = false; //only sunlight cast shadow
	scene.add( light ); 

	light = new THREE.DirectionalLight( 0xffffff, 0.7 ); // ambient light
	light.position.set( -1780, 600, 1270 );
	light.castShadow = false; //only sunlight cast shadow
	scene.add( light );

	//CSS3D Scene
    scene2 = new THREE.Scene();

    //HTML
    element = document.createElement('div');
    element.innerHTML = '<strong>Allen Institute</strong><br>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis';
    element.className = 'three-div';

    //CSS Object
    div = new THREE.CSS3DObject(element);
    div.position.x = 1000;
    div.position.y = -5;
    div.position.z = -915;
    div.rotation.y = Math.PI;

	// FBX Model
	var manager = new THREE.LoadingManager();
	loader = new THREE.FBXLoader(manager);
	loader.load( 'Content/fbx/SEA_Static.fbx', function ( object ) {
		object.position.set(0,-100,0);
		scene.add( object );
		oldModel = object;
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
	});
	loader.load( 'Content/fbx/Site.fbx', function ( object ) {
		scene.add( object );
		object.position.set(0,-100,0);
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
	});
	loader.load( 'Content/fbx/VUL_New Building.fbx', function ( object ) {
		scene.add( object );
		object.position.set(0,-100,0);
		mapModel = object;
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
	}); 
	loader.load( 'Content/fbx/SEA_1988201155_New2020Land.fbx', function ( object ) {
		scene.add( object );
		object.position.set(0,-100,0);
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
	});
	loader.load( 'Content/fbx/SEA_New Property.fbx', function ( object ) {
		scene.add( object );
		object.position.set(0,-100,0);
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
	});
	loader.load( 'Content/fbx/SEA_SLUTransit_New2020Land.fbx', function ( object ) {
		scene.add( object );
		object.position.set(0,-100,0);
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
	}); 
	//old buildings below
	/*loader.load( 'Content/fbx/VUL Land.FBX', function ( object ) {
		scene.add( object );
		object.position.set(0,-100,0);
	});
	loader.load( 'Content/fbx/VUL_Old Building.FBX', function ( object ) {
		scene.add( object );
		object.position.set(0,-100,0);
	});
		loader.load( 'Content/fbx/SEA_Old Property.FBX', function ( object ) {
		scene.add( object );
		object.position.set(0,-100,0);
	});*/

	manager.onLoad = function(){
		document.getElementById("overlay").style.display = "none";
	}

	// Hotspot object
	hotspotPos = new THREE.Vector3(1110,-65,-915);
	hotspotPos1 = new THREE.Vector3(1110,9,-915);
	cylinderPos = new THREE.Vector3(1110,-39,-915);
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	// Hotspot panel open
	material = new THREE.MeshBasicMaterial( {
		map: new THREE.TextureLoader().load( 'assets/hotspot.png' ),
		side: THREE.DoubleSide
	});
	geometry = new THREE.PlaneGeometry( 32, 32 );
	hotspot = new THREE.Mesh(geometry, material);
	scene.add( hotspot );
	hotspot.position.set(hotspotPos.x, hotspotPos.y, hotspotPos.z);
	// hotspot.rotation.x =  Math.PI /2;

	//Hotspot panel close
	material1 = new THREE.MeshBasicMaterial( {
		map: new THREE.TextureLoader().load( 'assets/close.png' ),
		side: THREE.DoubleSide
	});
	geometry1 = new THREE.PlaneGeometry( 32, 32 );
	hotspot1 = new THREE.Mesh(geometry1, material1);
	hotspot1.position.set(hotspotPos1.x, hotspotPos1.y, hotspotPos1.z);
	// hotspot1.rotation.y = Math.PI + 0.5;

	// Hotspot panel cylinder
	geometry2 = new THREE.CylinderGeometry( 1, 1, 65, 32 );
	material2 = new THREE.MeshBasicMaterial( {color: 0xffffff} );
	cylinder = new THREE.Mesh( geometry2, material2 );
	cylinder.position.set(cylinderPos.x,cylinderPos.y,cylinderPos.z);

	// Event Listeners
	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'mousedown', onMouseDown, false );

	// Webgl Renderer
	renderer = new THREE.WebGLRenderer({antialias : true, alpha: true});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.zIndex = 5;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.body.appendChild(renderer.domElement);

	// Stats
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

	// Orbit toggle button
	document.getElementById("orbitBtn").addEventListener('click', function (event) {
		event.preventDefault();
		toggle();
	});

	dist = distanceVector(camPos,lookatPos);

    // CSS3D Renderer
    renderer2 = new THREE.CSS3DRenderer();
    renderer2.setSize(window.innerWidth, window.innerHeight);
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.top = 0;
    renderer2.domElement.style.zIndex = 0;
    document.body.appendChild(renderer2.domElement);


    // Orbit Controls
	controls = new THREE.OrbitControls( camera, renderer2.domElement, renderer.domElement );
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
		// Enable oribiting
		if(theta <= -8.42){
			theta = -2.20;
		}
		else{
			theta-=0.001;
		}
		var orbitX = dist * Math.cos(theta) + lookatPos.x;
		var orbitZ = dist * Math.sin(theta) + lookatPos.z;
		camPos.x = Number(orbitX); 
		// camPos.y = 300;
		camPos.z = Number(orbitZ);
		camera.position.set(camPos.x, camPos.y, camPos.z);
		camera.lookAt(lookatPos.x,lookatPos.y,lookatPos.z);
		// div.rotation.y += 0.001;
		// hotspot1.rotation.y += 0.001;
	}

	// Printing Camera position
	document.getElementById("camPosition").innerHTML ="Camera X: "+ Math.round(camera.position.x) +" Camera Y: "+ Math.round(camera.position.y) +" Camera Z: "+ Math.round(camera.position.z)+"<br> "+"LookAt X: "+ Math.round(lookatPos.x) +" LookAt Y: "+ Math.round(lookatPos.y) +" LookAt Z: "+ Math.round(lookatPos.z);
	
	// Change Camera Position
	document.getElementById("cameraBtn").addEventListener('click', function (event) {
		var cameraX = document.getElementById( "cameraX" ).value;
		var cameraY = document.getElementById( "cameraY" ).value;
		var cameraZ = document.getElementById( "cameraZ" ).value;
		event.preventDefault();
		camPos.x = Number(cameraX);
		camPos.y = Number(cameraY);
		camPos.z = Number(cameraZ);
		camera.position.set(camPos.x,camPos.y,camPos.z);
		dist = distanceVector(camPos,lookatPos);
	});

	// Change LookAt Position
	document.getElementById("lookatBtn").addEventListener('click', function (event) {
		var lookatX = document.getElementById( "lookatX" ).value;
		var lookatY = document.getElementById( "lookatY" ).value;
		var lookatZ = document.getElementById( "lookatZ" ).value;
		event.preventDefault();
		lookatPos.x = Number(lookatX);
		lookatPos.y = Number(lookatY);
		lookatPos.z = Number(lookatZ);
		camera.position.set(camPos.x,camPos.y,camPos.y);
		camera.lookAt(lookatPos.x,lookatPos.y,lookatPos.z);
		dist = distanceVector(camPos,lookatPos);
	});

	// Reset Orbit Control
	document.getElementById("targetBtn").addEventListener('click', function (event) {
		event.preventDefault();
		controls.reset();
	});
}
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
	
	// Raycaster intersects
	var intersects = raycaster.intersectObjects( scene.children,true );
	var intersects1 = raycaster.intersectObject( hotspot );
	var intersects2 = raycaster.intersectObject( hotspot1 );
	var highlightBuilding = mapModel.getObjectByName( "VUL_4088803385_NEW2016", true );
	highlightBuilding.material = highlightBuilding.material.clone();


	// Get scene intersects
	if ( intersects.length > 0 ) {
		// console.log(intersects[0].id);
		// console.log(intersects[0].point)
		// var geometry = new THREE.BoxGeometry( 10, 10, 10 );
		// var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
		// var cube = new THREE.Mesh( geometry, material );
		// cube.position.set(intersects[0].point.x,intersects[0].point.y,intersects[0].point.z);
		// cube.scale=intersects[0].distance;
		// if(intersects1 == 0 || intersects2 == 0){
		// 	scene.add( cube );
		// }
		document.querySelector("#buildingName").innerHTML = "Building Name: " + intersects[0].object.name;
		mapModel.traverse( function(child) {
			console.log(child.name);
		});
		oldModel.traverse( function(child) {
			console.log(child.name);
		});
	}
	
	// Show Panel
	if ( intersects1.length > 0 ) {
		scene2.add(div);
		scene.add(hotspot1);
		scene.remove(hotspot);
		scene.add(cylinder);
		highlightBuilding.material.color.setHex(0xff0000);
	}

	// Hide Panel
	else if ( intersects2.length > 0 ) {
		scene2.remove(div);
		scene.remove(hotspot1);
		scene.remove(cylinder);
		scene.add(hotspot);
		highlightBuilding.material.color.setHex(0xb4b4b4);
	}
}
// Show/Hide configuration panel
document.getElementById('showConfiguration').addEventListener('click', function () {
	document.getElementById("configurationPanel").style.display = "block";
	document.getElementById("showConfiguration").style.display = "none";
});
document.getElementById('hideConfiguration').addEventListener('click', function () {
	document.getElementById("configurationPanel").style.display = "none";
	document.getElementById("showConfiguration").style.display = "block";
});