import { getType } from 'typesafe-actions'
import { IContractResponse } from '../api/contract/type'
import { RootAction } from '../store'
import { contractActions } from './actions'

export interface ContractState extends IContractResponse {
  readonly stateStatus: {
    error: Record<string, unknown> | null
    loading: boolean
  }
}

export const initialContractState: ContractState = {
  interiorPhotoFields: [],
  exteriorPhotoFields: [],
  safetyPhotoFields: [],
  van: {
    slug: null,
    name: null,
    desc: null,
    type: 'select',
    rules: null,
    options: {},
  },
  inspectedBy: {
    slug: null,
    name: null,
    desc: null,
    type: 'select',
    rules: null,
    options: {},
  },
  driver: {
    slug: null,
    name: null,
    desc: null,
    type: 'select',
    rules: null,
    options: {},
  },
  gpsLocation: {
    slug: null,
    name: null,
    desc: null,
    type: 'location',
    rules: null,
  },
  status: {
    slug: null,
    name: null,
    desc: null,
    type: 'radio',
    rules: null,
    options: {
      checkIn: null,
      checkOut: null,
    },
  },
  vanCurrentMileage: {
    slug: null,
    name: null,
    desc: null,
    type: 'number',
    rules: null,
  },
  comments: {
    slug: null,
    name: null,
    desc: null,
    type: 'textarea',
    rules: null,
  },
  signature: {
    slug: null,
    name: null,
    desc: null,
    type: 'signature',
    rules: null,
  },
  damages: {
    slug: null,
    name: null,
    desc: null,
    type: 'repeater',
    rules: null,
    repeaterFields: [],
  },
  stateStatus: {
    error: null,
    loading: false,
  },
}

export const contractReducer = (state: ContractState = initialContractState, action: RootAction): ContractState => {
  switch (action.type) {
    case getType(contractActions.setContractData):
      return { ...state, ...action.payload }
    case getType(contractActions.setSyncFlag):
      return { ...state, stateStatus: { ...state.stateStatus, loading: action.payload } }
    case getType(contractActions.setErrors):
      return { ...state, stateStatus: { ...state.stateStatus, error: action.payload } }
    case getType(contractActions.clearErrors):
      return { ...state, stateStatus: { ...state.stateStatus, error: null } }
    default:
      return state
  }
}
