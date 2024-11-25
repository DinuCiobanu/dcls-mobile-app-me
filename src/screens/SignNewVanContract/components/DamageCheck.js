import React, { useCallback, useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import CheckBox from '@react-native-community/checkbox'
import { defaultColors } from '../../../theme/colors'

const DamageCheck = ({ addNewDamage, damages, item, removeDamage }) => {
  const [checked, setChecked] = useState(false)

  const changeCheckedState = useCallback(() => {
    setChecked((prev) => {
      if (prev) {
        removeDamage(item[0])
      } else {
        addNewDamage(item[1], item[0])
      }
      return !prev
    })
  }, [addNewDamage, checked, item, removeDamage])

  useEffect(() => {
    setChecked(!!damages[item[0]])
  }, [item[0]])

  return (
    <DamageEntity key={item[0]}>
      <CheckBoxEl
        boxType="square"
        onChange={changeCheckedState}
        value={checked}
        tintColors={{ false: defaultColors.defaultBlack }}
      />
      <TouchableOpacity onPress={changeCheckedState}>
        <Label>{item[1]}</Label>
      </TouchableOpacity>
    </DamageEntity>
  )
}

export default DamageCheck

const DamageEntity = styled.TouchableOpacity`
  width: 45%;
  height: 50px;
  flex-direction: row;
`

const CheckBoxEl = styled(CheckBox)`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`
const Label = styled.Text`
  color: ${defaultColors.defaultBlack};
`
