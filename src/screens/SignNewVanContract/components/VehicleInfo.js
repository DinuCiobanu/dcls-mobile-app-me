import React, { useState, useCallback, useContext } from 'react'
import { Alert, View } from 'react-native'
import styled from 'styled-components/native'
import { useNavigation } from '@react-navigation/core'
import { defaultColors } from '../../../theme/colors'
import AddImageContainer from '../../CreateNewVan/AddImage'
import { ContractContext } from '../../../providers/ContractProvider'

import DropDownPicker from './DropDownPicker'

const headings = {
  interior_photo_fields: 'Interior Photos',
  exterior_photo_fields: 'Exterior Photos',
  safety_photo_fields: 'Safety Photos',
}

const VehicleInfo = ({ contractData, error, hasCameraPermission }) => {
  const { otherInfo, photosArr } = useContext(ContractContext)
  const [choosePhoto, setChoosePhoto] = useState(undefined)
  const [imageTitles, setImageTitles] = useState({})

  const navigation = useNavigation()

  const handleChoosePhoto = (photoTitle) => {
    if (choosePhoto) {
      navigation.navigate('camera', {
        choosePhoto: choosePhoto,
        contract: true,
        imageTitle: photoTitle,
      })
    }
  }

  const changePhotoNum = useCallback(
    (num, text, ind) => {
      if (!hasCameraPermission) {
        Alert.alert('Camera permission was denied')
      } else {
        setChoosePhoto(num)
        setImageTitles({ [ind]: text })
        if (num === choosePhoto) {
          handleChoosePhoto(text)
        }
      }
    },
    [navigation, handleChoosePhoto, setChoosePhoto, setImageTitles, hasCameraPermission],
  )

  return (
    <View>
      <TabHeading>Vehicle information</TabHeading>

      <Label>Registration number:</Label>
      <DropDownPicker
        error={error && !otherInfo?.van_id}
        placeholder="Registration number..."
        searchPlaceholder="Type registration number: "
        fieldNum={0}
      />
      {Object.keys(contractData).map((key, index2) => {
        // eslint-disable-next-line array-callback-return
        if (key === 'other_fields') return

        return (
          <View key={key}>
            <TabSubHeading>
              {headings[key]} <TabHeadingThick>(Take Photo)</TabHeadingThick>
            </TabSubHeading>

            <UploadContainer>
              <UploadTitle>{imageTitles[index2] ? imageTitles[index2] : ''}</UploadTitle>
            </UploadContainer>

            <ImageContainer>
              {contractData[key].map((item, index) => {
                return (
                  <AddImageContainer
                    key={index}
                    active={choosePhoto === item.slug}
                    item={item}
                    colIndex={index2}
                    index={index}
                    func={changePhotoNum}
                    img={photosArr[item.slug]}
                    isCompleted={!photosArr[item.slug] || error}
                  />
                )
              })}
            </ImageContainer>
          </View>
        )
      })}
    </View>
  )
}

export default VehicleInfo

const Label = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 10px;
  color: ${defaultColors.defaultBlack};
`

const TabHeading = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  margin-bottom: 60px;
  margin-top: 20px;
  color: ${defaultColors.defaultBlack};
`

const TabSubHeading = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 10px;
  color: ${defaultColors.defaultBlack};
`

const UploadTitle = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: ${defaultColors.defaultBlack};
`

const UploadContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`

const ImageContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  margin: 20px 0;
`

const TabHeadingThick = styled.Text`
  font-weight: normal;
  color: ${defaultColors.defaultBlack};
`
