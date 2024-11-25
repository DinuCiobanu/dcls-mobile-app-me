import React, { useContext, useEffect } from 'react'
import styled from 'styled-components/native'
import { icons } from '../../assets/icons'
import { NotificationsContext } from '../../providers/NotificationsProvider'
import { defaultColors } from '../../theme/colors'

const NoWifi = () => {
  const { onNotification } = useContext(NotificationsContext)

  useEffect(() => {
    onNotification('You have problems with network connection')
  }, [onNotification])

  return (
    <Container>
      <Logo source={icons.modal.wifi} />
      <Heading1>Problems with network connection</Heading1>
      <Heading2>Please check your connection and try again</Heading2>
    </Container>
  )
}

export default NoWifi

const Container = styled.View`
  height: 100%;
  background: ${defaultColors.white};
  justify-content: center;
  align-items: center;
`

const Heading1 = styled.Text`
  width: 230px;
  margin: 0 auto;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  margin: 38px 0 10px;
  color: ${defaultColors.defaultBlack};
`
const Heading2 = styled.Text`
  width: 230px;

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: ${defaultColors.grey};
`

const Logo = styled.Image``
