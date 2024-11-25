import React, { useState, useCallback, useContext, useEffect, useMemo } from 'react'
import moment from 'moment'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PERMISSIONS, request } from 'react-native-permissions'
import styled from 'styled-components/native'
import DropDownPicker from 'react-native-dropdown-picker'
import { useSelector } from 'react-redux'
import { Platform, View, ActivityIndicator, Alert, BackHandler } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { monthNames } from '../../utils/dates'
import { storeSelector } from '../../states/storeSelectors'
import { AuditContext } from '../../providers/AuditProvider'
import { defaultColors } from '../../theme/colors'
import Loading from '../Loading/Loading'
import AddImageContainer from './AddImage'

const headings = {
  interior_photo_fields: 'Interior Photos',
  exterior_photo_fields: 'Exterior Photos',
}

const CreateNewVan = ({ navigation }) => {
  const [choosePhoto, setChoosePhoto] = useState(undefined)
  const refresh = useSelector(storeSelector.auth.selectToken)

  const [imageTitles, setImageTitles] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [opened, setOpened] = useState(false)
  const [value, setValue] = useState(null)
  const [permissionList, setPermissionList] = useState({ hasCameraPermission: false })

  const { addAudit, audit, getAuditFields, idArr, isSubmitting, photosArr, setIdList, setPhotoList } =
    useContext(AuditContext)

  useEffect(() => {
    const checkPermission = async () => {
      if (!permissionList.hasCameraPermission) {
        await request(Platform.select({ ios: PERMISSIONS.IOS.CAMERA, android: PERMISSIONS.ANDROID.CAMERA }))
          .then((result) => {
            console.log({ requestCameraPermission: result })
            setPermissionList((prev) => ({ ...prev, hasCameraPermission: true }))
          })
          .catch(() => {
            setPermissionList((prev) => ({ ...prev, hasCameraPermission: false }))
          })
      }
    }

    checkPermission()
  }, [permissionList])

  const handleChoosePhoto = (photoTitle) => {
    if (choosePhoto) {
      navigation.navigate('camera', {
        choosePhoto: choosePhoto,
        audit: true,
        imageTitle: photoTitle,
      })
    }
  }

  const changePhotoNum = useCallback(
    (num, text, ind) => {
      setChoosePhoto(num)
      setImageTitles({ [ind]: text })
      if (num === choosePhoto) {
        handleChoosePhoto(text)
      }
    },
    [navigation, handleChoosePhoto, setChoosePhoto, setImageTitles],
  )

  const saveAudit = useCallback(async () => {
    const error = await addAudit(idArr)

    if (error) {
      setIsCompleted(true)
    } else {
      setIdList({})
      setPhotoList({})
      setChoosePhoto(undefined)
      setValue(null)

      navigation.goBack()
    }
  }, [addAudit, idArr, navigation, setIdList, setPhotoList])

  const onOtherDetailsChange = useCallback(
    (text, slug) => {
      setIdList({ ...idArr, [slug]: text })
    },
    [idArr, setIdList],
  )

  useEffect(() => {
    if (!audit) {
      getAuditFields()
    }
  }, [audit, getAuditFields, refresh])

  const objectLength = useMemo(
    () => audit?.exterior_photo_fields.length + audit?.interior_photo_fields.length + audit?.other_fields.length,
    [audit],
  )
  const startOfWeek = moment().startOf('week').toDate().getDate()
  const endOfWeek = moment().endOf('week').toDate().getDate()
  const startOfMonth = moment().startOf().month()
  const endOfMonth = moment().endOf().month()
  const startOfMonthName = monthNames[startOfMonth]
  const endOfMonthName = monthNames[endOfMonth]
  const currentYear = moment().year()

  const setInspected = useCallback(() => {
    const key = 'value'
    const newArr = []
    Object.values(audit.available_contracts).forEach((item) => {
      newArr.push({
        value: item,
        label: item,
      })
    })

    const arrayUniqueByKey = [...new Map(newArr.map((item) => [item[key], item])).values()]
    return arrayUniqueByKey
  }, [])

  const inspectedOptions = useMemo(() => setInspected(), [])

  const setInspectedBy = useCallback(
    (val) => {
      setValue(val())
      if (val) {
        const availableContractsArray = Object.entries(audit.available_contracts)
        const availableContract = availableContractsArray.find((name) => name[1] === val())

        onOtherDetailsChange(availableContract[0], 'contract_id')
      }
    },
    [setValue, onOtherDetailsChange, audit],
  )

  useEffect(
    () =>
      isSubmitting &&
      navigation.addListener('beforeRemove', (e) => {
        e.preventDefault()
        Alert.alert('Are you sure you want to leave this screen?', 'All contract data will be lost', [
          { text: "Don't leave", style: 'cancel', onPress: () => null },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ])
      }),
    [navigation],
  )

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Are you sure you want to leave this screen?', 'All contract data will be lost', [
        {
          text: "Don't leave",
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'Leave', onPress: () => navigation.navigate('vanAudit') },
      ])
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

    return () => {
      isSubmitting && backHandler.remove()
    }
  }, [])

  return (
    <>
      {audit && (
        <Container edges={['top']}>
          <ScrollArea
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            alwaysBounceVertical={false}
            bounces={false}
          >
            <Header>
              <HeaderHeading>Create new Van Audit</HeaderHeading>
              <SubHeading>
                {startOfMonthName + ' ' + startOfWeek} - {endOfMonthName + ' ' + endOfWeek}, {currentYear}
              </SubHeading>
            </Header>

            <Wrap>
              <TabHeading>Van details</TabHeading>
              <VanDetailsForm>
                <DropDownPicker
                  style={{
                    borderColor:
                      isCompleted && !idArr.available_contracts && !value ? defaultColors.errorRed : defaultColors.grey,
                  }}
                  dropDownContainerStyle={{ height: Platform.OS === 'android' ? 190 : 170 }}
                  open={opened}
                  searchable
                  setOpen={setOpened}
                  value={value}
                  items={inspectedOptions}
                  setValue={setInspectedBy}
                  listMode={'SCROLLVIEW'}
                  placeholder={'Contract'}
                  searchPlaceholder={'Search by Plate or Username'}
                  error={isCompleted && !idArr.available_contracts}
                />
                <Input
                  placeholder={'Current mileage'}
                  keyboardType={'numeric'}
                  onChangeText={(text) => onOtherDetailsChange(text, 'current_mileage')}
                  hasError={isCompleted && !idArr.current_mileage}
                />
                <Input
                  placeholder={'Add a comment...'}
                  keyboardType={'default'}
                  multiline={true}
                  editable={true}
                  onChangeText={(text) => onOtherDetailsChange(text, 'other_info')}
                />
              </VanDetailsForm>

              {audit &&
                Object.keys(audit).map((heading, index2) => {
                  // eslint-disable-next-line array-callback-return
                  if (heading === 'other_fields' || heading === 'available_contracts') return

                  return (
                    <View key={index2}>
                      <TabHeading>
                        {headings[heading]} <TabHeadingThick>(Take Photo)</TabHeadingThick>
                      </TabHeading>

                      <UploadContainer>
                        <UploadTitle>{imageTitles[index2] ? imageTitles[index2] : ''}</UploadTitle>
                      </UploadContainer>

                      <ImageContainer>
                        {audit[heading].map((item, index) => {
                          return (
                            <AddImageContainer
                              key={index}
                              active={choosePhoto === item.slug}
                              item={item}
                              colIndex={index2}
                              index={index}
                              func={changePhotoNum}
                              img={photosArr[item.slug]}
                              isCompleted={!photosArr[item.slug] || isCompleted}
                            />
                          )
                        })}
                      </ImageContainer>
                    </View>
                  )
                })}

              <AddNewVanButton
                disabled={isSubmitting}
                active={idArr && objectLength === Object.keys(idArr).length}
                onPress={saveAudit}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <AddNewVanButtonHeading>Confirm Audit</AddNewVanButtonHeading>
                )}
              </AddNewVanButton>
            </Wrap>
          </ScrollArea>
        </Container>
      )}

      {!audit && <Loading />}
    </>
  )
}

