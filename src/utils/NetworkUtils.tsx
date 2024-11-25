import NetInfo from '@react-native-community/netinfo'

export const isNetworkAvailable = async (): Promise<boolean | null> => {
  const response = await NetInfo.fetch()
  console.log({ isNetworkAvailable: response.isConnected })
  return response.isConnected
}
