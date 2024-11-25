import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Invoices from '../../screens/Invoices'

const Stack = createNativeStackNavigator()

const InvoicesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={'invoices'} component={Invoices} />
    </Stack.Navigator>
  )
}

export default InvoicesStack
