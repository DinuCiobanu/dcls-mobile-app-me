import React, { PropsWithChildren, createContext } from 'react'
import { useTimer } from '../hooks/useTimer'

export const TimerContext = createContext<ReturnType<typeof useTimer> | null>(null)

export const TimerProvider = ({ children }: PropsWithChildren<{}>) => {
  const timer = useTimer()

  return <TimerContext.Provider value={timer}>{children}</TimerContext.Provider>
}
