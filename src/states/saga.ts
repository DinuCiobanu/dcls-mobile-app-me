import { call, all } from 'typed-redux-saga'
import { authRootSaga } from './auth/saga'
import { contractRootSaga } from './contract/saga'

function* rootSaga(): any {
  yield* all([call(authRootSaga), call(contractRootSaga)])
}

export default rootSaga
