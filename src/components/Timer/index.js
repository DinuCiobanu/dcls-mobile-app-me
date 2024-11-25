import React, { useContext, useState } from 'react'
import BackgroundTimer from 'react-native-background-timer'

import AsyncStorage from '@react-native-community/async-storage'

import styled from 'styled-components/native'
import { defaultColors } from '../../theme/colors'
import CircularProgress from '../CircularProgress/CircularProgress'
import { icons } from '../../assets/icons'
import { HourLogContext } from '../../providers/HourLogProvider'

/**
 * @deprecated The component should not be used
 */
const Timer = ({ isHomeScreen }) => {
  const { percentOf, secondsLeft, setSecondsFunc, setTimerFunc, timerOn, updateTimer } = useContext(HourLogContext)
  const [edit, setEdit] = useState(false)
  const [formattedData, setFormattedData] = useState(0)

  const STARTED_TIMER_KEY = 'startedTimer'
  const START_TIMER_KEY = 'startTimer'
  const ITINTIAL_STAMP_KEY = 'initialStamp'
  const PAUSE_TIMER_KEY = 'pauseTimer'
  const PAUSED_COUNT_KEY = 'pauseCount'

  const clearAsync = async () => {
    AsyncStorage.multiRemove([
      STARTED_TIMER_KEY,
      START_TIMER_KEY,
      ITINTIAL_STAMP_KEY,
      PAUSE_TIMER_KEY,
      PAUSED_COUNT_KEY,
    ])
    BackgroundTimer.stopBackgroundTimer()
    setSecondsFunc(0)
    setTimerFunc(false)
  }

  const editTime = () => {
    setTimerFunc(false)

    setFormattedData(`${clockify().displayHours}:${clockify().displayMins}:${clockify().displaySecs}`)
    setEdit(true)
  }

  const editedTimeChange = (val) => {
    setFormattedData(val)
  }

  const onBlur = () => {
    const value = formattedData
    const seconds = Math.max(0, getSecondsFromHHMMSS(value))

    updateTimer(seconds)

    const time = toHHMMSS(seconds)
    setFormattedData(time)
    setEdit(false)
  }

  const getSecondsFromHHMMSS = (value) => {
    const [str1, str2, str3] = value.split(':')

    const val1 = Number(str1)
    const val2 = Number(str2)
    const val3 = Number(str3)

    if (!isNaN(val1) && isNaN(val2) && isNaN(val3)) {
      return val1
    }

    if (!isNaN(val1) && !isNaN(val2) && isNaN(val3)) {
      return val1 * 60 + val2
    }

    if (!isNaN(val1) && !isNaN(val2) && !isNaN(val3)) {
      return val1 * 60 * 60 + val2 * 60 + val3
    }

    return 0
  }

  const toHHMMSS = (secs) => {
    const secNum = parseInt(secs.toString(), 10)
    const hours = Math.floor(secNum / 3600)
    const minutes = Math.floor(secNum / 60) % 60
    const seconds = secNum % 60

    return [hours, minutes, seconds].map((val) => (val < 10 ? `0${val}` : val)).join(':')
  }

  const clockify = () => {
    const hours = Math.floor(secondsLeft / 60 / 60)
    const mins = Math.floor((secondsLeft / 60) % 60)
    const seconds = Math.floor(secondsLeft % 60)
    const displayHours = hours < 10 ? `0${hours}` : hours
    const displayMins = mins < 10 ? `0${mins}` : mins
    const displaySecs = seconds < 10 ? `0${seconds}` : seconds
    return {
      displayHours,
      displayMins,
      displaySecs,
    }
  }

  return (
    <Container>
      {!edit && (
        <Wrap>
          <TimerEl isHomeScreen={isHomeScreen}>
            {clockify().displayHours}:{clockify().displayMins}:{clockify().displaySecs}
          </TimerEl>

          <Button onPress={() => setTimerFunc((timerOn) => !timerOn)}>
            <CircularProgress
              size={50}
              progressPercent={percentOf}
              strokeWidth={3}
              icon={timerOn ? icons.timeTracking.pause : icons.timeTracking.resume}
              bgColor={defaultColors.darkGrey}
              pgColor={defaultColors.loginColor}
              pause={timerOn}
              wq
              textSize={24}
            />
          </Button>
        </Wrap>
      )}

      {edit && (
        <Wrap>
          <HourInput value={formattedData} onChangeText={editedTimeChange} maxLength={8} />
          <Button onPress={() => setTimerFunc((timerOn) => !timerOn)}>
            <CircularProgress
              size={50}
              progressPercent={percentOf}
              strokeWidth={3}
              icon={timerOn ? icons.timeTracking.pause : icons.timeTracking.resume}
              bgColor={defaultColors.darkGrey}
              pgColor={defaultColors.loginColor}
              pause={timerOn}
              textSize={24}
            />
          </Button>
        </Wrap>
      )}

      <ButtonsWrap>
        {!isHomeScreen && !edit && secondsLeft !== 0 && (
          <Button onPress={editTime}>
            <EditTime>Edit time</EditTime>
          </Button>
        )}

        {!isHomeScreen && edit && (
          <Button onPress={onBlur}>
            <Submit>Submit</Submit>
          </Button>
        )}

        {!isHomeScreen && (
          <Button onPress={clearAsync}>
            <EditTime>Clear timer</EditTime>
          </Button>
        )}
      </ButtonsWrap>
    </Container>
  )
}

export default Timer

const ButtonsWrap = styled.View`
  flex-direction: row;
`
const Container = styled.View``

const Wrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: -10px;
`

const Button = styled.TouchableOpacity`
  margin-right: 15px;
`

const HourInput = styled.TextInput`
  font-size: 40px;
  border: 2px solid ${defaultColors.grey};
  padding: 2px;
`

const TimerEl = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: ${({ isHomeScreen }) => (isHomeScreen ? '20px' : '40px')};
  margin-right: 10px;
  color: ${defaultColors.defaultBlack};
`

const EditTime = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  color: ${defaultColors.grey};
`

const Submit = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  color: ${defaultColors.defaultBlack};
`
