import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useState } from 'react'

const ModalPhotoFilter = (props) => {
  const { modalIsOpen, closeModal, cbFilter, cbOrder } = props

  const [filter, setFilter] = useState('')
  const [titleStartsWith, setTitleStartsWith] = useState(true)
  const [orderNewFirst, setOrderNewFirst] = useState(true)

  let strFilter = ''
  let strOrder = ''

  const handleSave = () => {
    if (filter) {
      if (titleStartsWith) {
        strFilter = ` STARTS WITH "${filter}"`
      } else {
        strFilter = ` CONTAINS "${filter}"`
      }
    } else {
      strFilter = ''
    }

    if (orderNewFirst) {
      strOrder = 'DESC'
    } else {
      strOrder = ''
    }

    cbFilter(strFilter)
    cbOrder(strOrder)
    closeModal()
  }
  const handleCheckChange = () => {
    setTitleStartsWith((prev) => !prev)
  }
  const handleOrderCheckChange = () => {
    setOrderNewFirst((prev) => !prev)
  }
  const handleControlChange = (e) => {
    let controlValue = e.target.value
    if (controlValue) {
      setFilter(controlValue.toLowerCase())
    } else {
      setFilter('')
    }
  }

  return (
    <>
      <Modal show={modalIsOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Отбор фото, имеющие в заголовке заданный текст</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicTitle">
              <Form.Check
                as="input"
                type="checkbox"
                name="startsWith"
                defaultChecked={true}
                label="заголовок начинается с ..."
                onClick={handleCheckChange}
              />
              <Form.Control
                as="input"
                type="text"
                name="title"
                value={filter}
                placeholder="введите искомый текст"
                onChange={handleControlChange}
              />
              <Form.Check
                as="input"
                type="checkbox"
                name="orderNewFirst"
                defaultChecked={true}
                label="выводить в обратной хронологии"
                onClick={handleOrderCheckChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Установить фильтр
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalPhotoFilter
