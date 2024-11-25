import { useCallback, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import axios from 'axios'
import BackgroundTimer from 'react-native-background-timer'
import { api } from '../states/api/base'

import { getDiffByNow, getParsedTimerString, getTimerString } from '../utils/dates'

export const MAX_WORK_TIME = 36000

export const useTimer = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [timerOn, setTimerOn] = useState(false)

  useEffect(() => {
    syncTimerStatus()
    return () => {
      BackgroundTimer.stopBackgroundTimer()
    }
  }, [])

  useEffect(() => {
    if (timerOn) {
      BackgroundTimer.runBackgroundTimer(() => {
        setSeconds((secs) => {
          if (secs < MAX_WORK_TIME) return secs + 1
          else return MAX_WORK_TIME
        })
      }, 1000)
    } else {
      BackgroundTimer.stopBackgroundTimer()
    }
  }, [timerOn])

  const syncTimerStatus = useCallback(async () => {
    try {
      const { data } = await api.v1.get('timer-status')

      if (data?.data) {
        const { ongoing_work_session, submitted_duration } = data.data

        if (ongoing_work_session) {
          const duration = getDiffByNow(ongoing_work_session.start_time) + getParsedTimerString(submitted_duration)

          setSeconds(duration)
          setTimerOn(true)
        } else {
          setSeconds(getParsedTimerString(submitted_duration))
        }
      }
    } catch (e) {
      console.log(e)
    }
  }, [])

  const startTimer = useCallback(async () => {
    try {
      setIsLoading(true)

      const { data } = await api.v1.post('start-timer')

      if (data?.data?.work_session) {
        await syncTimerStatus()
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const message = (e.response?.data as { data: { message: string } })?.data?.message
        if (message) {
          Alert.alert('Error', message, [{ text: 'ok' }])
        }
      }
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const stopTimer = useCallback(async () => {
    try {
      setIsLoading(true)
      setTimerOn(false)
      await api.v1.post('stop-timer')
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const message = (e.response?.data as { data: { message: string } })?.data?.message
        if (message) {
          Alert.alert('Error', message, [{ text: 'ok' }])
        }
      }
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateTimer = useCallback(async (seconds: number) => {
    try {
      setIsLoading(true)
      await api.v1.post('set-worked-time', {
        worked_time: getTimerString(seconds),
      })

      await syncTimerStatus()
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const message = (e.response?.data as { data: { message: string } })?.data?.message
        if (message) {
          Alert.alert('Error', message, [{ text: 'ok' }])
        }
      }
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { startTimer, stopTimer, updateTimer, time: seconds, timerOn, isLoading }
}
