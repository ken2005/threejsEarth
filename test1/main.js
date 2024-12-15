import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

const w = window.innerWidth
const h = window.innerHeight
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
renderer.setSize(w, h)
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement)

const fov =   75
const aspect = w / h
const near = 0.1
const far = 1000
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.z = 2

const scene = new THREE.Scene()

renderer.render(scene, camera)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05

const loader = new THREE.TextureLoader()
const earthGroup = new THREE.Group()
earthGroup.rotation.z = -23.4 * Math.PI / 180
scene.add(earthGroup)

const geo = new THREE.IcosahedronGeometry(1, 12)
const mat = new THREE.MeshStandardMaterial({
  map: loader.load('/assets/textures/earthmap1k.jpg'),
})
const earthMesh = new THREE.Mesh(geo, mat)
earthGroup.add(earthMesh)

const sunlight = new THREE.DirectionalLight(0xffffff)
sunlight.position.set(-2, 0.5, 1.5)
scene.add(sunlight)

const lightMat = new THREE.MeshBasicMaterial({
  opacity: 0.5,
  map: loader.load('/assets/textures/earthlights1k.jpg'),
  blending: THREE.AdditiveBlending,
})
const lightsMesh = new THREE.Mesh(geo, lightMat)
earthGroup.add(lightsMesh)

const cloudsMat = new THREE.MeshStandardMaterial({
  opacity: 0.5,
  map: loader.load('/assets/textures/earthcloudmaptrans.jpg'),
  blending: THREE.AdditiveBlending,
})
const cloudsMesh = new THREE.Mesh(geo, cloudsMat)
cloudsMesh.scale.setScalar(1.002)
earthGroup.add(cloudsMesh)

const auraMat = new THREE.MeshStandardMaterial({
  color : 0x0000ff,
  transparent: true,
  opacity: 0.3
})
const auraMesh = new THREE.Mesh(geo,auraMat)
auraMesh.scale.setScalar(1.03)

earthGroup.add(auraMesh)

const wireMat = new THREE.MeshStandardMaterial({})
const wireMesh = new THREE.Mesh(geo, wireMat)

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2)

renderer.render(scene, camera)

const button = ARButton.createButton(renderer, {
  optionalFeatures: ['dom-overlay'],
  domOverlay: { root: document.body },
});
button.style.backgroundColor = 'black';
button.style.color = 'white';
document.body.appendChild(button);

function animate() {
  requestAnimationFrame(animate)
  earthMesh.rotation.y += 0.002
  lightsMesh.rotation.y += 0.002
  cloudsMesh.rotation.y += 0.003
  renderer.render(scene, camera)
}
animate()
