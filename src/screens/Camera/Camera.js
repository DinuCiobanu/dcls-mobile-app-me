import { useNavigation } from '@react-navigation/core'
import React, { useContext, useCallback, useState, useRef } from 'react'
import RNFS from 'react-native-fs'
import styled from 'styled-components/native'
// import { useIsFocused } from 'react-navigation/core'
import { View, StyleSheet, Platform, Alert, ActivityIndicator } from 'react-native'
import { useCameraDevice, Camera as RNCamera } from 'react-native-vision-camera'
import Marker from 'react-native-image-marker'
import ImageResizer from 'react-native-image-resizer'
import moment from 'moment'
import { useDeviceRotationSensor } from '../../hooks/useDeviceRotationSensor'
import { AuditContext } from '../../providers/AuditProvider'
import { ContractContext } from '../../providers/ContractProvider'
import { defaultColors } from '../../theme/colors'
import CustomButton from './CameraButton'
import { Text } from 'react-native-gesture-handler'

export default function Camera({ route, navigation }) {
   
  const device = useCameraDevice('back')
  // const navigation = useNavigation()
  const cameraRef = useRef(null)
  const { addFile, idArr, photosArr, setIdList, setPhotoList } = useContext(AuditContext)

  const { orientation } = useDeviceRotationSensor()

  const {
    damagePhotoArr,
    otherInfo,
    photosArr: contractPhotosArr,
    setDamagePhotosList,
    setOtherFields,
    setPhotosList: setContractPhotosArr,
  } = useContext(ContractContext)

  const [isLoading, setIsLoading] = useState(false)

  const { audit, choosePhoto, contract, damage, imageTitle, item } = route.params

  const editDamage = useCallback(
    (key, valName, val) => {
      setOtherFields('damages', {
        ...otherInfo?.damages,
        [key]: {
          ...otherInfo?.damages[key],
          [valName]: val,
        },
      })
    },
    [otherInfo, setOtherFields],
  )

  const createFormData = useCallback((key, value) => {
    const data = new FormData()

    data.append(
      'file',
      {
        uri: Platform.OS !== 'ios' ? 'file://' + value : value,
        name: `${key}${new Date().valueOf()}.jpg`,
        type: 'image/jpeg',
      },
      'blob.jpg',
    )

    return data
  }, [])

  const addNewFile = useCallback(
    async (par1, par2) => {
      const res = await addFile(createFormData(par1, par2))
      try {
        if (audit) {
          setPhotoList({
            ...photosArr,
            [choosePhoto]: res?.data?.file_url,
          })
          setIdList({ ...idArr, [choosePhoto]: res?.data?.file_id })
        }

        if (contract) {
          setContractPhotosArr({
            ...contractPhotosArr,
            [choosePhoto]: res?.data?.file_url,
          })
          setOtherFields(choosePhoto, res?.data?.file_id)
        }
        if (damage) {
          const damagesIds = [...(damagePhotoArr[item?.[0]] || [])]

          const prevIndex = damagesIds?.findIndex(({ id }) => id === choosePhoto)

          const newItem = {
            url: res?.data?.file_url,
            id: res?.data?.file_id,
          }

          if (prevIndex >= 0) {
            damagesIds[prevIndex] = newItem
          } else {
            damagesIds.push(newItem)
          }
          setDamagePhotosList({
            ...damagePhotoArr,
            [item[1].damage_location]: damagesIds,
          })

          const photosIds = damagesIds.map(({ id }) => id)
          editDamage(item[1].damage_location, 'photos', photosIds)
        }
      } catch (error) {
        console.log({ addNewFileError: error })
      }
    },
    [
      addFile,
      audit,
      choosePhoto,
      contract,
      contractPhotosArr,
      createFormData,
      damage,
      editDamage,
      idArr,
      item,
      photosArr,
      setContractPhotosArr,
      setIdList,
      setOtherFields,
      setPhotoList,
      damagePhotoArr,
    ],
  )

  const captureHandle = async () => {
    try {
      setIsLoading(true)
      // const options = { quality: 0.5, base64: true, pauseAfterCapture: false }
      const data = await cameraRef.current?.takePhoto()

      const filePath = data.path
      const newFilePath = RNFS.DocumentDirectoryPath + `/${choosePhoto}${new Date().valueOf()}.jpg`
      RNFS.moveFile(filePath, newFilePath)
      console.log('IMAGE MOVED', filePath, '-- to --', newFilePath)

      const resizedRes = await ImageResizer.createResizedImage(newFilePath, 1000, 560, 'JPEG', 100)
      const currentTime = moment().format('DD MM YYYY, h:mm:ss')
      const markeredRes = await Marker.markText({
        src: resizedRes.uri,
        text: currentTime,
        position: 'bottomRight',
        color: '#FF0000',
        fontName: 'Roboto',
        fontSize: 20,
        scale: 1,
        quality: 70,
      })

      await addNewFile(choosePhoto, markeredRes)

      await RNFS.unlink(newFilePath)
      await RNFS.unlink(resizedRes.path)
      await RNFS.unlink(markeredRes)

      navigation.goBack()
    } catch (error) {
      Alert.alert(error?.message ?? JSON.stringify(error))
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!device) {
    return (
      <View style={styles.backdrop}>
        <ActivityIndicator size={'large'} />
      </View>
    )
  }

  return (
    <View style={styles.body}>
      {isLoading && (
        <View style={styles.backdrop}>
          <ActivityIndicator size={'large'} />
        </View>
      )}
      <RNCamera
        device={device}
        isActive={true}
        ref={cameraRef}
        style={[StyleSheet.absoluteFill]}
        audio={false}
        photo={true}
        video={false}
        orientation={orientation}
      />
      <View style={styles.buttonsContainer}>
        <Container>
          <PhotoTitle>{imageTitle}</PhotoTitle>
        </Container>
        <View style={styles.container}>
          <CustomButton
            title="Go back"
            color={defaultColors.grey}
            onPressFunction={() => navigation.goBack()}
            disabled={isLoading}
          />
          <CustomButton title="Take photo" color={'#4BB543'} onPressFunction={captureHandle} disabled={isLoading} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    top: -20,
  },
  backdrop: {
    position: 'absolute',
    zIndex: 1,
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000CC',
  },
  buttonsContainer: { position: 'absolute', bottom: 0, alignItems: 'center', alignSelf: 'center' },
})

const Container = styled.View`
  background-color: ${defaultColors.white};
  margin-bottom: 30px;
  padding: 8px;
  border-radius: 4px;
`

const PhotoTitle = styled.Text`
  font-size: 16px;
`
