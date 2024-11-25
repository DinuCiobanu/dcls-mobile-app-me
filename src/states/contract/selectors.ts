import { IContractResponse } from '../api/contract/type'
import { RootState } from '../store'

const selectContractData = (state: RootState): IContractResponse => state.contract

const selectIsLoading = (state: RootState): boolean => state.contract.stateStatus.loading

const selectErrors = (state: RootState): Record<string, unknown> | null => state.contract.stateStatus.error

export const contractSelectors = {
  selectErrors,
  selectIsLoading,
  selectContractData,
}
