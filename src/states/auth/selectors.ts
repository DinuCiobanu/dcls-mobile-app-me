import { ICurrentUser } from '../api/auth/type'
import { RootState } from '../store'

const selectIsLoading = (state: RootState): boolean => state.auth.stateStatus.loading

const selectToken = (state: RootState): string | null => state.auth.token

const selectCurrentUser = (state: RootState): ICurrentUser | null => state.auth.currentUser

const selectIsLoggedIn = (state: RootState): boolean => state.auth.isLoggedIn

const selectErrors = (state: RootState): Record<string, unknown> | null => state.auth.stateStatus.error

export const authSelectors = {
  selectIsLoading,
  selectToken,
  selectCurrentUser,
  selectIsLoggedIn,
  selectErrors,
}
