import React, { createContext, useState } from 'react'

interface IProps {
  component: React.ReactNode | null
  props: Record<string, unknown>
}
const initialState: IProps = {
  component: null,
  props: {},
}

export const ModalContext = createContext<any>({ initialState })

export const ModalProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const [state, dispatch] = useState({ ...initialState })
  const showModal = (component: React.ReactNode, props = {}) => {
    dispatch({
      ...state,
      component,
      props,
    })
  }

  const hideModal = () => {
    dispatch({
      component: null,
      props: {},
    })
  }

  return <ModalContext.Provider value={{ ...state, showModal, hideModal }}>{children}</ModalContext.Provider>
}

export const ModalConsumer = ModalContext.Consumer
