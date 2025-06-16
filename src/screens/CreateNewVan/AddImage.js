import React, { useState, useEffect } from 'react'
import { View, Dimensions } from 'react-native'
import styled from 'styled-components/native'
import { defaultColors } from '../../theme/colors'

const AddImageContainer = ({ active, auditShow, colIndex, func, img, index, isCompleted, item }) => {
  const [photoUri, setPhotoUri] = useState()

  const windowWidth = Dimensions.get('window').width

  useEffect(() => {
    if (img) setPhotoUri(img)
  }, [img])

  
  return (
    <View key={item.id}>
      {!auditShow ? (
        <ImageLoadContainer windowWidth={windowWidth} index={index}>
          <ImageUploadContainer hasError={isCompleted && !img} onPress={() => func(item.slug, item.name, colIndex)}>
            {img ? <ImageUploaded source={{ uri: photoUri }} /> : <PlaceholderImage />}
          </ImageUploadContainer>
          {active && <ActiveDot />}
          {!active && isCompleted && !img && <ErrorDot />}
        </ImageLoadContainer>
      ) : (
        <ImageLoadContainer windowWidth={windowWidth} index={index}>
          <ImageUploadContainer hasError={isCompleted && !img}>
            {img ? <ImageUploaded source={{ uri: photoUri }} /> : <PlaceholderImage />}
          </ImageUploadContainer>
        </ImageLoadContainer>
      )}
    </View>
  )
}

export default AddImageContainer

const ImageLoadContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
  margin-right: ${({ index, windowWidth }) => ((index + 1) % 5 !== 0 ? (windowWidth - 60 * 5 - 60) / 4 : 0)}px;
`

const ActiveDot = styled.View`
  width: 15px;
  height: 15px;
  background-color: #4d79ff;
  border-radius: 100px;
  position: absolute;
  right: -5px;
  top: -5px;
`
const ErrorDot = styled.View`
  width: 15px;
  height: 15px;
  background-color: red;
  border-radius: 100px;
  position: absolute;
  right: -5px;
  top: -5px;
`

const ImageUploadContainer = styled.TouchableOpacity`
  position: relative;
  border: ${({ hasError }) => (hasError ? '1px solid red' : '1px solid transparent')};
  border-radius: 10px;
`

const ImageUploaded = styled.Image`
  width: 58px;
  height: 58px;
  resize-mode: cover;
  border-radius: 10px;
`

const PlaceholderImage = styled.View`
  width: 58px;
  height: 58px;
  background: ${defaultColors.lightGrey};
  resize-mode: cover;
  border-radius: 10px;
`
