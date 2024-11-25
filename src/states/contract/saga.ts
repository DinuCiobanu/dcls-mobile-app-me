import { Alert } from 'react-native'
import { takeLatest, call, put } from 'typed-redux-saga'
import { ContractAPI } from '../api/contract'
import { contractActions } from './actions'

function* getContractFieldsSaga() {
  yield* put(contractActions.setSyncFlag(true))
  try {
    const resp = yield* call(ContractAPI.getContractFields)
    yield* put(contractActions.setContractData(resp))
  } catch (e: any) {
    if (e?.response?.status >= 400) {
      const { message } = e.response.data
      yield* put(contractActions.setErrors(message))

      // todo: move to global
      Alert.alert('Error', message)
    }
  } finally {
    yield* put(contractActions.setSyncFlag(false))
  }
}

function* saveContractSaga({ payload }: ReturnType<typeof contractActions.onSaveContract>) {
  yield* put(contractActions.setSyncFlag(true))
  try {
    yield* call(ContractAPI.addContract, payload)
    // yield* put(contractActions.setContractData(resp))
  } catch (e: any) {
    if (e?.response?.status >= 400) {
      const { message } = e.response.data
      yield* put(contractActions.setErrors(message))

      // todo: move to global
      Alert.alert('Error', message)
    }
  } finally {
    yield* put(contractActions.setSyncFlag(false))
  }
}

export function* contractRootSaga(): any {
  yield* takeLatest(contractActions.onGetContractFields, getContractFieldsSaga)
  yield* takeLatest(contractActions.onSaveContract, saveContractSaga)
}
