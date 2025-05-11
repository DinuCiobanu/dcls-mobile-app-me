import React, { useState, useCallback, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import styled from 'styled-components/native'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { ActivityIndicator, Keyboard, StatusBar, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { defaultColors } from '../../theme/colors'
import { icons } from '../../assets/icons'
import { useForm } from '../../hooks/useForm'
import { ILoginParam } from '../../states/api/auth/type'
import { storeActions } from '../../states/storeActions'
import { FormType, LOGIN_FORM } from '../../config/forms'
import { EFormTypes } from '../../config/statics'
import { storeSelector } from '../../states/storeSelectors'

const Login = (): React.ReactElement => {
  const dispatch = useDispatch()
  const isLoading = useSelector(storeSelector.auth.selectIsLoading)
  const errors = useSelector(storeSelector.auth.selectErrors)
  const isFocused = useIsFocused()
  const { onChange, onSubmit, resetValues, values } = useForm<ILoginParam>({})
  // initialValues: {
  //   username: 'testuser_sitemanager@gmail.com',
  //   password: 'TUSiteManagerTest',
  //   // username: 'alex@dcls.info',
  //   // password: 'Danube2025!',
  // },
  const [isPasswordVisible, setPasswordVisible] = useState(true)

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (errors) {
          dispatch(storeActions.auth.clearErrors())
          resetValues()
        }
      }
    }, []),
  )

  const setPasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev)
  }, [])

  const buttonIsDisabled = Object.keys(values).length !== LOGIN_FORM.length

  const handleOnChange = (name: keyof ILoginParam) => (text: string) => onChange(name, text)
  const handleOnFormSubmit = (data: ILoginParam) => dispatch(storeActions.auth.onLogin(data))

  const handleOnButtonPress = () => {
    Keyboard.dismiss()
    onSubmit(handleOnFormSubmit)
  }

  const renderForms = ({ name, textContentType, ...rest }: FormType<ILoginParam>) => {
    const secureTextEntry = textContentType === EFormTypes.PASSWORD && isPasswordVisible

    return (
      <PasswordWrap key={name}>
        <Input
          key={name}
          placeholder={`Please enter your ${name}`}
          value={values[name]}
          hasError={!!errors?.[name]}
          onChangeText={handleOnChange(name)}
          secureTextEntry={secureTextEntry}
          textContentType={textContentType}
          {...rest}
        />
        {textContentType === EFormTypes.PASSWORD && (
          <ShowPasswordIcoWrap onPress={setPasswordVisibility}>
            <ShowPasswordIco source={isPasswordVisible ? icons.login.hidePassword : icons.login.showPassword} />
          </ShowPasswordIcoWrap>
        )}
      </PasswordWrap>
    )
  }

  return (
    <LoginWrap>
      <Container>
        {isFocused && <StatusBar barStyle={'dark-content'} translucent backgroundColor="transparent" />}
        <HeaderHeading>Welcome Back</HeaderHeading>

        <FormArea>
          <FormTitle>Login</FormTitle>
          {/* {LOGIN_FORM.map(renderForms)} */}
          <LoginButton disabled={false} onPress={handleOnButtonPress}>
            {isLoading ? <ActivityIndicator /> : <LoginButtonHeading>Login</LoginButtonHeading>}
          </LoginButton>
        </FormArea>
      </Container>
    </LoginWrap>
  )
}

export default Login
const LoginWrap = styled.View`
  height: 100%;
  background: ${defaultColors.white};
`
const Container = styled(SafeAreaView)`
  padding: 0 30px;
`

const HeaderHeading = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 35px;
  color: ${defaultColors.defaultBlack};
  margin: 60px 0 90px;
`

const FormArea = styled.View``

const FormTitle = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  color: ${defaultColors.loginColor};
`

const Input = styled.TextInput.attrs({
  placeholderTextColor: defaultColors.grey,
})`
  width: 100%;
  border-bottom-color: ${({ hasError }: { hasError: boolean }) => (hasError ? 'red' : defaultColors.darkGrey)};
  border-bottom-width: 1px;
  padding: 0 0 20px;

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: ${defaultColors.defaultBlack};
  z-index: 1;
`

const ShowPasswordIcoWrap = styled.Pressable`
  margin-left: -16px;
  width: 18px;
  height: 16px;
  z-index: 10;
  position: relative;
`

const ShowPasswordIco = styled.Image`
  width: 18px;
  height: 16px;

  resize-mode: contain;
`

const PasswordWrap = styled.View`
  flex-direction: row;
  margin-top: 40px;
`

const LoginButton = styled(TouchableOpacity)`
  border-radius: 50px;
  width: 100%;
  background: ${defaultColors.grey};
  padding: 18px 0;
  margin-top: 40px;
  background: ${({ disabled }: { disabled: boolean }) => (disabled ? defaultColors.grey : defaultColors.black)};
`

const LoginButtonHeading = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: ${defaultColors.white};
`
