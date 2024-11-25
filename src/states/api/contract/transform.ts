import { IContractResponse, IPhotoFields, IRepeaterFields } from './type'

const transformPhotoFields = (json: any): IPhotoFields => {
  return {
    desc: json.desc,
    name: json.name,
    slug: json.slug,
  }
}

const transformRepeaterFields = (json: any): IRepeaterFields => {
  return {
    desc: json.desc,
    name: json.name,
    rules: json.rules,
    slug: json.slug,
    type: json.type,
    options: json.options,
  }
}

export const transformContractFields = (json: any): IContractResponse => {
  const fields = json.fields
  const exteriorPhotoFields = fields?.interior_photo_fields?.map((x: any) => transformPhotoFields(x))
  const interiorPhotoFields = fields?.exterior_photo_fields?.map((x: any) => transformPhotoFields(x))
  const safetyPhotoFields = fields?.safety_photo_fields?.map((x: any) => transformPhotoFields(x))
  const otherFields = fields?.other_fields
  const repeaterFields = otherFields[8].repeater_fields.map((x: any) => transformRepeaterFields(x))
  return {
    exteriorPhotoFields,
    interiorPhotoFields,
    safetyPhotoFields,
    van: {
      slug: otherFields[0].slug,
      name: otherFields[0].name,
      desc: otherFields[0].desc,
      type: otherFields[0].location,
      rules: otherFields[0].rules,
      options: otherFields[0].options,
    },
    inspectedBy: {
      slug: otherFields[1].slug,
      name: otherFields[1].name,
      desc: otherFields[1].desc,
      type: otherFields[1].location,
      rules: otherFields[1].rules,
      options: otherFields[1].options,
    },
    driver: {
      slug: otherFields[2].slug,
      name: otherFields[2].name,
      desc: otherFields[2].desc,
      type: otherFields[2].location,
      rules: otherFields[2].rules,
      options: otherFields[2].options,
    },
    gpsLocation: {
      slug: otherFields[3].slug,
      name: otherFields[3].name,
      desc: otherFields[3].desc,
      type: otherFields[3].location,
      rules: otherFields[3].rules,
    },
    status: {
      slug: otherFields[4].slug,
      name: otherFields[4].name,
      desc: otherFields[4].desc,
      type: otherFields[4].location,
      rules: otherFields[4].rules,
      options: {
        checkIn: otherFields[4].options.check_in,
        checkOut: otherFields[4].options.check_out,
      },
    },
    vanCurrentMileage: {
      slug: otherFields[5].slug,
      name: otherFields[5].name,
      desc: otherFields[5].desc,
      type: otherFields[5].type,
      rules: otherFields[5].rules,
    },
    comments: {
      slug: otherFields[6].slug,
      name: otherFields[6].name,
      desc: otherFields[6].desc,
      type: otherFields[6].type,
      rules: otherFields[6].rules,
    },
    signature: {
      slug: otherFields[7].slug,
      name: otherFields[7].name,
      desc: otherFields[7].desc,
      type: otherFields[7].type,
      rules: otherFields[7].rules,
    },
    damages: {
      slug: otherFields[8].slug,
      name: otherFields[8].name,
      desc: otherFields[8].desc,
      type: otherFields[8].type,
      rules: otherFields[8].rules,
      repeaterFields,
    },
  }
}
