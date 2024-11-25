export interface ILoginParam {
  username: string
  password: string
}

export interface ICurrentUser {
  id: number
  name: string
  surname: string
  username: string
  phoneNumber: null | string
  emailAddress: string
  canCreateVanContract: boolean
  canCreateVanAudit: boolean
  site: {
    id: number
    name: string
    whatsappLink: null | string
    arrivesToWork: string
  }
  transporterId: string
  assignedVan: null | {
    model: string | null
    registrationPlate: string | null
    vinNumber: string | null
  }
  audits: null | Array<{
    id: string | null
    createdAt: string | null
  }>
}

export interface ILoginResponse {
  user: ICurrentUser
  authtoken: string
}
