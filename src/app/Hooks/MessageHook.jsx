import React, { useEffect, useState } from 'react'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Row from 'react-bootstrap/Row'
import Toast from 'react-bootstrap/Toast'

const MessageHook = ({ children, ...props }) => {
  const { page, variant } = props

  const [showM, setShowM] = useState(false)
  //const toggleShowM = () => setShowM(prev => !prev);

  useEffect(() => {
    if (children) {
      setShowM(true)
    }
  }, [children])

  return (
    <Row>
      <ToastContainer className="p-3" position="middle-end">
        <Toast
          className="d-inline-block m-1"
          bg={variant}
          show={showM}
          onClose={() => setShowM(false)}
          delay={3000}
          autohide
        >
          <Toast.Header closeButton={true}>
            <strong className="me-auto">{page}</strong>
          </Toast.Header>
          <Toast.Body className={variant}>{children}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Row>
  )
}

export default MessageHook
