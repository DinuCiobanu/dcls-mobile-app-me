import { EColors, EButtonKeys } from './styles'

const primaryButtonTheme = {
  bg: EColors.BLACK,
  text: EColors.WHITE,
}

const disabledButtonTheme = {
  bg: EColors.GREY,
  text: EColors.GREY,
}

export const buttonThemes = {
  [EButtonKeys.PRIMARY]: primaryButtonTheme,
  [EButtonKeys.DISABLED]: disabledButtonTheme,
}
