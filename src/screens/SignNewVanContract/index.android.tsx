import React, { useEffect, useCallback, useContext, useState, useMemo } from 'react'
import {
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  View,
  ScrollView,
  BackHandler,
  Alert,
  useWindowDimensions,
} from 'react-native'
import { uniqueId } from 'lodash'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useIsFocused } from '@react-navigation/native'
import RenderHTML, { HTMLContentModel, HTMLElementModel } from 'react-native-render-html'
import styled from 'styled-components/native'
import { request, PERMISSIONS } from 'react-native-permissions'
import LocationEnabler from 'react-native-location-enabler'
import { useSelector } from 'react-redux'
import { defaultColors } from '../../theme/colors'

import { ContractContext } from '../../providers/ContractProvider'

import { icons } from '../../assets/icons'

// TO-DO disable for IOS

import Loading from '../Loading/Loading'

import ModalRoot from '../../components/Modal/Modal'
import { ModalContext } from '../../components/Modal/ModalProvider'
import { storeSelector } from '../../states/storeSelectors'
import Damages from './components/DamageInfo'
import VehicleInfo from './components/VehicleInfo'
import UserInfo from './components/UserInfo'
import SignContract from './components/SignContract'

// TO-DO disable for IOS

const {
  PRIORITIES: { HIGH_ACCURACY },
  useLocationSettings,
} = LocationEnabler

const requestCameraPermission = async () => {
  const resp = await request(PERMISSIONS.ANDROID.CAMERA)
  return resp
}

const requestLocationPermission = async () => {
  const resp = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
  return resp
}

