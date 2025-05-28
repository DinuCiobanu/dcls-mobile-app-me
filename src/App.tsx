import * as Sentry from '@sentry/react-native'
import React, { Fragment, useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import AppNavigation from './navigation/AppNavigation'

// import { LoginProvider } from './providers/LoginProvider'
import { AuditProvider } from './providers/AuditProvider'
import { ContractProvider } from './providers/ContractProvider'
import { NotificationsProvider } from './providers/NotificationsProvider'
import { ModalProvider } from './components/Modal/ModalProvider'
import { store } from './states/store'
// import ErrorBoundary from 'react-native-error-boundary'
Sentry.init({
  dsn: 'https://cc91f53e5d0f0f1a21a7ffa80628ad10@o4506031282782208.ingest.sentry.io/4506031285993472',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
})

const App = (): React.ReactElement => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <Fragment>
      {/* <ErrorBoundary> */}
      <Sentry.ErrorBoundary>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Provider store={store}>
            <ModalProvider>
              <SafeAreaProvider>
                <NotificationsProvider>
                  <AuditProvider>
                    <ContractProvider>
                      <AppNavigation />
                    </ContractProvider>
                  </AuditProvider>
                </NotificationsProvider>
              </SafeAreaProvider>
            </ModalProvider>
          </Provider>
        </GestureHandlerRootView>
      </Sentry.ErrorBoundary>
      {/* </ErrorBoundary> */}
    </Fragment>
  )
}

export default App
