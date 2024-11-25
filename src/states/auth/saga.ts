import { Alert } from 'react-native'
import { takeLatest, call, put } from 'typed-redux-saga'
import * as Storage from '../../utils/storage'
import { EFormTypes } from '../../config/statics'
import { NavService } from '../../navigation/NavService'
import { AuthAPI } from '../api/auth'
import { authActions } from './actions'

function* loginSaga({ payload }: ReturnType<typeof authActions.onLogin>) {
  yield* put(authActions.setSyncFlag(true))
  try {
    const { authtoken, user } = yield* call(AuthAPI.login, payload)
    yield* call(Storage.setToken, authtoken)
    yield* put(authActions.setToken(authtoken))
    yield* put(authActions.setCurrentUser(user))
    NavService.navigate('tabStack')
  } catch (e: any) {
    if (e?.response?.status >= 400) {
      const { message } = e.response.data
      const error = {
        [EFormTypes.USERNAME]: message,
        [EFormTypes.PASSWORD]: message,
      }
      yield* put(authActions.setErrors(error))

      // todo: move to global
      Alert.alert('Error', message)
    }
  } finally {
    yield* put(authActions.setSyncFlag(false))
  }
}

function* getCurrentUserSaga() {
  yield* put(authActions.setSyncFlag(true))
  try {
    const user = yield* call(AuthAPI.getCurrentUser)
    yield* put(authActions.setCurrentUser(user))
  } catch (e: any) {
    if (e?.response?.status >= 400) {
      NavService.navigate('login')
      const { message } = e.response.data
      yield* put(authActions.setErrors(message))

      // todo: move to global
      Alert.alert('Error', message)
    }
  } finally {
    yield* put(authActions.setSyncFlag(false))
  }
}

export function* authRootSaga(): any {
  yield* takeLatest(authActions.onLogin, loginSaga)
  yield* takeLatest(authActions.onGetCurrentUser, getCurrentUserSaga)
}
