import React, { useCallback, useContext } from 'react'
import styled from 'styled-components/native'
import { defaultColors } from '../../../theme/colors'

import { ContractContext } from '../../../providers/ContractProvider'
import DamageCheck from './DamageCheck'
import DamagesImage from './DamagesImage'

const Damages = ({ damageArr, damages, error }) => {
  const { damagePhotoArr, otherInfo, setOtherFields } = useContext(ContractContext)

  const addNewDamage = useCallback(
    (item, key) => {
      const photosIds = damagePhotoArr[key]?.map(({ id }) => id)
      setOtherFields('damages', {
        ...otherInfo?.damages,
        [key]: {
          damage_location: key,
          name: item,
          photos: photosIds,
          comments: '',
        },
      })
    },
    [otherInfo, setOtherFields, damagePhotoArr],
  )

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

  const removeDamage = useCallback(
    (key) => {
      const newDamage = otherInfo?.damages

      const withoutRemoved = Object.keys(newDamage).reduce((acc, keyEl) => {
        if (keyEl !== key) {
          acc[keyEl] = newDamage[keyEl]
        }
        return acc
      }, {})

      setOtherFields('damages', withoutRemoved)
    },
    [otherInfo, setOtherFields],
  )

  const renderDamages = useCallback(
    (item) => {
      return (
        <DamageCheck
          damages={otherInfo && otherInfo?.damages ? otherInfo?.damages : []}
          addNewDamage={addNewDamage}
          removeDamage={removeDamage}
          item={item}
          key={item[0]}
        />
      )
    },
    [addNewDamage, otherInfo, removeDamage],
  )

  return (
    <Container>
      <TabHeading>Damages</TabHeading>
      <Label>Choose damaged parts: </Label>
      <DamagesWrap>{Object.entries(damageArr)?.map(renderDamages)}</DamagesWrap>

      {Object.keys(damages).length !== 0 && <Label>Add comments to damages: </Label>}
      <DamagesImage
        error={error}
        editDamage={editDamage}
        damages={otherInfo && otherInfo?.damages ? otherInfo?.damages : []}
      />
    </Container>
  )
}

export default Damages

const Container = styled.View``

const TabHeading = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  margin-bottom: 40px;
  margin-top: 20px;
  color: ${defaultColors.defaultBlack};
`

const DamagesWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-right: 16px;
`

const Label = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 20px;
  color: ${defaultColors.defaultBlack};
`
