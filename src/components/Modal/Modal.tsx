import React from 'react'
import { ModalConsumer } from './ModalProvider'
const Modal = (): React.ReactElement => {
  return (
    <ModalConsumer>
      {({ component: Component, hideModal, props }) => {
        return Component ? <Component {...props} onRequestClose={hideModal} /> : null
      }}
    </ModalConsumer>
  )
}

export default Modal
