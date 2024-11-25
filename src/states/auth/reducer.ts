import { getType } from 'typesafe-actions'
import { ICurrentUser } from '../api/auth/type'
import { RootAction } from '../store'
import { authActions } from './actions'

export interface AuthState {
  readonly isLoggedIn: boolean
  readonly token: string | null
  readonly currentUser: ICurrentUser | null
  readonly stateStatus: {
    error: Record<string, unknown> | null
    loading: boolean
  }
}

export const initialAuthState: AuthState = {
  isLoggedIn: false,
  token: null,
  currentUser: null,
  stateStatus: {
    error: null,
    loading: false,
  },
}

export const authReducer = (state: AuthState = initialAuthState, action: RootAction): AuthState => {
  switch (action.type) {
    case getType(authActions.setSyncFlag):
      return { ...state, stateStatus: { ...state.stateStatus, loading: action.payload } }
    case getType(authActions.setToken):
      return { ...state, token: action.payload, isLoggedIn: true }
    case getType(authActions.setCurrentUser):
      return { ...state, currentUser: action.payload }
    case getType(authActions.setErrors):
      return { ...state, stateStatus: { ...state.stateStatus, error: action.payload } }
    case getType(authActions.clearErrors):
      return { ...state, stateStatus: { ...state.stateStatus, error: null } }
    case getType(authActions.clearData):
      return initialAuthState
    default:
      return state
  }
}
