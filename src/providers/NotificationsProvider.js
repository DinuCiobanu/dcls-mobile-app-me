import AsyncStorage from '@react-native-community/async-storage'
import React, { createContext, useState, useCallback, useEffect } from 'react'

export const NotificationsContext = createContext()

const NOTIFICATIONS_KEY = 'notifications_key'

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(null)

  useEffect(() => {
    getNotifications()
  }, [getNotifications])

  const getNotifications = useCallback(async () => {
    let notific = await AsyncStorage.getItem(NOTIFICATIONS_KEY)
    notific = JSON.parse(notific) || []
    notific.sort((a, b) => {
      return a.read - b.read
    })

    setNotifications(notific)
  }, [])

  const markRead = useCallback(
    async (ind) => {
      const newNotifications = notifications
      newNotifications[ind] = { ...newNotifications[ind], read: true }

      setNotifications([...notifications])

      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(newNotifications))
    },
    [notifications],
  )

  const markAllAsRead = useCallback(async () => {
    const newNotifications = notifications
    newNotifications.forEach((notification) => {
      notification.read = true
    })

    setNotifications([...notifications])

    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(newNotifications))
  }, [notifications])

  const onNotification = useCallback(
    async (val) => {
      const newNotifications = notifications || []
      newNotifications.push({
        name: val,
        read: false,
        timestamp: Date.now(),
      })

      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(newNotifications))
    },
    [notifications],
  )

  return (
    <NotificationsContext.Provider value={{ onNotification, notifications, markRead, markAllAsRead }}>
      {children}
    </NotificationsContext.Provider>
  )
}
