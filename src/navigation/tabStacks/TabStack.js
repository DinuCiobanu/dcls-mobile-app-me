import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { TimerProvider } from '../../providers/TimerProvider'

import TabBar from './components/TabBar'
import HomeStack from './HomeStack'
import TimeTrackingStack from './TimeTrackingStack'
import VanAuditStack from './VanAuditStack'
import NotificationStack from './NotificationStack'
import InvoicesStack from './InvoicesStack'

const BottomTab = createBottomTabNavigator()

const TabStack = () => {
  return (
    <TimerProvider>
      <BottomTab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
        <BottomTab.Screen name={'homeStack'} options={{ title: 'home' }} component={HomeStack} />

        <BottomTab.Screen name={'timeTrackingStack'} options={{ title: 'home' }} component={TimeTrackingStack} />

        <BottomTab.Screen name={'vanAuditStack'} options={{ title: 'home' }} component={VanAuditStack} />

        <BottomTab.Screen name={'notificationsStack'} options={{ title: 'home' }} component={NotificationStack} />
        <BottomTab.Screen name={'invoicesStack'} options={{ title: 'home' }} component={InvoicesStack} />
      </BottomTab.Navigator>
    </TimerProvider>
  )
}

export default TabStack
