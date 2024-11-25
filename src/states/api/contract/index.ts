import { api } from '../base'
import { Endpoints } from '../../../config/endpoints'
import { IAddContractParams, IContractResponse } from './type'
import { transformContractFields } from './transform'

export const ContractAPI = {
  async getContractFields(): Promise<IContractResponse> {
    const resp = await api.v1.get(Endpoints.GET_CONTRACT_FIELDS)
    return transformContractFields(resp.data.data)
  },
  // todo
  async addContract(params: IAddContractParams): Promise<any> {
    const resp = await api.v1.post(Endpoints.ADD_CONTRACT, params)
    console.log({ resp })
  },
}
