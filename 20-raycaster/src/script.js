import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster();

// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// NOTE: Always normalize the direction for the raycaster
// rayDirection.normalize();

// raycaster.set(rayOrigin, rayDirection);

// NOTE: a raycast can go through an object multiple times (e.g. if it's a donut
// shape)
// const intersect = raycaster.intersectObject(object2);
// console.log(intersect);

// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

const red = "0000ff";
const blue = "ff0000";
window.addEventListener("click", (event) => {
  if (currentIntersect) {
    setObjectColor(currentIntersect.object);
  }
});

function setObjectColor(object) {
  const color = object.material.color;

  if (color.getHexString() === red) {
    color.set(`#${blue}`);
  } else {
    color.set(`#${red}`);
  }
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let currentIntersect = null;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animated objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = -Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // Cast a ray
  raycaster.setFromCamera(mouse, camera);

  const objectsToTest = [object1, object2, object3];

  const intersects = raycaster.intersectObjects(objectsToTest);

  // for (const objectToSet of objectsToTest) {
  //   objectToSet.material.color.set("#ff0000");
  // }

  // for (const intersect of intersects) {
  //   intersect.object.material.color.set("#0000ff");
  // }

  if (intersects.length) {
    // if (!currentIntersect) {
    //   console.log("mouse enter");
    // }

    currentIntersect = intersects[0];
  } else {
    // if (currentIntersect) {
    //   console.log("mouse leave");
    // }

    currentIntersect = null;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
