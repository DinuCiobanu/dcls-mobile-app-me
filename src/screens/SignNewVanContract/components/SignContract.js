import React, { useCallback, useContext } from 'react'
import { Platform, StatusBar, Dimensions, View, TouchableWithoutFeedback } from 'react-native'

import Signature from 'react-native-signature-canvas'

import { useIsFocused } from '@react-navigation/native'

import Modal from 'react-native-modal'

import { SafeAreaView } from 'react-native-safe-area-context'
import ImageResizer from 'react-native-image-resizer'
import styled from 'styled-components/native'
import { AuditContext } from '../../../providers/AuditProvider'
import { ContractContext } from '../../../providers/ContractProvider'

import { defaultColors } from '../../../theme/colors'

const createFormData = (key, value) => {
  const data = new FormData()

  data.append(
    'file',
    {
      uri: Platform.OS !== 'ios' ? 'file://' + value : value,
      name: `${key}${new Date().valueOf()}.jpg`,
      type: 'image/png',
    },
    'blob.png',
  )

  return data
}

const SignContract = ({ onRequestClose, ...otherProps }) => {
  const windowHeight = Dimensions.get('window').height
  const isFocused = useIsFocused()

  const { addFile } = useContext(AuditContext)
  const { setOtherFields, setSignatureImage } = useContext(ContractContext)

  const addNewFile = useCallback(
    async (par1, par2) => {
      const res = await addFile(createFormData(par1, par2))

      setOtherFields('signature', res?.data?.file_id)
    },
    [addFile, setOtherFields],
  )

  const handleSignature = (sign) => {
    setSignatureImage(sign)
    ImageResizer.createResizedImage(sign, 250, 100, 'PNG', 100).then((res) => {
      addNewFile('signature', res.uri)
    })
    onRequestClose()
  }

  const handleEmpty = () => {
    console.log('Empty')
    onRequestClose()
  }

  const style = `.m-signature-pad--footer
    .button {
      background-color: gray;
      color: #FFF;
    }
    .m-signature-pad--body {height: 100%; border: none;}
    .m-signature-pad {height: 100%; border: none;}
    body,html {
      border: 0.5px solid black;
      border-left-width: 0px;
      border-right-width: 0px;
      height: 350px;
    }
    `

  return (
    <Modal
      isVisible={true}
      coverScreen={true}
      onBackdropPress={onRequestClose}
      backdropColor="black"
      backdropOpacity={0.6}
      hasBackdrop={true}
      customBackdrop={
        <TouchableWithoutFeedback onPress={onRequestClose}>
          <View style={{ backgroundColor: 'black', opacity: 1, height: '1000%' }} />
        </TouchableWithoutFeedback>
      }
      {...otherProps}
    >
      <SafeAreaView style={{ height: 450 }}>
        {isFocused && <StatusBar barStyle={'dark-content'} translucent backgroundColor="transparent" />}
        <Heading>Draw your signature</Heading>
        <Signature
          onOK={handleSignature}
          onEmpty={handleEmpty}
          overlayHeight={windowHeight}
          descriptionText="Draw your signature"
          clearText="Clear"
          confirmText="Save"
          webStyle={style}
        />
      </SafeAreaView>
    </Modal>
  )
}

export default SignContract

const Heading = styled.Text`
  text-align: center;
  font-weight: 700;
  font-size: 25px;
  margin-bottom: 10px;
  color: ${defaultColors.white};
`
