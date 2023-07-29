'use client'

import { createContext, useMemo, useState } from 'react'

const PersonContext = createContext()

const PersonProvider = (props) => {
  const [personLongname, setPersonLongname] = useState('')

  const value = useMemo(() => ({ personLongname, setPersonLongname }), [personLongname])

  return <PersonContext.Provider value={value}>{props.children}</PersonContext.Provider>
}
export { PersonContext, PersonProvider }
