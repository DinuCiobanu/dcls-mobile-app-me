import { createAction } from 'typesafe-actions'
import { IAddContractParams, IContractResponse } from '../api/contract/type'

enum EContractType {
  GET_CONTRACT_FIELDS = '@contract/GET_CONTRACT_FIELDS',
  SAVE_CONTRACT = '@contract/SAVE_CONTRACT',
  SET_CONTRACT_DATA = '@contract/SET_CONTRACT_DATA',
  SET_ERROR = '@contract/SET_ERROR',
  CLEAR_ERROR = '@contract/CLEAR_ERROR',
  CLEAR_DATA = '@contract/CLEAR_DATA',
  SET_SYNC_FLAG = '@contract/SET_SYNC_FLAG',
}

const onGetContractFields = createAction(EContractType.GET_CONTRACT_FIELDS)()
const onSaveContract = createAction(EContractType.SAVE_CONTRACT)<IAddContractParams>()

const setContractData = createAction(EContractType.SET_CONTRACT_DATA)<IContractResponse>()
const setErrors = createAction(EContractType.SET_ERROR)<Record<string, unknown>>()
const clearErrors = createAction(EContractType.CLEAR_ERROR)()
const clearData = createAction(EContractType.CLEAR_DATA)()
const setSyncFlag = createAction(EContractType.SET_SYNC_FLAG)<boolean>()

export const contractActions = {
  onGetContractFields,
  onSaveContract,
  setErrors,
  clearErrors,
  clearData,
  setSyncFlag,
  setContractData,
}
