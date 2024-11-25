import React, { createContext, useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { useSelector } from 'react-redux'
import { storeSelector } from '../states/storeSelectors'
import { api } from '../states/api/base'

// interface IInteriorPhotoField {
//   name: string
//   slug: string
//   desc: string | null
// }
// interface IExteriorPhotoField {
//   name: string
//   slug: string
//   desc: string | null
// }
// interface ISafetyPhotoField {
//   name: string
//   slug: string
//   desc: string | null
// }
// interface IOtherField {
//   slug: string
//   name: string
//   desc: string
//   type: string
//   options: string[]
//   rules: string
// }

// interface IContract {
//   interiorPhotoField: IInteriorPhotoField[]
//   exteriorPhotoField: IExteriorPhotoField[]
//   safetyPhotoField: ISafetyPhotoField[]
//   otherField: IOtherField[]
// }

// const initialContract: IContract = {
//   interiorPhotoField: [],
//   exteriorPhotoField: [],
//   safetyPhotoField: [],
//   otherField: [],
// }

export const ContractContext = createContext<any>(null)

export const ContractProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const refresh = useSelector(storeSelector.auth.selectToken)

  const [contractData, setContractData] = useState(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [photosArr, setPhotosArr] = useState({})
  const [damagePhotoArr, setDamagePhotosArr] = useState({})
  const [otherInfo, setOtherInfo] = useState<Record<string, unknown>>({})
  const [isSubmitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string[] | null>(null)

  const setDamagePhotosList = useCallback((val: any) => {
    setDamagePhotosArr({ ...val })
  }, [])

  const setPhotosList = useCallback((val: any) => {
    setPhotosArr({ ...val })
  }, [])

  const setSignatureImage = useCallback((sign: any) => {
    setSignature(sign)
  }, [])

  const setOtherFields = useCallback(
    (slug: any, data: any) => {
      setOtherInfo({
        ...otherInfo,
        [slug]: data,
      })
    },

    [otherInfo],
  )

  const removeOtherInfo = useCallback(() => {
    setOtherInfo({})
  }, [])

  const getContractFields = useCallback(async () => {
    await api.v1
      .get('get-contract-fields')
      .then((response) => {
        console.log({ getContractFieldsResponse: response.data.data })
        setContractData(response.data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const addContract = useCallback(
    async (res: any) => {
      console.log({ addContractParam: { ...res } })
      let error
      setSubmitting(true)
      await api.v2
        .post('save-contract', { ...res })
        .then((resp) => {
          if (__DEV__) {
            console.log({ resp: JSON.stringify(resp, null, 2) })
          }

          if (resp.data.type === 'success') {
            Alert.alert('Successfully', resp.data.data.message)
            error = false
          } else if (resp.data.type === 'error') {
            Alert.alert('Successfully', resp.data.data.message)
            error = true
          }
          error = false
        })
        .catch((err) => {
          if (__DEV__) {
            console.log({ resp: JSON.stringify(err, null, 2) })
            console.log({ 'err.response': err.response })
          }
          if (err.response.data.type === 'error') {
            Alert.alert('Error', err.response.data.data.message)
          } else if (err.response.data.type === 'validation_fail' && err.response.data.data.errors) {
            const key = Object.keys(err.response.data.data.errors)
            const firstError: any = Object.values(err.response.data.data.errors)[0]
            setValidationError(key)
            Alert.alert('Error Validation', firstError?.length > 0 ? firstError[0] : '')
          } else if (err.response.data.data.message) {
            Alert.alert('Error', err.response.data.data.message)
          }

          error = true
        })
        .finally(() => {
          setSubmitting(false)
        })

      return error
    },
    [refresh],
  )

  return (
    <ContractContext.Provider
      value={{
        getContractFields,
        contractData,
        addContract,
        setSignatureImage,
        signature,
        setOtherFields,
        otherInfo,
        photosArr,
        setPhotosList,
        damagePhotoArr,
        setDamagePhotosList,
        removeOtherInfo,
        isSubmitting,
        validationError,
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}
