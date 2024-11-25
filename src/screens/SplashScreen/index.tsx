import React from 'react'

import styled from 'styled-components/native'
import { icons } from '../../assets/icons'
import { useBootstrap } from '../../hooks/useBootstrap'
import { defaultColors } from '../../theme/colors'

const SplashScreen = (): React.ReactElement => {
  useBootstrap()

  return (
    <Container>
      <Logo source={icons.splash.logo} />
    </Container>
  )
}

export default SplashScreen

const Container = styled.View`
  height: 100%;
  background: ${defaultColors.defaultBlack};
  justify-content: center;
  align-items: center;
`

const Logo = styled.Image``
