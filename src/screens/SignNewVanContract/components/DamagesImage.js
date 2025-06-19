import React, { useCallback } from 'react'

import styled from 'styled-components/native'

import DamageEntity from './DamageEntity'

const DamagesImage = ({ damages, editDamage, error, navigation }) => {
  const renderDamages = useCallback(
    (item, index) => {
      return <DamageEntity error={!item[1]?.photos || error}  navigation={navigation} editTheImage={editDamage} key={index} item={item} />
    },
    [editDamage, error],
  )

  return <Container>{Object.entries(damages).map(renderDamages)}</Container>
}

export default DamagesImage

const Container = styled.View`
  width: 100%;
`
