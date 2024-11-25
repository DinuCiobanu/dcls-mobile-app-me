import React from 'react'

import AnimatedLoader from 'react-native-animated-loader'
import styled from 'styled-components/native'
import { defaultColors } from '../../theme/colors'

const Loading = () => {
  return (
    <Container>
      <AnimatedLoader
        visible={true}
        overlayColor={defaultColors.defaultBlack}
        source={require('./loader.json')}
        animationStyle={{ width: 200, height: 200 }}
        loop
        speed={0.2}
        animationType={'fade'}
      />
    </Container>
  )
}

const Container = styled.View``

export default Loading
