import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Notification from '../../screens/Notifications'

const Stack = createNativeStackNavigator()

const NotificationStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={'notifications'} component={Notification} />
    </Stack.Navigator>
  )
}

export default NotificationStack
