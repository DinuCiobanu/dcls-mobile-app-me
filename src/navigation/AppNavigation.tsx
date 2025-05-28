import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useSelector } from 'react-redux'
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency'
import { AppState } from 'react-native'
import Login from '../screens/Login'

import SplashScreen from '../screens/SplashScreen'
import { storeSelector } from '../states/storeSelectors'
import SignContract from '../screens/SignNewVanContract/components/SignContract'
import NoWifi from '../screens/NoWifi/NoWifi'
import Camera from '../screens/Camera/Camera'
import TabStack from './tabStacks/TabStack'
import { NavService } from './NavService'

const Stack = createNativeStackNavigator()

const AppNavigation = (): React.ReactElement => {
  const isLoggedIn = useSelector(storeSelector.auth.selectIsLoggedIn)

  useEffect(() => {
    const listener = AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        const requestPermission = async () => {
          const trackingStatus = await getTrackingStatus()
          console.log('21-45 tracking status', { trackingStatus })
          if (trackingStatus === 'not-determined') {
            try {
              // requestTrackingPermission()
            } catch (e) {
              console.log("21-25", e)
            }
          }
        }
        requestPermission()
          .then((e) => {
            console.log('03-51 tracking ok', e)
          })
          .catch((e) => {
            console.log('03-22 tracking bad', e)
          })
        // try {
        //   requestPermission()
        // } catch (error) {}
      }
    })

    return () => {
      listener && listener.remove()
    }
  }, [])

  return (
    <NavigationContainer ref={NavService.navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={'splashScreen'}>
        <Stack.Screen name="splashScreen" component={SplashScreen} />
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="noWifi" component={NoWifi} />
        {/* @ts-ignore */}
        <Stack.Screen name={'signContractForm'} component={SignContract} />
        {isLoggedIn && <Stack.Screen name="tabStack" component={TabStack} />}
        <Stack.Screen name="camera" component={Camera} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation
