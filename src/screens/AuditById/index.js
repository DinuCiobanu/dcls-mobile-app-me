import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { View } from 'react-native'
import moment from 'moment'
import { AuditContext } from '../../providers/AuditProvider'

import { defaultColors } from '../../theme/colors'
import AddImageContainer from '../CreateNewVan/AddImage'

import { monthNames } from '../../utils/dates'

const headings = {
  audit_interior_images: 'Interior Photos',
  audit_exterior_images: 'Exterior Photos',
}

const AuditById = ({ route }) => {
  const { id } = route.params
  const { getAuditById } = useContext(AuditContext)
  const [audit, setAudit] = useState({})
  const [currentRange, setCurrentRange] = useState({
    first: 0,
    thisMonth: 0,
    last: 0,
    nextMonth: 0,
    year: 0,
  })

  const getAudit = useCallback(async () => {
    const res = await getAuditById(id)
    const date = moment(res.data.audit.created_at, 'DD-MM-YYYY')
    setCurrentRange({
      first: date.clone().startOf('week').format('DD'),
      thisMonth: date.clone().startOf('week').format('MM'),
      last: date.clone().endOf('week').format('DD'),
      nextMonth: date.clone().endOf('week').format('MM'),
      year: date.year(),
    })

    setAudit(res.data.audit)
  }, [getAuditById])

  useEffect(() => {
    getAudit()
  }, [getAudit])

  return (
    <Container>
      <ScrollArea
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
      >
        <Heading>Your Van Audit</Heading>
        <SubHeading>
          {monthNames[parseInt(currentRange.thisMonth) - 1]} {currentRange.first} -{' '}
          {monthNames[parseInt(currentRange.nextMonth) - 1]} {currentRange.last} , {currentRange.year}
        </SubHeading>
        {Object.keys(audit?.images || {}).map((key, index2) => {
          // eslint-disable-next-line array-callback-return
          if (key === 'other_fields') return

          return (
            <View key={key}>
              <TabSubHeading>{headings[key]}</TabSubHeading>

              <ImageContainer>
                {(audit?.images?.[key] || {}).map((item, index) => {
                  return (
                    <AddImageContainer
                      key={index}
                      item={item}
                      colIndex={index2}
                      index={index}
                      img={item.image_path}
                      auditShow={true}
                    />
                  )
                })}
              </ImageContainer>
            </View>
          )
        })}
      </ScrollArea>
    </Container>
  )
}

export default AuditById

const Container = styled.View`
  height: 100%;
  background: ${defaultColors.white};
  padding: 30px 30px 0;
  flex-direction: column;
`

const Heading = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 35px;
  margin: 22px 0 5px;
  color: ${defaultColors.defaultBlack};
`

const SubHeading = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  color: #3d3d3d;
  position: relative;
  margin-bottom: 40px;
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

const ImageContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 20px 0;
`

const ScrollArea = styled.ScrollView``
