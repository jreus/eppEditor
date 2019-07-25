import * as THREE from 'three'

let container, camera, renderer, scene, mesh;
let frameRate;

export function initThree(containerDIV, fps) {
  console.log("InitThree");

  // Get a reference to the container element that will hold our scene
  container = containerDIV;
  frameRate = fps;

  // create a Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x8FBCD4 );

  // set up the options for a perspective camera
  const fov = 35; // fov = Field Of View
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 100;

  camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so that we can view the scene
  camera.position.set( 0, 0, 10 );

  // create a geometry
  const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
  // create a purple Standard material
  const material = new THREE.MeshStandardMaterial( { color: 0x800080 } );
  // create a Mesh containing the geometry and material
  mesh = new THREE.Mesh( geometry, material );
  // add the mesh to the scene object
  scene.add( mesh );
  // Create a directional light
  const light = new THREE.DirectionalLight( 0xffffff, 5.0 );
  // move the light back and up a bit
  light.position.set( 10, 10, 10 );
  // remember to add the light to the scene
  scene.add( light );
  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  // add the automatically created <canvas> element to the page
  container.appendChild( renderer.domElement );
}

export function animateThree() {
  setTimeout( () => { requestAnimationFrame( animateThree ); }, 1000 / frameRate );

  // increase the mesh's rotation each frame
  mesh.rotation.z += 0.01;
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  // render, or 'create a still image', of the scene
  // this will create one still image / frame each time the animate
  // function calls itself
  renderer.render( scene, camera );
}

export function setBackgroundColor(red, green, blue) {
  scene.background = new THREE.Color( "rgb("+red+", "+green+", "+blue+")" );
}

export function setScale(scl) {
  mesh.scale.x = scl; mesh.scale.y = scl; mesh.scale.z = scl;
}

export function setTranslate(x,y,z) {
  mesh.position.x = x;
  mesh.position.y = y;
  mesh.position.z = z;
}
