import { ICurrentUser, ILoginResponse } from './type'

export const transformCurrentUserResponse = (json: any): ICurrentUser => {
  const userSite = json.site
  const audits = json.audits?.map((x: any) => ({ createdAt: x.created_at, id: x.id }))
  return {
    id: json.id,
    name: json.name,
    surname: json.surname,
    username: json.username,
    phoneNumber: json.phone_number,
    emailAddress: json.email_address,
    canCreateVanContract: json.can_create_van_contract,
    canCreateVanAudit: json.can_create_van_audit,
    site: {
      id: userSite.id,
      name: userSite.name,
      whatsappLink: userSite.whatsapp_link,
      arrivesToWork: userSite.arrives_to_work,
    },
    transporterId: json.transporter_id,
    assignedVan: {
      model: json.assigned_van?.model,
      registrationPlate: json.assigned_van?.registration_plate,
      vinNumber: json.assigned_van?.vin_number,
    },
    audits,
  }
}

export const transformLoginResponse = (json: any): ILoginResponse => {
  return {
    user: transformCurrentUserResponse(json.user),
    authtoken: json.authtoken,
  }
}
