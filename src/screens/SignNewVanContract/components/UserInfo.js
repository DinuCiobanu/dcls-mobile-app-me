import React, { useEffect, useState, useContext, useCallback } from 'react'
import GetLocation from 'react-native-get-location'
import styled from 'styled-components/native'
import Geocoder from 'react-native-geocoding'
import { Alert } from 'react-native'
import { icons } from '../../../assets/icons'
import { defaultColors } from '../../../theme/colors'
import { ContractContext } from '../../../providers/ContractProvider'
import DropDownPicker from './DropDownPicker'

const GEOCODER_API = 'AIzaSyDjNCXKOs9ygeKpVY5hcSXzT0YIspOkGEw'

const UserInfo = ({ contractData, error, hasPermission }) => {
  const [checkIn, setCheckIn] = useState(null)
  const { otherInfo, setOtherFields } = useContext(ContractContext)

  const getUserLocation = useCallback(() => {
    if (!otherInfo[contractData?.other_fields?.[3].slug] && hasPermission) {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then((location) => {
          Geocoder.init(GEOCODER_API, { language: 'en' })
          Geocoder.from(location.latitude, location.longitude).then((res) => {
            // setAddress(res?.results[0]?.address_components)
            const adress =
              res?.results[0]?.address_components[1]?.long_name +
              ' ' +
              res?.results[0]?.address_components[0]?.long_name
            setOtherFields(contractData?.other_fields?.[3].slug, adress)
          })
        })
        .catch((error) => {
          const { code, message } = error
          Alert.alert(code, message)
          console.warn(code, message)
        })
    }
  }, [setOtherFields, contractData?.other_fields, hasPermission])

  const onMillageChanges = useCallback(
    (val) => {
      setOtherFields(contractData?.other_fields?.[5].slug, parseFloat(val.replace(/\s/g, '') || 0))
    },
    [contractData?.other_fields, setOtherFields],
  )

  const statusChange = useCallback(
    (bool) => {
      setCheckIn(bool)
      setOtherFields(contractData?.other_fields?.[4].slug, bool ? 'check_in' : 'check_out')
    },
    [contractData?.other_fields, setOtherFields],
  )

  useEffect(() => {
    if (!hasPermission) {
      getUserLocation()
    }
  }, [getUserLocation])

  return (
    <Container>
      <HeaderHeading>Van contract</HeaderHeading>
      <Label>Inspected by:</Label>
      <DropDownPicker
        error={error}
        placeholder="Inspected by..."
        searchPlaceholder="Type inspector name: "
        fieldNum={1}
      />

      <InputWrap>
        <Label>GPS location:</Label>
        <PasswordWrap>
          <Input
            style={{ paddingRight: 45 }}
            editable={false}
            placeholder={'location is not enabled'}
            value={otherInfo[contractData?.other_fields?.[3].slug] || ''}
            hasError={error && !otherInfo?.gps_location}
          />
          <IcoWrapper onPress={getUserLocation}>
            <Ico source={icons.vanAudit.location} />
          </IcoWrapper>
        </PasswordWrap>
      </InputWrap>

      <InputWrap>
        <Label>Status:</Label>
        <CheckBoxWrap hasError={error && !otherInfo?.status}>
          <CheckEntityWrap onPress={() => statusChange(true)}>
            <CheckBoxLabel>Pick up</CheckBoxLabel>
            {checkIn === true ? (
              <UnChecked>
                <Checked />
              </UnChecked>
            ) : (
              <UnChecked />
            )}
          </CheckEntityWrap>

          <CheckEntityWrap onPress={() => statusChange(false)}>
            <CheckBoxLabel>Drop off</CheckBoxLabel>
            {checkIn === false ? (
              <UnChecked>
                <Checked />
              </UnChecked>
            ) : (
              <UnChecked />
            )}
          </CheckEntityWrap>
        </CheckBoxWrap>
      </InputWrap>

      <Label>Hirer name:</Label>
      <DropDownPicker
        error={error && !otherInfo?.driver_id}
        placeholder="Hirer name..."
        searchPlaceholder="Type hirer name: "
        fieldNum={2}
      />

      <InputWrap>
        <Label>Van Current Mileage:</Label>
        <Input
          placeholder={'ex: 200000'}
          keyboardType={'numeric'}
          hasError={error && !otherInfo?.van_current_mileage}
          onChangeText={onMillageChanges}
        />
      </InputWrap>
    </Container>
  )
}

export default UserInfo

const HeaderHeading = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 35px;
  color: ${defaultColors.defaultBlack};
  margin: 30px 0 60px;
`

const InputWrap = styled.View`
  margin-bottom: 20px;
  z-index: 1;
`

const Container = styled.View`
  z-index: 1;
`

const PasswordWrap = styled.View`
  flex-direction: row;
`

const Label = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 10px;
  color: ${defaultColors.defaultBlack};
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
  color: ${defaultColors.defaultBlack};
  text-align: right;
`

const IcoWrapper = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  margin-top: -5px;
  margin-left: -29px;
`

const Ico = styled.Image`
  resize-mode: contain;
  width: 30px;
  height: 30px;
`

const CheckBoxWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-bottom-color: ${({ hasError }) => (hasError ? 'red' : defaultColors.darkGrey)};
  border-bottom-width: 1px;
`

const CheckEntityWrap = styled.TouchableOpacity`
  flex-direction: row;
  width: 50%;
  align-items: center;
  padding-bottom: 20px;
  justify-content: flex-end;
`

const CheckBoxLabel = styled.Text`
  margin-right: 10px;
  color: ${defaultColors.defaultBlack};
`

const UnChecked = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 100px;
  border: 1.5px solid ${defaultColors.defaultBlack};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Checked = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 100px;
  background: ${defaultColors.defaultBlack};
`
