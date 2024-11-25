import React from 'react'
import styled from 'styled-components/native'

export const TabIcon = ({ icon }) => {
  return (
    <CartWrapper>
      <Cart source={icon} />
    </CartWrapper>
  )
}

const CartWrapper = styled.View`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  margin: 0;
`

const Cart = styled.Image``
