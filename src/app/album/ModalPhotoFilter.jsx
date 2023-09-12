import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useState } from 'react'

const ModalPhotoFilter = (props) => {
  const { modalIsOpen, closeModal, cbFilter } = props

  const [filter, setFilter] = useState('')
  const [titleStartsWith, setTitleStartsWith] = useState(false)

  let strFilter = ''

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
    //console.log('strFilter = ', strFilter)
    cbFilter(strFilter)
    closeModal()
  }
  const handleCheckChange = () => {
    setTitleStartsWith((prev) => !prev)
    //console.log('radio:', titleStartsWith)
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
                defaultChecked={false}
                label="заголовок начинается с ..."
                onClick={handleCheckChange}
              />
              <Form.Control
                as="input"
                type="text"
                name="title"
                value={filter}
                placeholder="введите искомый текст"
                onChange={(e) => setFilter(e.target.value)}
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
