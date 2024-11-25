import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import VanAudit from '../../screens/VanAudit'
import CreateNewVan from '../../screens/CreateNewVan'
import SignNewVanContract from '../../screens/SignNewVanContract'
import AuditById from '../../screens/AuditById'

const Stack = createNativeStackNavigator()

const VanAuditStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={'vanAudit'} component={VanAudit} />
      <Stack.Screen name={'createVanAudit'} component={CreateNewVan} />
      <Stack.Screen name={'signContract'} component={SignNewVanContract} />
      <Stack.Screen name={'singleAudit'} component={AuditById} />
    </Stack.Navigator>
  )
}

export default VanAuditStack
