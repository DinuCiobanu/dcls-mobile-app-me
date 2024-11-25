import createSagaMiddleware from 'redux-saga'
import { applyMiddleware, combineReducers, createStore, Dispatch, Store } from 'redux'
import { ActionType } from 'typesafe-actions'

import rootSaga from './saga'

import { authActions } from './auth/actions'
import { authReducer, AuthState } from './auth/reducer'
import { contractActions } from './contract/actions'
import { contractReducer, ContractState } from './contract/reducer'

export type AuthActions = ActionType<typeof authActions>
export type ContractActions = ActionType<typeof contractActions>
export type RootAction = AuthActions | ContractActions

export type RootState = {
  auth: AuthState
  contract: ContractState
}

export type ReduxStore = Store<RootState, AuthActions> & { dispatch: Dispatch }

const rootReducer = combineReducers({
  auth: authReducer,
  contract: contractReducer,
})

const configStore = (): Store<RootState, RootAction> => {
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = [sagaMiddleware]

  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const createDebugger = require('redux-flipper').default
    middlewares.push(createDebugger())
  }

  const initialStore: Store<RootState, RootAction> = createStore(rootReducer, applyMiddleware(...middlewares))

  sagaMiddleware.run(rootSaga)

  return initialStore
}

export const store = configStore()
