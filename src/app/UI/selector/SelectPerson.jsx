import React from 'react'
import Select from 'react-select'
import './SelectPerson.css'

const SelectPerson = (props) => {
  const { isDisabled, optionlist, passSelection } = props

  const handleChange = (selection) => {
    passSelection(selection)
  }

  return (
    <>
      <Select
        isDisabled={isDisabled}
        options={optionlist}
        placeholder="Печатайте, чтобы сократить список выбора"
        onChange={handleChange}
      />
    </>
  )
}

export default SelectPerson
