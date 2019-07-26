import * as THREE from 'three'

let container, camera, renderer, scene, mesh, line;
let frameRate;
const things = new Array(100);
const protectedObjects = [0, 1, 2]; // objects that cannot be removed
const LINE_BOUNDS = 2.0; // half length of new lines
const LINE_POINTS = 20; // number of line points

export function setBackgroundColor(red, green, blue) {
  scene.background = new THREE.Color( "rgb("+red+", "+green+", "+blue+")" );
}

export function remove(id) {
  if(protectedObjects.includes(id)) {
      console.warn("Cannot remove protected object "+id);
  } else {
    scene.remove(things[id]);
    things[id] = null;
  }
}

export function scale(id, scl=1) {
  let obj = things[id];
  obj.scale.x = obj.scale.y = obj.scale.z = scl;
}

export function translate(id,x=0,y=0,z=0) {
  let obj = things[id];
  obj.position.x = x; obj.position.y = y; obj.position.z = z;
}

export function rotate(id,x=0,y=0,z=0) {
  let obj = things[id];
  obj.rotation.x = x; obj.rotation.y = y; obj.rotation.z = z;
}

export function makeCube(id,scene,h=1,w=1,d=1,color=0x800080) {
  let obj = new THREE.Mesh( new THREE.BoxBufferGeometry(h,w,d), new THREE.MeshStandardMaterial( { color: color } ));
  scene.add(obj);
  scene.remove(things[id]);
  things[id] = obj;
  return obj;
}

function updateCube(id=0) {
  things[id].rotation.z += 0.01;
  things[id].rotation.x += 0.01;
  things[id].rotation.y += 0.01;
}

export function makeLine(id,scene,color=0xA000A0) {
    let geo = new THREE.BufferGeometry();

    // attributes
    let positions = new Float32Array( LINE_POINTS * 3 ); // 3 vertices per point
    let index = 0;
    let x,y=0.0,z=0.0;
    // generate some positions
    let inc = (LINE_BOUNDS * 2) / LINE_POINTS;
    for(let i = LINE_BOUNDS * -1; i < LINE_BOUNDS; i += inc) {
      x = i;
      positions[index++] = x;
      positions[index++] = y;
      positions[index++] = z;
      y += ((Math.random() - 0.5) / 5);
    }

    geo.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    // drawcalls
    var drawCount = LINE_POINTS; // draw the first x points
    geo.setDrawRange( 0, drawCount );
    // material
    let mat = new THREE.LineBasicMaterial( { color: color, linewidth: 10.0 } );

    // line
    let obj = new THREE.Line( geo,  mat );
    scene.add( obj );
    things[id] = obj;

    obj.geometry.attributes.position.needsUpdate = true; // required after the first render
    obj.geometry.verticesNeedUpdate = true;

    return obj;
}

// takes an array [x1,y1,z1,x2,y2,z2... etc] of positions
export function setLine(id, pointarray) {
  let obj = things[id];
  let positions = obj.geometry.attributes.position.array;
  for(let i = 0; i < pointarray.length; i++) {
    positions[i] = pointarray[i];
  }
  //console.log("setLine", obj, pointarray);
  obj.geometry.attributes.position.needsUpdate = true; // required after the first render
  obj.geometry.verticesNeedUpdate = true;

}


function updateLine(id=0) {
  let linepoints = things[0].geometry.attributes.position.array;
  let newline = new Array(linepoints.length);
  for(let i=0; i < line.geometry.attributes.position.array.length; i += 3) {
    newline[i] = linepoints[i]; // x
    newline[i+1] = linepoints[i+1] + (Math.random()-0.5); // y
    newline[i+2] = linepoints[i+2]; // z
  }
  setLine(0, newline);
  /*
  obj.geometry.attributes.position.needsUpdate = true; // required after the first render
  obj.geometry.verticesNeedUpdate = true;

  obj.geometry.computeBoundingSphere();
  */
}



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

  // make some geometry
  mesh = makeCube(1, scene);
  line = makeLine(0, scene, 0x000000);

  // Create a directional light
  const light = new THREE.DirectionalLight( 0xffffff, 5.0 );
  light.position.set( 10, 10, 10 );
  scene.add( light );

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  container.appendChild( renderer.domElement );
}

export function animateThree() {
  setTimeout( () => { requestAnimationFrame( animateThree ); }, 1000 / frameRate );

  updateCube(1);
  //updateLine(0);

  // this will create one still image / frame each time the animate
  // function calls itself
  renderer.render( scene, camera );
}
