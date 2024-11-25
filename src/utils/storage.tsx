import AsyncStorage from '@react-native-community/async-storage'

export enum EStorage {
  TOKEN = '@token/setToken',
}

export async function setToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(EStorage.TOKEN, token)
  } catch (error) {
    console.log('AsyncStorage error during set token:', error)
  }
}

export async function getToken(): Promise<string | undefined | null> {
  try {
    return await AsyncStorage.getItem(EStorage.TOKEN)
  } catch (error) {
    console.log('AsyncStorage error during get token:', error)
  }
}

export async function clearToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(EStorage.TOKEN)
  } catch (error) {
    console.log('AsyncStorage error during remove token:', error)
  }
}
