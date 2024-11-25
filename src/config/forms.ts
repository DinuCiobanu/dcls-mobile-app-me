import { TextInputProps } from 'react-native'
import { icons } from '../assets/icons'
import { ILoginParam } from '../states/api/auth/type'
import { EForms, EFormTypes, EKeyboardTypes } from './statics'

type FormIconTypes = {
  inactive: number
  active: number
}

export interface IForms extends TextInputProps {
  icons?: FormIconTypes
}

export type FormType<Values> = IForms & { name: keyof Values }

export const LOGIN_FORM: FormType<ILoginParam>[] = [
  {
    name: EForms.USERNAME,
    textContentType: EFormTypes.EMAIL,
    keyboardType: EKeyboardTypes.EMAIL,
    autoCapitalize: EFormTypes.NONE,
  },
  {
    name: EForms.PASSWORD,
    icons: icons.login.hidePassword,
    textContentType: EFormTypes.PASSWORD,
    autoCapitalize: EFormTypes.NONE,
  },
]
