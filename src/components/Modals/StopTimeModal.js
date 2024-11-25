import React, { useContext, useEffect } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import Modal from 'react-native-modal'
import styled from 'styled-components/native'
import { icons } from '../../assets/icons'
import { NotificationsContext } from '../../providers/NotificationsProvider'
import { defaultColors } from '../../theme/colors'
import { TimerContext } from '../../providers/TimerProvider'

export const StopTimeModal = ({ onRequestClose, ...otherProps }) => {
  const timerCtx = useContext(TimerContext)

  const { onNotification } = useContext(NotificationsContext)

  useEffect(() => {
    onNotification(`You've worked for 10 hours already`)
  }, [onNotification])

  const customBackdrop = () => {
    return (
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <Backdrop />
      </TouchableWithoutFeedback>
    )
  }

  const handleCloseModal = () => {
    timerCtx?.stopTimer()
    onRequestClose()
  }

  return (
    <Modal
      isVisible={true}
      onBackdropPress={onRequestClose}
      backdropColor="black"
      backdropOpacity={0.6}
      customBackdrop={customBackdrop}
      hasBackdrop={true}
      {...otherProps}
    >
      <Container>
        <CloseWrap onPress={handleCloseModal}>
          <Close source={icons.modal.close} />
        </CloseWrap>

        <Icon source={icons.modal.tired} />
        <TextWrap>
          <Heading>{`You've worked for 10 hours already`}</Heading>
        </TextWrap>

        <TextWrap>
          <Details>We advise you to rest and start work tomorrow</Details>
        </TextWrap>

        <Button onPress={handleCloseModal}>
          <ButtonHeading>Stop tracking time</ButtonHeading>
        </Button>
      </Container>
    </Modal>
  )
}

const Icon = styled.Image``

const Container = styled.View`
  flex-direction: column;
  margin-bottom: 100px;
  align-items: center;
  padding: 15px;
  border-radius: 5px;
  background-color: white;
`

const CloseWrap = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
`

const Close = styled.Image`
  margin-bottom: 10px;
`

const TextWrap = styled.View`
  width: 230px;
  flex-direction: row;
  justify-content: center;
`

const Heading = styled.Text`
  margin: 30px 0 10px;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: ${defaultColors.defaultBlack};
`

const Details = styled.Text`
  margin-bottom: 40px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: ${defaultColors.lightGrey};
`

const Button = styled.TouchableOpacity`
  padding: 18px 48px;
  border-radius: 50px;
  background: ${defaultColors.grey};
  margin-bottom: 40px;
`

const ButtonHeading = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: #ffffff;
`
const Backdrop = styled.View`
  background-color: black;
  opacity: 1;
  height: 1000%;
`