export default CreateNewVan

const Container = styled(SafeAreaView)`
  flex: 1;
  margin-bottom: ${Platform.OS === 'ios' ? '-35px' : '-15px'};
  background-color: ${defaultColors.defaultBlack};
`

const Header = styled.View`
  width: 100%;
  background: ${defaultColors.defaultBlack};
  padding: 0px 0 70px;
`

const HeaderHeading = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 35px;
  color: ${defaultColors.white};
  margin: 0 30px;
`

const SubHeading = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  color: ${defaultColors.grey};
  margin: 5px 30px 0;
`

const Wrap = styled.View`
  background: white;
  flex: 1;
  padding: 40px 30px 0;
`

const ScrollArea = styled.ScrollView``

const VanDetailsForm = styled.View`
  margin-bottom: 70px;
  margin-top: 10px;
`

const Input = styled.TextInput.attrs({
  placeholderTextColor: defaultColors.grey,
})`
  width: 100%;
  border-bottom-color: ${({ hasError }) => (hasError ? 'red' : defaultColors.darkGrey)};
  border-bottom-width: 1px;
  padding: 0 0 20px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  margin-top: 20px;
  color: ${defaultColors.defaultBlack};
`

const TabHeading = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  color: ${defaultColors.defaultBlack};
`

const TabHeadingThick = styled.Text`
  font-weight: normal;
`

const ImageContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 20px 0;
`

const UploadContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`

const UploadTitle = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
`

const AddNewVanButton = styled(TouchableOpacity)`
  padding: 15px 0;
  width: 100%;
  border-radius: 50px;
  justify-content: center;
  margin-bottom: 20px;
  margin-bottom: 40px;
  background: ${({ active }) => (active ? 'green' : defaultColors.grey)};
`

const AddNewVanButtonHeading = styled.Text`
  text-align: center;
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: ${defaultColors.white};
`
