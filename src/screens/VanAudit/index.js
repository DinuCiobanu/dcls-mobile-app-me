import React, { useState, useCallback, useContext, useEffect } from 'react'

import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { icons } from '../../assets/icons'
import { defaultColors } from '../../theme/colors'
import { monthNames } from '../../utils/dates'
import { AuditContext } from '../../providers/AuditProvider'
import { ContractContext } from '../../providers/ContractProvider'
import { storeSelector } from '../../states/storeSelectors'

const VanAudit = ({ navigation }) => {
  const [limit, setLimit] = useState(6)
  const currentUser = useSelector(storeSelector.auth.selectCurrentUser)
  const refresh = useSelector(storeSelector.auth.selectToken)
  const { getAuditFields } = useContext(AuditContext)
  const { getContractFields } = useContext(ContractContext)

  useEffect(() => {
    async function fetchData() {
      if (refresh) {
        await getAuditFields()
        await getContractFields()
      }
    }
    fetchData()
  }, [refresh])

  const onMoreAudits = useCallback(() => {
    setLimit(limit + 3)
  }, [limit])

  const navigateToCreateNewVan = useCallback(() => {
    navigation.navigate('createVanAudit')
  }, [navigation])

  const signContractNavigate = useCallback(() => {
    navigation.navigate('signContract')
  }, [navigation])

  const navigateToAudit = useCallback(
    (id) => {
      navigation.navigate('singleAudit', {
        id: id,
      })
    },
    [navigation],
  )

  const date = moment()

  const first = date.clone().startOf('week').format('DD')
  const thisMonth = date.clone().startOf('week').format('MM')
  const last = date.clone().endOf('week').format('DD')
  const nextMonth = date.clone().endOf('week').format('MM')

  return (
    <Container edges={['top']}>
      <ScrollArea
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
      >
        <Header>
          <Content>
            <TextBlock>
              <Greeting>Your Van Audits</Greeting>
            </TextBlock>
          </Content>

          <SecondContentBar>
            <TextBlock>
              <CurrentVanHeading>Current van assigned to you</CurrentVanHeading>
              <VanName>
                {currentUser?.assignedVan?.model}
                {' - '}
                {currentUser?.assignedVan?.registrationPlate}
              </VanName>
            </TextBlock>
          </SecondContentBar>
        </Header>

        <Wrap>
          {currentUser?.canCreateVanContract && (
            <>
              <TabHeading>Sign VAN contract</TabHeading>

              <AddNewVanButton onPress={signContractNavigate}>
                <AddNewVanButtonHeading>Sign Contract</AddNewVanButtonHeading>
              </AddNewVanButton>
            </>
          )}

          <TabHeading>This week audit</TabHeading>
          <AddNewVanAudit>
            <RefreshIcon source={icons.vanAudit.refresh} />
            <AddNewVanText>
              {monthNames[parseInt(thisMonth - 1)]} {first} - {monthNames[parseInt(nextMonth - 1)]} {last},{' '}
              {date.year()}
            </AddNewVanText>
          </AddNewVanAudit>

          {currentUser?.canCreateVanAudit ? (
            <AddNewVanButton onPress={navigateToCreateNewVan}>
              <AddNewVanButtonHeading>New Van Audit</AddNewVanButtonHeading>
            </AddNewVanButton>
          ) : (
            <NoVan>You have no van assigned</NoVan>
          )}

          {currentUser?.audits?.length > 0 && <TabHeading>History of previous audits</TabHeading>}
          <PreviousArea>
            {currentUser?.audits?.map((item, index) => {
              if (index + 1 > limit) return null
              const dates = moment(item.createdAt, 'DD-MM-YYYY')

              const first = dates.clone().startOf('week').format('DD')
              const thisMonth = dates.clone().startOf('week').format('MM')
              const last = dates.clone().endOf('week').format('DD')
              const nextMonth = dates.clone().endOf('week').format('MM')

              return (
                <TouchableOpacity key={item.id} onPress={() => navigateToAudit(item.id)}>
                  <AuditEntity>
                    <AuditEntityIcon source={icons.vanAudit.check} />
                    <AuditEntityTitle>
                      {monthNames[parseInt(thisMonth - 1)]} {first} - {monthNames[parseInt(nextMonth - 1)]} {last} ,{' '}
                      {dates.year()}
                    </AuditEntityTitle>
                  </AuditEntity>
                  {(limit < currentUser?.audits?.length ? limit - 1 : currentUser?.audits?.length - 1) !== index && (
                    <HorizontalLine />
                  )}
                </TouchableOpacity>
              )
            })}
            {limit < currentUser?.audits?.length ? (
              <TouchableOpacity onPress={onMoreAudits}>
                <MoreButton>More</MoreButton>
              </TouchableOpacity>
            ) : (
              <BottomPlaceholder />
            )}
          </PreviousArea>
        </Wrap>
      </ScrollArea>
    </Container>
  )
}

export default VanAudit

const Container = styled(SafeAreaView)`
  flex: 1;
  background: ${defaultColors.defaultBlack};
`

const Header = styled.View`
  width: 100%;
  height: 163px;
  background: ${defaultColors.defaultBlack};
`

const Content = styled.View`
  margin: 0px 20px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const SecondContentBar = styled.View`
  margin: 25px 20px 0;
  display: flex;
  flex-direction: row;
`

const TextBlock = styled.View`
  margin-left: 15px;
`

const NoVan = styled.Text`
  font-size: 18px;
  margin-bottom: 40px;
  color: ${defaultColors.defaultBlack};
`

const Greeting = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 35px;
  color: ${defaultColors.white};
`

const Wrap = styled.View`
  background: ${defaultColors.white};
  padding: 40px 30px 0;
`

const CurrentVanHeading = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  color: ${defaultColors.grey};
`

const VanName = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: ${defaultColors.darkGrey};
  padding-bottom: 65px;
  margin-top: 5px;
`

const TabHeading = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  margin-bottom: 20px;
  color: ${defaultColors.defaultBlack};
`

const AddNewVanAudit = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`

const RefreshIcon = styled.Image``

const AddNewVanText = styled.Text`
  margin-left: 15px;
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: ${defaultColors.defaultBlack};
`

const AddNewVanButton = styled.TouchableOpacity`
  padding: 15px 0;
  width: 100%;
  border-radius: 50px;
  justify-content: center;
  margin-bottom: 60px;
  background: ${defaultColors.grey};
`

const AddNewVanButtonHeading = styled.Text`
  text-align: center;
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: ${defaultColors.white};
`

const AuditEntity = styled.View`
  flex-direction: row;
  align-items: center;
`

const AuditEntityIcon = styled.Image``

const AuditEntityTitle = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  margin-left: 15px;
  color: ${defaultColors.defaultBlack};
`

const HorizontalLine = styled.View`
  width: 100%;
  height: 1px;
  background: ${defaultColors.darkGrey};
  margin: 23.5px 0;
`

const PreviousArea = styled.View``

const ScrollArea = styled.ScrollView`
  flex: 1;
  background: ${defaultColors.white};
`

const MoreButton = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: ${defaultColors.grey};
  margin: 23px 0 36px;
  text-align: center;
`

const BottomPlaceholder = styled.View`
  height: 36px;
  width: 100%;
`
