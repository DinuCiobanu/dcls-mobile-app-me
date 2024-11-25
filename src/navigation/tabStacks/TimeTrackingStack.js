import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TimeTracking from '../../screens/TimeTracking'

const Stack = createNativeStackNavigator()

const TimeTrackingStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={'timeTracking'} component={TimeTracking} />
    </Stack.Navigator>
  )
}

export default TimeTrackingStack
