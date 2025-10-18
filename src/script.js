import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'

/**
 * Debug UI
 */
const gui = new dat.GUI()

/**
 * Parameters object 
 */
const parameters = {
    color: 0x00bcd4,
    spin: () => {
        gsap.to(cylinder.rotation, { duration: 1, y: cylinder.rotation.y + Math.PI * 2 })
    }
}

/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x101820)

/**
 * Cylinder geometry
 */
const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16, 8)
const material = new THREE.MeshStandardMaterial({
    color: parameters.color,
    roughness: 0.4,
    metalness: 0.3,
    wireframe: false
})
const cylinder = new THREE.Mesh(geometry, material)
scene.add(cylinder)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(2, 2, 2)
scene.add(directionalLight)

/**
 * Camera
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 3)
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera, document.querySelector('.webgl'))
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl') })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Resize Handling
 */
window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Fullscreen Handling
 */
window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(document.querySelector('.webgl').requestFullscreen)
            document.querySelector('.webgl').requestFullscreen()
        else if(document.querySelector('.webgl').webkitRequestFullscreen)
            document.querySelector('.webgl').webkitRequestFullscreen()
    }
    else
    {
        if(document.exitFullscreen)
            document.exitFullscreen()
        else if(document.webkitExitFullscreen)
            document.webkitExitFullscreen()
    }
})

/**
 * GUI TWEAKS
 */

// Move cylinder up/down
gui.add(cylinder.position, 'y').min(-3).max(3).step(0.01).name('Elevation')

// Rotate manually
gui.add(cylinder.rotation, 'y').min(0).max(Math.PI * 2).step(0.01).name('Rotation')

// Toggle visibility
gui.add(cylinder, 'visible').name('Visible')

// Toggle wireframe
gui.add(material, 'wireframe').name('Wireframe')

// Change color
gui
    .addColor(parameters, 'color')
    .name('Color')
    .onChange(() => {
        material.color.set(parameters.color)
    })

// Add spin button
gui.add(parameters, 'spin').name('Spin Cylinder')

/**
 * Animation
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Gentle rotation
    cylinder.rotation.x = Math.sin(elapsedTime * 0.3) * 0.3

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
