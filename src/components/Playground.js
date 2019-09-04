import React from 'react'
import { Vector3, Color3 } from '@babylonjs/core/Maths/math'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { PBRMetallicRoughnessMaterial } from '@babylonjs/core/Materials/PBR/pbrMetallicRoughnessMaterial'
import { LinesBuilder } from '@babylonjs/core/Meshes/Builders/linesBuilder'
import { PlaneBuilder } from '@babylonjs/core/Meshes/Builders/planeBuilder'
import { SphereBuilder } from '@babylonjs/core/Meshes/Builders/sphereBuilder'
import { BoxBuilder } from '@babylonjs/core/Meshes/Builders/boxBuilder'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { SkyMaterial } from '@babylonjs/materials/sky'
// required babylon side effects
import '@babylonjs/core/Animations/animatable'

import BabylonScene from './BabylonScene'

const SHOW_WORLD_AXIS = false

const Playground = () => {
  // scene setup
  const onSceneMount = ({ canvas, scene, engine }) => {
    console.log('Babylon scene mounted')
    window.scene = scene // for debug
    // camera
    const camera = new ArcRotateCamera(
      'arc-camera',
      -Math.PI / 2,
      Math.PI / 4,
      25,
      new Vector3(6, 0, -1.5),
      scene
    )
    camera.setTarget(Vector3.Zero())
    camera.attachControl(canvas, true)
    // sky (https://doc.babylonjs.com/extensions/sky)
    const skyMaterial = new SkyMaterial('sky-material', scene)
    skyMaterial.backFaceCulling = false
    skyMaterial.luminance = 0.8
    skyMaterial.inclination = 0.18
    skyMaterial.azimuth = 0.27
    const skybox = BoxBuilder.CreateBox('skybox', { size: 1000 }, scene)
    skybox.material = skyMaterial
    // create light
    const light = new DirectionalLight('light', new Vector3(-1, -2, 1), scene)
    const lightDistance = 20
    light.position = new Vector3(
      lightDistance,
      2 * lightDistance,
      lightDistance
    )
    light.intensity = 1.5
    // scene
    createStaticMesh({ scene })
    // debug
    if (SHOW_WORLD_AXIS) {
      showWorldAxis({ size: 5, scene })
    }
  }

  const createStaticMesh = ({ scene }) => {
    // land
    const landMaterial = new PBRMetallicRoughnessMaterial('landMaterial', scene)
    landMaterial.baseColor = new Color3(0.811, 0.749, 0.529)
    landMaterial.metallic = 0
    landMaterial.roughness = 1.0
    const land = PlaneBuilder.CreatePlane(
      'land',
      { size: 1000, sideOrientation: Mesh.FRONTSIDE },
      scene
    )
    land.rotation = new Vector3(Math.PI / 2, 0, 0)
    land.material = landMaterial
    // meshes
    const defaultMaterial = new StandardMaterial('default-material', scene)
    defaultMaterial.diffuseColor = new Color3(1, 1, 1)
    const sphere = SphereBuilder.CreateSphere(
      'sphere',
      { diameter: 2, segments: 16 },
      scene
    )
    sphere.material = defaultMaterial
    sphere.position.y = 1
    const cube = BoxBuilder.CreateBox('cube', { size: 1, height: 3 }, scene)
    cube.position = new Vector3(1, 1.5, 0)
    cube.material = defaultMaterial
  }

  const showWorldAxis = ({ size, scene }) => {
    const axisX = LinesBuilder.CreateLines(
      'axisX',
      {
        points: [Vector3.Zero(), new Vector3(size, 0, 0)]
      },
      scene
    )
    axisX.color = new Color3(1, 0, 0)
    const axisY = LinesBuilder.CreateLines(
      'axisY',
      {
        points: [Vector3.Zero(), new Vector3(0, size, 0)]
      },
      scene
    )
    axisY.color = new Color3(0, 1, 0)
    const axisZ = LinesBuilder.CreateLines(
      'axisZ',
      {
        points: [Vector3.Zero(), new Vector3(0, 0, size)]
      },
      scene
    )
    axisZ.color = new Color3(0, 0, 1)
  }

  // initialise scene rendering
  return <BabylonScene onSceneMount={onSceneMount} />
}

export default Playground
