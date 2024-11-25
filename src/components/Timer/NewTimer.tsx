import React, { useContext, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
import { defaultColors } from '../../theme/colors'
import CircularProgress from '../CircularProgress/CircularProgress'
import { icons } from '../../assets/icons'
import { MAX_WORK_TIME } from '../../hooks/useTimer'
import { getParsedTimerString, getTimerString } from '../../utils/dates'
import { TimerContext } from '../../providers/TimerProvider'

interface TProps {
  isHomeScreen?: boolean
}

export const NewTimer = ({ isHomeScreen }: TProps) => {
  const [edit, setEdit] = useState(false)
  const [formattedData, setFormattedData] = useState<string>()
  const timerCtx = useContext(TimerContext)

  if (!timerCtx) {
    console.warn('cant work without timer context')
    return <></>
  }

  const { startTimer, stopTimer, time, timerOn, updateTimer } = timerCtx

  const editTime = async () => {
    await stopTimer()
    setFormattedData(getTimerString(time))
    setEdit(true)
  }
  const onBlur = () => {
    if (formattedData) {
      updateTimer(getParsedTimerString(formattedData))
    }

    setEdit(false)
  }

  const percents = (100 * time) / MAX_WORK_TIME

  return (
    <Container>
      <Wrap>
        {!edit ? (
          <TimerEl isHomeScreen={isHomeScreen}>{getTimerString(time)}</TimerEl>
        ) : (
          <HourInput value={formattedData} onChangeText={setFormattedData} maxLength={8} />
        )}
        <Button onPress={timerOn ? stopTimer : startTimer}>
          <CircularProgress
            size={50}
            progressPercent={percents}
            strokeWidth={3}
            icon={timerOn ? icons.timeTracking.pause : icons.timeTracking.resume}
            bgColor={defaultColors.darkGrey}
            pgColor={defaultColors.loginColor}
            pause={timerOn}
          />
        </Button>
        {timerCtx?.isLoading ? <ActivityIndicator /> : null}
      </Wrap>

      <ButtonsWrap>
        {!isHomeScreen && !edit && time !== 0 && (
          <Button onPress={editTime}>
            <EditTime>Edit time</EditTime>
          </Button>
        )}

        {!isHomeScreen && edit && (
          <Button onPress={onBlur}>
            <Submit>Submit</Submit>
          </Button>
        )}
      </ButtonsWrap>
    </Container>
  )
}

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
  font-size: ${({ isHomeScreen }: any) => (isHomeScreen ? '20px' : '40px')};
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
