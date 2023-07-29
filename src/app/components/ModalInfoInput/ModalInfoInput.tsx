import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import getPhotoProperties from '@/app/API/PhotosWR/getPhotoProperties'
import setPhotoProperties from '@/app/API/PhotosWR/setPhotoProperties'

const ModalInfoInput = (props: {
  modalIsOpen: boolean;
  closeModal: () => void;
  photoName: React.MutableRefObject<string | null>;
  cbMessage: (a: string) => void
}) => {
  const { modalIsOpen, closeModal, photoName, cbMessage } = props
  const [form, setForm] = useState({
    title: '',
    caption: '',
  })

  async function showForm() {
    const passBackProperties = (data:{photoTitle:string, photoCaption: string}) => {
      setForm({
        title: data.photoTitle,
        caption: data.photoCaption,
      })
    }

    await getPhotoProperties(photoName.current, passBackProperties)
  }

  async function handleSave() {
    const callBackRes = (message: string) => {
      cbMessage(message)
    }

    await setPhotoProperties(photoName.current, form.title, form.caption, callBackRes)

    closeModal()
  }

  return (
    <div>
      <Modal show={modalIsOpen} onHide={closeModal} onShow={showForm}>
        <Modal.Header closeButton>
          <Modal.Title>Введите описание фотографии</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicTitle">
              <Form.Control
                // ref={title}
                as="input"
                type="text"
                name="title"
                value={form.title}
                placeholder="заголовок фотографии"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Form.Text className="text-muted">дата съемки, место и т.п.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Control
                //ref={caption}
                type="text"
                name="caption"
                value={form.caption}
                placeholder="описание фотографии"
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
              />
              <Form.Text className="text-muted">Подпись в нижней части фотографии</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Закрыть без сохранения
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Закрыть и сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ModalInfoInput
