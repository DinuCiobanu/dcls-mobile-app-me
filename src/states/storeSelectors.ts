import { authSelectors } from './auth/selectors'
import { contractSelectors } from './contract/selectors'

export const storeSelector = {
  auth: authSelectors,
  contract: contractSelectors,
}
