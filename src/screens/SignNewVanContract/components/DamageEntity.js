import React, { useState, useCallback, useContext } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

import styled from 'styled-components/native'

import { useNavigation } from '@react-navigation/core'
import { icons } from '../../../assets/icons'
import { defaultColors } from '../../../theme/colors'
import { ContractContext } from '../../../providers/ContractProvider'

const DamageEntity = ({ editTheImage, error, item, navigation }) => {
  const [opened, setOpened] = useState(false)
  const { damagePhotoArr } = useContext(ContractContext)
  const [selectedDmgPhoto, setSelectedDmgPhoto] = useState(false)

  // const navigation = useNavigation()

  const onWrapPress = useCallback(() => {
    setOpened(!opened)
  }, [opened])

  const onCommentChange = useCallback(
    (val) => {
      editTheImage(item[1].damage_location, 'comments', val)
    },
    [editTheImage, item],
  )

  const handleAddPhoto = () => {
    navigation.navigate('camera', {
      choosePhoto: 'photos',
      damage: true,
      item: item,
    })
  }

  const handleChoosePhoto = () => {
    if (selectedDmgPhoto) {
      navigation.navigate('camera', {
        choosePhoto: selectedDmgPhoto,
        damage: true,
        item: item,
      })
    }
  }

  const handleSelectPhoto = useCallback(
    (id) => () => {
      const selectedPhoto = item[1].photos?.find((i) => i === id)
      setSelectedDmgPhoto(selectedPhoto)
    },
    [item, setSelectedDmgPhoto],
  )

  if (item[1] === null) return <></>

  return (
    <Wrap
      key={item[1]?.damage_location}
      hasError={error && !item[1]?.comments.length > 0 && !damagePhotoArr[item[1]?.damage_location]}
    >
      <HeaderWrap onPress={onWrapPress}>
        <Heading>{item[1]?.name}</Heading>
        <Arrow rotated={opened} source={icons.arrows.arrow} />
      </HeaderWrap>
      {opened && (
        <WrappedContent>
          <Label>Comment</Label>
          <TextArea
            placeholder={'Add comment to damage...'}
            multiline={true}
            value={item[1]?.comments}
            onChangeText={onCommentChange}
          />
          <UploadWrap>
            <Label>Add photo</Label>
            <UploadButton2 onPress={handleChoosePhoto}>
              <UploadButton2Title>Photo</UploadButton2Title>
            </UploadButton2>
          </UploadWrap>

          <ImageUploadContainer>
            {damagePhotoArr[item[1]?.damage_location]?.map(({ id, url }) => {
              return (
                <ImageContainer key={id} onPress={handleSelectPhoto(id)}>
                  <Dot selected={selectedDmgPhoto === id} />
                  <Image
                    key={id}
                    source={{
                      uri: url,
                    }}
                  />
                </ImageContainer>
              )
            })}
            {!item[1]?.photos && (
              <Wrapper>
                <Image
                  source={icons.vanAudit.photoReplace}
                  hasError={error && !damagePhotoArr[item[1]?.damage_location]}
                />
              </Wrapper>
            )}

            <AddNewImage onPress={handleAddPhoto}>
              <Plus>+</Plus>
            </AddNewImage>
          </ImageUploadContainer>
        </WrappedContent>
      )}
    </Wrap>
  )
}

export default DamageEntity

const HeaderWrap = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Heading = styled.Text`
  color: ${defaultColors.defaultBlack};
  font-weight: 600;
  text-transform: capitalize;
`

const Wrap = styled.View`
  border: 0px solid ${({ hasError }) => (hasError ? 'red' : defaultColors.defaultBlack)};
  border-bottom-width: 1px;
  padding-bottom: 10px;
  margin-bottom: 20px;
`

const Arrow = styled.Image`
  width: 13px;
  height: 13px;
  resize-mode: contain;
  transform: rotate(${({ rotated }) => (rotated ? '-90deg' : '-180deg')});
`

const WrappedContent = styled.View`
  margin-top: 10px;
`

const TextArea = styled.TextInput.attrs({
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
  margin-bottom: 20px;
`

const ImageUploadContainer = styled.View`
  border: ${({ hasError }) => (hasError ? '2px solid red' : '2px solid transparent')};
  border-radius: 8px;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
`

const Wrapper = styled.View`
  margin-right: 20px;
  margin-bottom: 10px;
`

const ImageContainer = styled.TouchableOpacity`
  margin-right: 20px;
  margin-bottom: 10px;
`

const Image = styled.Image`
  width: 60px;
  height: 60px;
  resize-mode: cover;
  border: ${({ hasError }) => (hasError ? '1px solid red' : '1px solid transparent')};
  border-radius: 8px;
`

const AddNewImage = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  border: 1px solid ${defaultColors.grey};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`
const Plus = styled.Text`
  font-size: 48px;
  color: ${defaultColors.grey};
  margin-top: -5px;
`

const Label = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: ${defaultColors.defaultBlack};
`

const Dot = styled.View`
  width: 15px;
  height: 15px;
  background-color: ${({ selected }) => (selected ? defaultColors.lightBlue : defaultColors.errorRed)};
  border-radius: 100px;
  position: absolute;
  right: -5px;
  top: -5px;
  z-index: 1;
`

const UploadWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`

const UploadButton2 = styled(TouchableOpacity)`
  background: ${defaultColors.black};
  padding: 3px 5px;
`

const UploadButton2Title = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: ${defaultColors.white};
`
