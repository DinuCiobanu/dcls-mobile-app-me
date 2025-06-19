import React from 'react'
import { ModalConsumer } from './ModalProvider'
const Modal = (): React.ReactElement => {
  return (
    <ModalConsumer>
      {({ component: Component, hideModal, props }) => {
        // console.log('53-36', Component.toString())
        // return <View style={{ width: 100, height: 200, backgroundColor: 'red' }}></View>
        return Component ? <Component {...props} onRequestClose={hideModal} /> : null
      }}
    </ModalConsumer>
  )
}

export default Modal
