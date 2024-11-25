import { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AuditContext } from '../providers/AuditProvider'
import { NavService } from '../navigation/NavService'
import { isNetworkAvailable } from '../utils/NetworkUtils'
import * as Storage from '../utils/storage'
import { storeActions } from '../states/storeActions'

export const useBootstrap = (): void => {
  const dispatch = useDispatch()
  const { getAuditFields } = useContext(AuditContext)

  useEffect(() => {
    const bootstrap = async () => {
      let initialScreen = 'splashScreen'
      const isConnected = await isNetworkAvailable()

      console.log({ isConnected })

      if (!isConnected) {
        initialScreen = 'noWifi'
        NavService.reset(initialScreen)
        return
      }

      const token = await Storage.getToken()

      if (token) {
        initialScreen = 'tabStack'

        dispatch(storeActions.auth.setToken(token))
        dispatch(storeActions.auth.onGetCurrentUser())
        dispatch(storeActions.contract.onGetContractFields())
        await getAuditFields()
      } else {
        initialScreen = 'login'
      }

      NavService.reset(initialScreen)
    }
    bootstrap()
  }, [])
}
