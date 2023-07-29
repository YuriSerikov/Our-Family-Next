import React from 'react'
import AppSearch from '../../UI/psnFilter/AppInput'
//import AppSelect from '../UI/select/AppSelector'

const PersonFilter = ({ filter, setFilter }) => {
  return (
    <div>
      <AppSearch
        value={filter.query}
        onChange={(e) => setFilter({ ...filter, query: e.target.value })}
        placeholder="Поиск ..."
      />
    </div>
  )
}

export default PersonFilter