const SignNewVanContract = ({ navigation }: any) => {
  const refresh = useSelector(storeSelector.auth.selectToken)

  const isFocused = useIsFocused()
  const [iAgree, setIAgree] = useState({
    agree1: false,
    agree2: false,
  })

  const [permissionList, setPermissionList] = useState({ hasCameraPermission: false, hasLocationPermission: false })

  useEffect(() => {
    const checkPermission = async () => {
      if (!permissionList.hasCameraPermission) {
        await requestCameraPermission()
          .then((result) => {
            console.log({ requestCameraPermission: result })
            setPermissionList((prev) => ({ ...prev, hasCameraPermission: true }))
          })
          .catch(() => {
            setPermissionList((prev) => ({ ...prev, hasCameraPermission: false }))
          })
      }
      if (!permissionList.hasLocationPermission) {
        await requestLocationPermission()
          .then((result) => {
            console.log({ requestLocationPermission: result })
            setPermissionList((prev) => ({ ...prev, hasLocationPermission: true }))
          })
          .catch(() => {
            setPermissionList((prev) => ({ ...prev, hasLocationPermission: false }))
          })
      }
    }

    checkPermission()
  }, [permissionList])

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

  const [readMore, setReadMore] = useState({
    readMoreTerms: false,
    readMoreCond: false,
  })

  const [damages] = useState({})
  const [error, setError] = useState(false)
  const { showModal } = useContext(ModalContext)
  const [scrollCords, setScrollCords] = useState({ userInfo: 0, signatures: 0, vehicleInfo: 0 })
  const [shouldCheckValidation, setCheckValidation] = useState(true)
  const { width } = useWindowDimensions()

  const {
    addContract,
    contractData,
    getContractFields,
    isSubmitting,
    otherInfo,
    removeOtherInfo,
    setDamagePhotosList,
    setOtherFields,
    setPhotosList,
    setSignatureImage,
    signature,
    validationError,
  } = useContext(ContractContext)

  // TO-DO disable for IOS
  const [enabled, requestResolution] = useLocationSettings({
    priority: HIGH_ACCURACY,
    alwaysShow: true,
    needBle: true,
  })

  useEffect(() => {
    if (!enabled) {
      requestResolution()
    }
  }, [enabled, requestResolution])

  const objectLength = useMemo(
    () =>
      contractData?.fields?.exterior_photo_fields.length +
      contractData?.fields?.safety_photo_fields.length +
      contractData?.fields?.interior_photo_fields.length,
    [contractData],
  )
  const validationInfoLength = useMemo(() => {
    const hasDamage = Object.keys(otherInfo).includes('damages') && Object.keys(otherInfo?.damages).length > 0
    let totalValidation = Object.keys(otherInfo).length
    if (hasDamage) {
      totalValidation = totalValidation - 1
    }
    return totalValidation
  }, [otherInfo])

  useEffect(() => {
    removeOtherInfo()
    setIAgree({ agree1: false, agree2: false })
    setReadMore({ readMoreTerms: false, readMoreCond: false })
    setPhotosList({})
    setSignatureImage(null)
    setDamagePhotosList({})
  }, [])

  const iAgreeTerms = useCallback(() => {
    setIAgree({ ...iAgree, agree1: !iAgree.agree1, agree2: !iAgree.agree2 })
  }, [iAgree])

  const iAgreeCond = useCallback(() => {
    setIAgree({ ...iAgree, agree1: !iAgree.agree1, agree2: !iAgree.agree2 })
  }, [iAgree])

  const readMoreTerms = useCallback(() => {
    setReadMore({ ...readMore, readMoreTerms: !readMore.readMoreTerms })
  }, [readMore])

  const readMoreCond = useCallback(() => {
    setReadMore({ ...readMore, readMoreCond: !readMore.readMoreCond })
  }, [readMore])

  const signTerms = useCallback(() => {
    showModal(SignContract)
  }, [showModal])

  const onCommentsChange = useCallback(
    (val: any) => {
      setOtherFields(contractData?.fields?.other_fields?.[6].slug, val)
    },
    [contractData?.fields?.other_fields, setOtherFields],
  )

  const scrollRef = React.useRef<ScrollView>(null)

  useEffect(() => {
    requestCameraPermission()
  }, [])

  useEffect(() => {
    if (!contractData) {
      getContractFields()
    }
  }, [contractData, getContractFields, refresh])

  const onContractSigned = useCallback(async () => {
    const err = await addContract({ ...otherInfo })

    if (err) {
      setError(true)
      setCheckValidation(true)
    } else {
      removeOtherInfo()
      setIAgree({ agree1: false, agree2: false })
      setReadMore({ readMoreTerms: false, readMoreCond: false })
      setPhotosList({})
      setSignatureImage(null)
      setDamagePhotosList({})

      navigation.navigate('vanAudit')
    }
  }, [addContract, navigation, otherInfo, removeOtherInfo, setPhotosList, setSignatureImage])

  const onLayoutChange = (event: any, key: any) => {
    const layout = event.nativeEvent.layout
    const cords = { [key]: layout.y }
    setScrollCords((prev) => ({ ...prev, ...cords }))
  }

  useEffect(() => {
    if (shouldCheckValidation && error && validationError?.length > 0) {
      const userInfoFields = ['gps_location', 'inspected_by_id', 'status', 'driver_id', 'van_current_mileage']
      const userInfoValidation = userInfoFields.includes(validationError[0])
      const signatureValidation = ['signature'].includes(validationError[0])

      if (userInfoValidation) {
        const height = scrollCords.userInfo
        scrollRef.current && scrollRef.current.scrollTo({ x: 0, y: height, animated: true })
      } else if (signatureValidation) {
        const height = scrollCords.signatures
        scrollRef.current && scrollRef.current.scrollTo({ x: 0, y: height, animated: true })
      } else {
        const height = scrollCords.vehicleInfo
        scrollRef.current && scrollRef.current.scrollTo({ x: 0, y: height, animated: true })
      }
      setCheckValidation(false)
    }
  }, [shouldCheckValidation, error, setError, onContractSigned, scrollCords, validationError])

  const customHTMLElementModels = () => {
    return {
      p: HTMLElementModel.fromCustomModel({
        tagName: 'p',
        mixedUAStyles: {
          fontSize: 16,
          color: 'black',
          lineHeight: 22,
        },
        contentModel: HTMLContentModel.block,
      }),
    }
  }

  const renderTerms = useCallback(() => {
    const shortTerms = contractData.terms_and_conditions.split('<div><br></div>')
    return (
      <RenderHTML
        key={uniqueId()}
        source={{
          html: `<p>${
            readMore.readMoreTerms
              ? contractData.terms_and_conditions.replace('div', 'p')
              : shortTerms[0].replace('div', 'p')
          }</p>`,
        }}
        customHTMLElementModels={customHTMLElementModels()}
        contentWidth={width}
      />
    )
  }, [readMore])

  const renderCharges = useCallback(() => {
    const shortCharges = contractData.charges_for_hired_van.split('<div><br></div>')
    return (
      <RenderHTML
        key={uniqueId()}
        source={{
          html: `<p>${
            readMore.readMoreCond
              ? contractData.charges_for_hired_van.replace('div', 'p')
              : shortCharges[0].replace('div', 'p')
          }</p>`,
        }}
        customHTMLElementModels={customHTMLElementModels()}
        contentWidth={width}
      />
    )
  }, [readMore])

  return (
    <>
      {contractData && (
        <Container>
          <ModalRoot />
          <StatusBar
            barStyle={isFocused ? 'dark-content' : 'light-content'}
            translucent
            backgroundColor="transparent"
          />

          <ScrollArea
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            alwaysBounceVertical={false}
            nestedScrollEnabled={true}
            bounces={false}
            ref={scrollRef}
            keyboardShouldPersistTaps={'handled'}
          >
            <Wrap>
              <View onLayout={(event) => onLayoutChange(event, 'userInfo')} />
              <UserInfo
                error={error}
                contractData={contractData?.fields}
                hasPermission={permissionList.hasLocationPermission}
              />
              <View onLayout={(event) => onLayoutChange(event, 'vehicleInfo')} />
              <VehicleInfo
                error={error}
                contractData={contractData?.fields}
                hasCameraPermission={permissionList.hasCameraPermission}
              />

              <InputWrap>
                <Label>Comment:</Label>
                <CommentInput
                  placeholder={'Additional comment you wanna write...'}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={onCommentsChange}
                />
              </InputWrap>

              <Damages
                error={error}
                damages={damages}
                damageArr={contractData?.fields.other_fields[8]?.repeater_fields[0].options}
              />

              <View onLayout={(event) => onLayoutChange(event, 'signatures')} />
              <TabHeading>Signatures and disclaimer</TabHeading>
              <Disclaimer>{renderTerms()}</Disclaimer>

              <ReadMoreWrap onPress={readMoreTerms}>
                <ReadMore>{readMore.readMoreTerms ? 'read less' : 'read more'}</ReadMore>
              </ReadMoreWrap>

              <IAgreeWrap onPress={iAgreeTerms}>
                <IAgree iAgree={iAgree.agree1} hasError={error && !iAgree.agree1}>
                  I Agree with this terms and conditions
                </IAgree>
              </IAgreeWrap>

              {!iAgree.agree1 && <Hr />}

              {iAgree.agree1 && (
                <InputWrap>
                  <Label>Put your signature here:</Label>
                  <PasswordWrap hasError={error && !signature}>
                    <TouchableOpacity onPress={signTerms}>
                      <Ico
                        source={signature === null ? icons.contract.signature : { uri: signature }}
                        sign={!!signature}
                      />
                    </TouchableOpacity>
                  </PasswordWrap>
                </InputWrap>
              )}

              <Disclaimer>{renderCharges()}</Disclaimer>

              <ReadMoreWrap onPress={readMoreCond}>
                <ReadMore>{readMore.readMoreCond ? 'read less' : 'read more'}</ReadMore>
              </ReadMoreWrap>
              <IAgreeWrap onPress={iAgreeCond}>
                <IAgree iAgree={iAgree.agree2} hasError={error && !iAgree.agree2}>
                  I Agree
                </IAgree>
              </IAgreeWrap>

              {!iAgree.agree2 && <Hr />}

              {iAgree.agree2 && (
                <InputWrap>
                  <Label>Put your signature here:</Label>
                  <PasswordWrap hasError={error && !signature}>
                    <TouchableOpacity onPress={signTerms}>
                      <Ico
                        source={signature === null ? icons.contract.signature : { uri: signature }}
                        sign={!!signature}
                      />
                    </TouchableOpacity>
                  </PasswordWrap>
                </InputWrap>
              )}

              <SignContractButton
                disabled={isSubmitting}
                active={objectLength === validationInfoLength}
                onPress={onContractSigned}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <SignContractHeading>Sign Contract</SignContractHeading>
                )}
              </SignContractButton>
            </Wrap>
            <Spacer />
          </ScrollArea>
        </Container>
      )}

      {!contractData && <Loading />}
    </>
  )
}

