import React, { useContext, useEffect } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import Modal from 'react-native-modal'
import { useSelector } from 'react-redux'
import styled from 'styled-components/native'
import { icons } from '../../assets/icons'
import { NotificationsContext } from '../../providers/NotificationsProvider'
import { storeSelector } from '../../states/storeSelectors'
import { defaultColors } from '../../theme/colors'
import { TimerContext } from '../../providers/TimerProvider'

export const TimeModal = ({ onRequestClose, ...otherProps }) => {
  const currentUser = useSelector(storeSelector.auth.selectCurrentUser)
  const timerCtx = useContext(TimerContext)

  const { onNotification } = useContext(NotificationsContext)

  useEffect(() => {
    onNotification(
      `Your work day starts at ${currentUser?.site?.arrivesToWork} am, don’t forget to turn on time tracking `,
    )
  }, [onNotification])

  return (
    <Modal
      isVisible={true}
      coverScreen={true}
      onBackdropPress={onRequestClose}
      backdropColor="black"
      backdropOpacity={0.6}
      hasBackdrop={true}
      customBackdrop={
        <TouchableWithoutFeedback onPress={onRequestClose}>
          <Backdrop />
        </TouchableWithoutFeedback>
      }
      {...otherProps}
    >
      <Container>
        <CloseWrap onPress={onRequestClose}>
          <Close source={icons.modal.close} />
        </CloseWrap>

        <Icon source={icons.modal.start} />
        <TextWrap>
          <Heading>Hey there!</Heading>
        </TextWrap>

        <TextWrap>
          <Details>
            Your work day starts at {currentUser.site.arrivesToWork} am, don’t forget to turn on time tracking
          </Details>
        </TextWrap>

        <Button
          onPress={() => {
            timerCtx?.startTimer()
            onRequestClose()
          }}
        >
          <ButtonHeading>Start time tracking</ButtonHeading>
        </Button>
      </Container>
    </Modal>
  )
}

const Icon = styled.Image``

const Container = styled.View`
  flex-direction: column;
  z-index: 1;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 5px;
  height: 80%;
  background-color: white;
`

const CloseWrap = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  position: absolute;
  top: 20px;
  right: 20px;
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
  height: 100%;
`
