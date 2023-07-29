'use client'

import { createContext, useMemo, useState } from 'react'

const PersonsListContext = createContext()

const PersonsListProvider = (props) => {
  const [personsList, setPersonsList] = useState([])

  const value = useMemo(() => ({ personsList, setPersonsList }), [personsList])

  return <PersonsListContext.Provider value={value}>{props.children}</PersonsListContext.Provider>
}

export { PersonsListContext, PersonsListProvider }
