import React from 'react'
import PropTypes from 'prop-types'
import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'

// pepjs needed for babylon touch event
import 'pepjs'

// earcut needed by babylon's polygon extruder
import earcut from 'earcut'
window.earcut = earcut

class BabylonScene extends React.Component {
  static propTypes = {
    engineOptions: PropTypes.object,
    antialias: PropTypes.bool,
    adaptToDeviceRatio: PropTypes.bool,
    onSceneMount: PropTypes.func.isRequired
  }

  static defaultProps = {
    antialias: true,
    adaptToDeviceRatio: false
  }

  componentDidMount () {
    // setup engine
    this.engine = new Engine(
      this.canvas,
      this.props.antialias,
      this.props.engineOptions,
      this.props.adaptToDeviceRatio
    )
    // create scene
    this.scene = new Scene(this.engine)
    // call scene mounted handler
    this.props.onSceneMount({
      scene: this.scene,
      engine: this.engine,
      canvas: this.canvas
    })
    // start render loop
    this.engine.runRenderLoop(() => {
      if (this.scene) {
        this.scene.render()
      }
    })
    // handle resize
    window.addEventListener('resize', this.onResizeWindow)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onResizeWindow)
  }

  onResizeWindow = () => {
    if (this.engine) {
      this.engine.resize()
    }
  }

  onCanvasLoaded = c => {
    if (c !== null) {
      this.canvas = c
      // avoid page scrolling
      const preventDefault = e => e.preventDefault()
      this.canvas.onwheel = preventDefault
      this.canvas.onmousewheel = preventDefault
    }
  }

  render () {
    return (
      <canvas
        ref={this.onCanvasLoaded}
        style={{ width: '100%', height: '100%', outline: 'none' }}
      />
    )
  }
}

export default BabylonScene
