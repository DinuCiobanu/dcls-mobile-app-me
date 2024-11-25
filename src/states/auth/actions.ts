import { createAction } from 'typesafe-actions'
import { ICurrentUser, ILoginParam } from '../api/auth/type'

enum EAuthTypes {
  LOGIN = '@auth/LOGIN',
  GET_CURRENT_USER = '@auth/GET_CURRENT_USER',
  SET_TOKEN = '@auth/SET_TOKEN',
  SET_CURRENT_USER = '@auth/SET_CURRENT_USER',
  SET_ERROR = '@auth/SET_ERROR',
  CLEAR_ERROR = '@auth/CLEAR_ERROR',
  CLEAR_DATA = '@auth/CLEAR_DATA',
  SET_SYNC_FLAG = '@auth/SET_SYNC_FLAG',
}

const onLogin = createAction(EAuthTypes.LOGIN)<ILoginParam>()
const onGetCurrentUser = createAction(EAuthTypes.GET_CURRENT_USER)()

const setToken = createAction(EAuthTypes.SET_TOKEN)<string | null>()
const setCurrentUser = createAction(EAuthTypes.SET_CURRENT_USER)<ICurrentUser | null>()
const setErrors = createAction(EAuthTypes.SET_ERROR)<Record<string, unknown>>()
const clearErrors = createAction(EAuthTypes.CLEAR_ERROR)()
const clearData = createAction(EAuthTypes.CLEAR_DATA)()
const setSyncFlag = createAction(EAuthTypes.SET_SYNC_FLAG)<boolean>()

export const authActions = {
  onLogin,
  onGetCurrentUser,
  setToken,
  setCurrentUser,
  setErrors,
  clearErrors,
  clearData,
  setSyncFlag,
}
