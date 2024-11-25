import React, { createContext, useState, useCallback } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { api } from '../states/api/base'

export const LoginContext = createContext()
export const REFRESH_TOKEN = 'refreshToken'

export const LoginProvider = ({ children }) => {
  const [loginData, setLoginData] = useState({})
  const [refresh, setRefresh] = useState(null)

  const updateToken = useCallback(async (token) => {
    await AsyncStorage.setItem(REFRESH_TOKEN, token.toString())
    setRefresh(token.toString())
  }, [])

  const getUserById = async () => {
    await api.v1
      .get('get-user-data')
      .then((response) => {
        setLoginData(response.data.data.user)
      })
      .catch((err) => {
        console.log(err, 'err')
      })
  }

  const proceedLogin = async (data) => {
    let error = false
    await api.v1
      .post('login', { username: data.email, password: data.pass })
      .then((response) => {
        error = false
        setLoginData(response.data.data.user)
        updateToken(response.data.data.authtoken)
      })
      .catch((err) => {
        error = true
        console.log(err.toJSON())
        console.log({ json: JSON.stringify(err) })
        console.log(err)
      })
    console.log(error)
    return error
  }

  return (
    <LoginContext.Provider value={{ loginData, proceedLogin, updateToken, refresh, getUserById }}>
      {children}
    </LoginContext.Provider>
  )
}
