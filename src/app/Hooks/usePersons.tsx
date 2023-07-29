import { useMemo } from 'react'
import { IPerson } from '../models/personType';


export const usePersons = (persons: IPerson[], query: string) => {

  const sortedAndSearchedPersons = useMemo(() => {
    return persons.filter((person) => person.longname.toLowerCase().includes(query.toLowerCase()))
  }, [query, persons])

  return sortedAndSearchedPersons
}