export default SignNewVanContract

const Spacer = styled.View`
  height: 50px;
`

const Container = styled(SafeAreaView)`
  flex: 1;
  z-index: 1;
  background: ${defaultColors.white};
  margin-bottom: -50px;
`

const ReadMoreWrap = styled(TouchableOpacity)`
  margin-bottom: 15px;
`
const ReadMore = styled.Text`
  text-align: center;
  margin-bottom: 10px;
  color: ${defaultColors.grey};
`

const Wrap = styled.View`
  height: 100%;
  background: ${defaultColors.white};
  padding: 40px 30px 0;
  flex-direction: column;
  z-index: 1;
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
  text-align: right;
`

const Hr = styled.View`
  height: 1px;
  width: 100%;
  background: ${defaultColors.darkGrey};
  margin-top: 20px;
  margin-bottom: 15px;
`

const CommentInput = styled(Input)`
  text-align: left;
`

const InputWrap = styled.View`
  margin-bottom: 20px;
`

const TabHeading = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  margin-top: 20px;
  color: ${defaultColors.defaultBlack};
`

const ScrollArea = styled.ScrollView`
  z-index: 1;
  flex-grow: 1;
`

const Disclaimer = styled.View``

const IAgree = styled.Text`
  padding: 10px;
  color: ${({ iAgree }: { iAgree: boolean }) => (!iAgree ? 'black' : 'white')};
  background: ${({ iAgree }: { iAgree: boolean }) => (!iAgree ? defaultColors.grey : 'green')};
  border: ${({ hasError }: { hasError: boolean }) => (hasError ? '1px solid red' : '0px solid transparent')};
`

const IAgreeWrap = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: flex-end;
  border-radius: 15px;
`

const PasswordWrap = styled.View`
  flex-direction: row;
  flex-direction: row;
  justify-content: flex-end;
  padding-bottom: 10px;
  border-bottom-color: ${({ hasError }: { hasError: boolean }) => (hasError ? 'red' : defaultColors.darkGrey)};
  border-bottom-width: 1px;
`

const Ico = styled.Image`
  width: 30px;
  height: 30px;
  margin-left: 15px;
  margin-top: 0px;
  resize-mode: contain;
  width: ${({ sign }: { sign: boolean }) => (sign ? '100px' : '30px')};
  height: ${({ sign }: { sign: boolean }) => (sign ? '70px' : '30px')};
`

const Label = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${defaultColors.defaultBlack};
`

const SignContractButton = styled(TouchableOpacity)`
  padding: 15px 0;
  width: 100%;
  border-radius: 50px;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  background: ${({ active }: { active: boolean }) => (active ? 'green' : defaultColors.grey)};
`

const SignContractHeading = styled.Text`
  text-align: center;
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: ${defaultColors.white};
`
