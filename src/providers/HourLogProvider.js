import React, { createContext, useState, useCallback, useEffect, useContext } from 'react'
import BackgroundTimer from 'react-native-background-timer'
import AsyncStorage from '@react-native-community/async-storage'
import { Alert } from 'react-native'
import { useSelector } from 'react-redux'
import { StopTimeModal } from '../components/Modals/StopTimeModal'
import { ModalContext } from '../components/Modal/ModalProvider'
import { storeSelector } from '../states/storeSelectors'
import { api } from '../states/api/base'

/**
 * @deprecated The method should not be used
 */
export const HourLogContext = createContext()

const STARTED_TIMER_KEY = 'startedTimer'
const START_TIMER_KEY = 'startTimer'
const ITINTIAL_STAMP_KEY = 'initialStamp'
const PAUSE_TIMER_KEY = 'pauseTimer'
const PAUSED_COUNT_KEY = 'pauseCount'

/**
 * @deprecated The method should not be used
 */
export const HourLogProvider = ({ children }) => {
  const refresh = useSelector(storeSelector.auth.selectToken)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [timerOn, setTimerOn] = useState(false)
  const [percentOf, setPercentOf] = useState(false)
  const { showModal } = useContext(ModalContext)

  const setSecondsFunc = useCallback((val) => {
    setSecondsLeft(val)
  }, [])

  const setTimerFunc = useCallback(async (val) => {
    setTimerOn(val)
    if (val) {
      await AsyncStorage.setItem(STARTED_TIMER_KEY, 'true')
    }
  }, [])

  const setPercentFunc = useCallback((val) => {
    setPercentOf(val)
  }, [])

  const checkAsync = async () => {
    const started = await AsyncStorage.getItem(STARTED_TIMER_KEY)

    if (!started) return

    const asyncStartTime = await AsyncStorage.getItem(START_TIMER_KEY)
    const asyncPauseTime = await AsyncStorage.getItem(PAUSE_TIMER_KEY)
    let asyncPausedSecondsCount = (await AsyncStorage.getItem(PAUSED_COUNT_KEY)) || 0

    const currentSeconds = (new Date() / 1000).toString()
    if (timerOn && asyncPauseTime != null) {
      const difference = new Date() / 1000 - asyncPauseTime
      asyncPausedSecondsCount = parseFloat(asyncPausedSecondsCount) + difference
      await AsyncStorage.removeItem(PAUSE_TIMER_KEY)

      await AsyncStorage.setItem(PAUSED_COUNT_KEY, asyncPausedSecondsCount.toString())
    }

    if (!asyncStartTime) {
      await AsyncStorage.setItem(START_TIMER_KEY, currentSeconds)
      await AsyncStorage.setItem(ITINTIAL_STAMP_KEY, currentSeconds)
    } else {
      const currentTime = new Date()
      if (secondsLeft >= 36000 && timerOn) {
        showModal(StopTimeModal)
      }
      setSecondsFunc(secondsLeft >= 36000 ? 36000 : currentTime / 1000 - asyncStartTime - asyncPausedSecondsCount)
    }
  }

  const updateTimer = async (val) => {
    const asyncStartTime = await AsyncStorage.getItem(START_TIMER_KEY)

    AsyncStorage.setItem(START_TIMER_KEY, (parseFloat(asyncStartTime) - val + secondsLeft).toString())

    setSecondsFunc(val > 36000 ? 36000 : val)
  }

  const pauseTimer = async () => {
    await AsyncStorage.setItem(PAUSE_TIMER_KEY, (new Date() / 1000).toString())
  }

  const startTimer = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      setSecondsFunc((secs) => {
        if (secs < 36000) return secs + 1
        else return 36000
      })
    }, 1000)
  }

  useEffect(() => {
    checkAsync()
    if (timerOn) startTimer()
    else {
      if (secondsLeft) {
        pauseTimer()
      }
      BackgroundTimer.stopBackgroundTimer()
    }
    return () => {
      BackgroundTimer.stopBackgroundTimer()
    }
  }, [timerOn])

  const checkStart = async () => {
    const asyncStartTime = await AsyncStorage.getItem(START_TIMER_KEY)
    const asyncPauseTime = await AsyncStorage.getItem(PAUSE_TIMER_KEY)
    let asyncPausedSecondsCount = (await AsyncStorage.getItem(PAUSED_COUNT_KEY)) || 0

    const started = await AsyncStorage.getItem(STARTED_TIMER_KEY)
    console.log('started')
    if (!started) return

    if (asyncPauseTime == null && asyncStartTime != null && started) {
      setTimerFunc(true)
    } else setTimerFunc(false)

    if (!timerOn && asyncPauseTime != null) {
      const difference = new Date() / 1000 - asyncPauseTime
      asyncPausedSecondsCount = parseFloat(asyncPausedSecondsCount) + difference

      const currentTime = new Date()

      setSecondsFunc(
        currentTime / 1000 - asyncStartTime - asyncPausedSecondsCount >= 36000
          ? 36000
          : currentTime / 1000 - asyncStartTime - asyncPausedSecondsCount,
      )
    }
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

  useEffect(() => {
    checkStart()
  }, [])

  useEffect(() => {
    if (secondsLeft === 36000) BackgroundTimer.stopBackgroundTimer()

    setPercentFunc((100 * secondsLeft) / 36000)
  }, [secondsLeft, setPercentFunc])

  const savedWorkedTime = useCallback(async () => {
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
    await api.v1
      .post('set-worked-time', {
        worked_time: `${clockify().displayHours}:${clockify().displayMins}:${clockify().displaySecs}`,
      })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        Alert.alert('Error ' + err.response.status, err?.response?.data?.data?.message)
        console.log(err.response)
      })
  }, [refresh, secondsLeft])

  return (
    <HourLogContext.Provider
      value={{
        secondsLeft,
        timerOn,
        percentOf,
        setSecondsFunc,
        setTimerFunc,
        setPercentFunc,
        updateTimer,
        savedWorkedTime,
      }}
    >
      {children}
    </HourLogContext.Provider>
  )
}
