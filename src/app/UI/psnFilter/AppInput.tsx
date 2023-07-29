import React from 'react'
import stl from './AppInput.module.css'

const AppInput = (props: any) => {
  return <input className={stl.appInput} {...props} />
}

export default AppInput
