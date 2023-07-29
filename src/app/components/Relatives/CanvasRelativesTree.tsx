import React, { useEffect, useRef } from 'react'

import stl from './CanvasRelativesTree.module.css'

const CanvasRelativesTree = (props: { DrawLines: any; width: number; height: number }) => {
  const { DrawLines, width, height } = props
  const canvasTree = useRef() as React.MutableRefObject<HTMLCanvasElement>  

  useEffect(() => {
    if (canvasTree) {
      const context = canvasTree.current.getContext('2d')
      DrawLines(context)
    }
    
  })

  return (
    <div>
      <canvas className={stl.canvastree} ref={canvasTree} width={width} height={height} />
    </div>
  )
}

export default CanvasRelativesTree
