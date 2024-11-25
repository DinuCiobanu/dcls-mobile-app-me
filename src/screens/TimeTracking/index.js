import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import styled from 'styled-components/native'
import { NewTimer } from '../../components/Timer/NewTimer'
import { TimerContext } from '../../providers/TimerProvider'
import { defaultColors } from '../../theme/colors'

import ModalRoot from './../../components/Modal/Modal'

const TimeTracking = () => {
  const timerCtx = useContext(TimerContext)

  return (
    <Container edges={['bottom']}>
      <ModalRoot />

      <Header>
        <HeaderHeading>Time tracking</HeaderHeading>
      </Header>

      <Wrap>
        <TabHeading>Type of today’s work</TabHeading>
        <StandardHeading>Standard route</StandardHeading>
        <NewTimer />

        <Button onPress={timerCtx?.stopTimer}>
          <ButtonHeading>Submit hours</ButtonHeading>
        </Button>
      </Wrap>
    </Container>
  )
}

export default TimeTracking

const Container = styled(SafeAreaView)``

const Header = styled.View`
  width: 100%;
  background: ${defaultColors.defaultBlack};
  padding: 75px 0 40px;
`

const HeaderHeading = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 35px;
  color: ${defaultColors.white};
  margin: 0 30px;
`

const Wrap = styled.View`
  height: 100%;
  background: white;
  padding: 40px 30px 0;
`

const TabHeading = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  margin-bottom: 10px;
  color: ${defaultColors.defaultBlack};
`

const StandardHeading = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: ${defaultColors.defaultBlack};
  margin-bottom: 60px;
`

const Button = styled.TouchableOpacity`
  padding: 15px 0;
  margin-top: 15px;
  width: 100%;
  border-radius: 50px;
  justify-content: center;
  margin-bottom: 60px;
  background: ${defaultColors.grey};
`

const ButtonHeading = styled.Text`
  text-align: center;
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: ${defaultColors.white};
`
