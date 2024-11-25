export interface IPhotoFields {
  name: string
  slug: string
  desc: string | null
}

export interface IRepeaterFields {
  name: string
  slug: string
  desc: null | string
  type: 'select' | 'image' | 'textarea'
  options?: Record<string, string>
  rules: string
}

export interface IContractResponse {
  interiorPhotoFields: IPhotoFields[]
  exteriorPhotoFields: IPhotoFields[]
  safetyPhotoFields: IPhotoFields[]
  van: {
    slug: string | null
    name: string | null
    desc: string | null
    type: 'select'
    rules: string | null
    options: Record<string, string>
  }
  inspectedBy: {
    slug: string | null
    name: string | null
    desc: string | null
    type: 'select'
    rules: string | null
    options: Record<string, string>
  }
  driver: {
    slug: string | null
    name: string | null
    desc: string | null
    type: 'select'
    rules: string | null
    options: Record<string, string>
  }
  gpsLocation: {
    slug: string | null
    name: string | null
    desc: string | null
    type: 'location'
    rules: string | null
  }
  status: {
    slug: string | null
    name: string | null
    desc: string | null
    type: 'radio'
    rules: string | null
    options: {
      checkIn: string | null
      checkOut: string | null
    }
  }
  vanCurrentMileage: {
    slug: string | null
    name: string | null
    desc: string | null
    type: 'number'
    rules: string | null
  }
  comments: {
    slug: string | null
    name: string | null
    desc: string | null
    type: 'textarea'
    rules: string | null
  }
  signature: {
    slug: string | null
    name: string | null
    desc: string | null
    type: 'signature'
    rules: string | null
  }
  damages: {
    slug: string | null
    name: string | null
    desc: string | null
    type: 'repeater'
    rules: string | null
    repeaterFields: IRepeaterFields[]
  }
}

export interface IAddContractParams {
  gps_location: string
  inspected_by_id: string
  status: string
  driver_id: string
  van_current_mileage: number
  van_id: string
  fuel_level_photo: number
  dashboard_photo: number
  seats_photo: number
  front_side_picture: number
  left_side_picture: number
  rear_side_picture: number
  right_side_picture: number
  front_door_driver_side: number
  front_wing_driver_side: number
  windscreen: number
  bonnet: number
  driver_side_mirror: number
  front_bumper_driver_side: number
  front_umper_central: number
  front_bumper_passenger_side: number
  headlight_passenger_side: number
  front_wing_passenger_side: number
  headlight_driver_side: number
  front_door_passenger_side: number
  passenger_side_mirror: number
  sliding_door_passenger_side: number
  front_passenger_side_sill: number
  rear_passenger_side_sill: number
  rear_wing_passenger_side: number
  taillight_passenger_side: number
  rear_loading_door_passenger_side: number
  rear_loading_door_driver_side: number
  loading_compartiment: number
  rear_bumper_driver_side: number
  rear_bumper_central: number
  rear_bumper_passenger_side: number
  taillight_driver_side: number
  rear_wing_driver_side: number
  sliding_door_driver_side: number
  front_driver_side_sill: number
  rear_driver_side_sill: number
  front_drive_side: number
  rear_driver_side: number
  rear_passenger_side: number
  front_driver_side: number
  dashcam_photo: number
  tool_kit_photo: number
  spare_wheel_photo: number
  vin_number: number
  signature: number
}
