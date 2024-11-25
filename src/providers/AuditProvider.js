import React, { createContext, useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { api } from '../states/api/base'

export const AuditContext = createContext()

export const AuditProvider = ({ children }) => {
  const [audit, setAudit] = useState(null)
  const [photosArr, setPhotosArr] = useState({})
  const [idArr, setIdArr] = useState({})
  const [isSubmitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState(null)

  const setPhotoList = useCallback((val) => {
    setPhotosArr({ ...val })
  }, [])

  const setIdList = useCallback((val) => {
    setIdArr({ ...val })
  }, [])

  const getAuditFields = useCallback(async () => {
    await api.v2
      .get('get-audit-fields')
      .then((response) => {
        setAudit(response.data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const addAudit = useCallback(
    async (images) => {
      let error
      setSubmitting(true)
      await api.v2
        .post('save-audit', { ...images })
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
            const firstError = Object.values(err.response.data.data.errors)[0]
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

    [],
  )

  const addFile = useCallback(async (image) => {
    let data

    await api.v1
      .post('files', image, { headers: { 'content-type': 'multipart/form-data' } })
      .then((response) => {
        data = response.data
      })
      .catch((err) => {
        console.log(err)
      })
    return data
  }, [])

  const getAuditById = useCallback(async (id) => {
    let data

    await api.v1
      .get(`get-audit-details?audit_id=${id}`)
      .then((response) => {
        console.log(response.data)
        data = response.data
      })
      .catch((err) => {
        console.log(err)
      })
    return data
  }, [])

  return (
    <AuditContext.Provider
      value={{
        getAuditFields,
        audit,
        addAudit,
        addFile,
        photosArr,
        idArr,
        setPhotoList,
        setIdList,
        getAuditById,
        isSubmitting,
        validationError,
      }}
    >
      {children}
    </AuditContext.Provider>
  )
}
