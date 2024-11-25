import { api } from '../base'
import { Endpoints } from '../../../config/endpoints'
import { transformCurrentUserResponse, transformLoginResponse } from './transform'
import { ILoginResponse, ILoginParam, ICurrentUser } from './type'

export const AuthAPI = {
  async login(params: ILoginParam): Promise<ILoginResponse> {
    const resp = await api.v1.post(Endpoints.LOGIN, params)
    return transformLoginResponse(resp.data.data)
  },
  async getCurrentUser(): Promise<ICurrentUser> {
    const resp = await api.v1.get(Endpoints.GET_CURRENT_USER)
    return transformCurrentUserResponse(resp.data.data.user)
  },
}
