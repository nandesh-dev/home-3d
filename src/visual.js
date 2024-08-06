import * as THREE from 'three'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export class Visual {
  /**
   * @param { HTMLElement } container
   */
  constructor(container) {
    /**
     * Parent container for card content
     * @private
     * @type { HTMLElement }
     */
    this.container = container

    /**
     * Aspect ratio of the visual
     * @private
     * @type { number }
     */
    this.aspectRatio = 2

    /**
     * THREE.js primary camera
     * @private
     */
    this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 1.0, 1000)

    /**
     * THREE.js scene for WebGLRenderer which will store all the models
     * @private
     */
    this.webglScene = new THREE.Scene()
    /**
     * THREE.js scene for CSS3DRenderer which will store all the interactive elements
     * @private
     */
    this.cssScene = new THREE.Scene()

    /**
     * THREE.js WebGLRenderer for rendering models to canvas
     * @private
     */
    this.webGLRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })
    this.webGLRenderer.setClearColor(0xffeeee, 0)

    /**
     * THREE.js CSS3Renderer for rendering interactive dom elements
     * @private
     */
    this.css3DRenderer = new CSS3DRenderer()

    this.webGLRenderer.setAnimationLoop(() => {
      this.webGLRenderer.render(this.webglScene, this.camera)
      this.css3DRenderer.render(this.cssScene, this.camera)
    })

    let resizeObserver = new ResizeObserver(() => {
      this.updateSize()
    })
    resizeObserver.observe(this.container)
    this.updateSize()

    this.addRendererElementsToContainer()

    /**
     * THREE.js Orbit control for controlling camera
     * @private
     */
    this.orbitControls = new OrbitControls(
      this.camera,
      this.css3DRenderer.domElement
    )
    this.camera.position.z = 20
    this.orbitControls.update()

    /**
     * THREE.js ambient light for entire scene
     */
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1)
    this.webglScene.add(this.ambientLight)

    this.tempLight = new THREE.PointLight(0xffffee, 1000)
    this.tempLight.position.y = 20
    this.webglScene.add(this.tempLight)

    this.loadModel('/local/room', 'glb').then((object) => {
      this.webglScene.add(object)
    })
  }

  /**
   * Loads model for THREE.js
   * @private
   * @param {string} url
   * @param {"obj"|"glb"} type
   */
  async loadModel(url, type) {
    switch (type) {
      case 'obj':
        let mtlLoader = new MTLLoader()
        let objLoader = new OBJLoader()

        let materials = await mtlLoader.loadAsync(`${url}.mtl`)
        materials.preload()

        objLoader.setMaterials(materials)
        return await objLoader.loadAsync(`${url}.obj`)
      case 'glb':
        let gltfLoader = new GLTFLoader()
        return (await gltfLoader.loadAsync(`${url}.glb`)).scene
    }
  }

  /**
   * Adds renderer dom elements to the container
   * @private
   */
  addRendererElementsToContainer() {
    this.webGLRenderer.domElement.style.position = 'absolute'
    this.container.appendChild(this.webGLRenderer.domElement)

    this.css3DRenderer.domElement.style.position = 'absolute'
    this.container.appendChild(this.css3DRenderer.domElement)
  }

  /**
   * Calculates and updates sizes of everything
   * @private
   */
  updateSize() {
    let { width, height } = this.calculateContainerSize()
    this.setSize(width, height)
  }

  /**
   * Calculates width and height based on the container size
   * @private
   * @returns {{ width: number, height: number }}
   */
  calculateContainerSize() {
    let width = this.container.offsetWidth
    let height = this.container.offsetHeight

    return { width, height }
  }

  /**
   * Updates the size of all renderers and aspect ratio of camera
   * @private
   * @param { number } width
   * @param { number } height
   */
  setSize(width, height) {
    this.webGLRenderer.setSize(width, height)
    this.css3DRenderer.setSize(width, height)

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }
}
