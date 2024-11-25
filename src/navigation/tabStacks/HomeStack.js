import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../../screens/Home'
import AuditById from '../../screens/AuditById'

const Stack = createNativeStackNavigator()

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={'home'} component={Home} />
      <Stack.Screen name={'singleAudit'} component={AuditById} />
    </Stack.Navigator>
  )
}

export default HomeStack
