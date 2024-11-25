import React, { useCallback, useContext, useEffect } from 'react'

import { Linking, StatusBar, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import RNFS from 'react-native-fs'
import styled from 'styled-components/native'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import deviceInfoModule from 'react-native-device-info'
import { icons } from '../../assets/icons'
import { monthNames } from '../../utils/dates'
import { defaultColors } from '../../theme/colors'

import { TimeModal } from '../../components/Modals/TimeModal'
import { ModalContext } from '../../components/Modal/ModalProvider'
import ModalRoot from '../../components/Modal/Modal'
import { storeSelector } from '../../states/storeSelectors'
import { storeActions } from '../../states/storeActions'
import { clearToken } from '../../utils/storage'
import { TimerContext } from '../../providers/TimerProvider'
import { NewTimer } from '../../components/Timer/NewTimer'

const Home = ({ navigation }: any): React.ReactElement => {
  const currentUser = useSelector(storeSelector.auth.selectCurrentUser)

  const { showModal } = useContext(ModalContext)
  const timerCtx = useContext(TimerContext)
  const dispatch = useDispatch()

  const version = deviceInfoModule.getVersion()
  const buildNumber = deviceInfoModule.getBuildNumber()

  const vanAuditNavigate = useCallback(() => {
    navigation.navigate('vanAuditStack')
  }, [navigation])

  useEffect(() => {
    if (currentUser?.site?.arrivesToWork) {
      let now: string | string[] = moment(moment.now()).format('HH:mm:ss')
      let start: string | string[] = currentUser?.site?.arrivesToWork

      now = now.split(':')
      start = start.split(':')

      const isShowModal =
        parseFloat(now[0]) === parseFloat(start[0]) ||
        parseFloat(now[0]) + 1 === parseFloat(start[0]) ||
        parseFloat(now[0]) - 1 === parseFloat(start[0])

      if (isShowModal && !timerCtx?.timerOn) showModal(TimeModal)
    }
  }, [currentUser])

  const navigateToAudit = useCallback(
    (id: any) => {
      navigation.navigate('singleAudit', {
        id: id,
      })
    },
    [navigation],
  )

  const clearCache = useCallback(async () => {
    const files = await RNFS.readDir(RNFS.DocumentDirectoryPath)

    for await (const file of files) {
      if (file.path.includes('jpg')) {
        await RNFS.unlink(file.path)
      }
    }
  }, [])

  const onPressGoToWebsite = useCallback(() => {
    Linking.openURL('https://mydcsl.com/admin')
  }, [])

  const handleLogout = useCallback(async () => {
    await clearToken()
    dispatch(storeActions.auth.clearData())
    dispatch(storeActions.contract.clearData())
    clearCache()
  }, [])

  return (
    <Container edges={['top']}>
      <ModalRoot />

      <StatusBar barStyle={'light-content'} translucent backgroundColor="transparent" />
      <ScrollArea
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
      >
        <Header>
          <Content>
            <Avatar source={icons.home.avatar} />
            <GreetingBlock>
              <Greeting>Hi, {currentUser?.name}</Greeting>
            </GreetingBlock>
          </Content>

          <SecondContentBar>
            <Placeholder />
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

        <Wrap style={{ minHeight: Dimensions.get('window').height - 430 }}>
          <View>
            <TabHeading>Today’s Time Tracking</TabHeading>
            <TimerWrap>
              <NewTimer isHomeScreen={true} />
            </TimerWrap>

            <Text>{currentUser?.name}</Text>

            {currentUser?.audits && currentUser?.audits?.length > 0 && (
              <>
                <TabHeading>Your Van Audits</TabHeading>

                <AuditsWrap>
                  <AuditsWrapScroll horizontal={true} showsHorizontalScrollIndicator={false} bounces={false}>
                    {currentUser?.audits?.map((item, index) => {
                      if (index > 4) return null
                      const dates = moment(item.createdAt, 'DD-MM-YYYY')

                      const first = dates.clone().startOf('week').format('DD')
                      const thisMonth = dates.clone().startOf('week').format('MM')
                      const last = dates.clone().endOf('week').format('DD')
                      const nextMonth = dates.clone().endOf('week').format('MM')

                      return (
                        <AuditWrap key={item.id} onPress={() => navigateToAudit(item.id)}>
                          <AuditImg source={icons.vanAudit.photoPlaceholder} />
                          <AuditText>
                            {monthNames[parseInt(thisMonth) - 1]} {first} - {monthNames[parseInt(nextMonth) - 1]} {last}
                            , {dates.year()}
                          </AuditText>
                        </AuditWrap>
                      )
                    })}
                  </AuditsWrapScroll>
                </AuditsWrap>

                <SeeAllWrap onPress={vanAuditNavigate}>
                  <SeeAll>See all</SeeAll>
                </SeeAllWrap>
              </>
            )}
          </View>
          <GoToWebsiteButton onPress={onPressGoToWebsite}>
            <GoToWebsiteText>Go to website</GoToWebsiteText>
          </GoToWebsiteButton>
        </Wrap>

        <View style={{ backgroundColor: defaultColors.white }}>
          <LogoutButton onPress={handleLogout}>
            <GoToWebsiteText>Log out</GoToWebsiteText>
          </LogoutButton>
          <VersionText>{version + '.' + buildNumber}</VersionText>
        </View>
      </ScrollArea>
    </Container>
  )
}

export default Home

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${defaultColors.defaultBlack};
`

const ScrollArea = styled.ScrollView`
  background-color: ${defaultColors.white};
`

const Header = styled.View`
  width: 100%;
  background: ${defaultColors.defaultBlack};
`

const TimerWrap = styled.View`
  margin-bottom: 60px;
`

const Content = styled.View`
  margin: 0px 30px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const SecondContentBar = styled.View`
  margin: 15px 30px 0;
  display: flex;
  flex-direction: row;
`

const Avatar = styled.Image`
  width: 60px;
  height: 60px;
`

const Placeholder = styled.View`
  width: 60px;
  height: 60px;
`

const Greeting = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 35px;
  color: ${defaultColors.white};
`

const GreetingBlock = styled.View`
  padding-left: 15px;
  width: 80%;
`

const TextBlock = styled.View`
  margin-left: 15px;
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
  padding-bottom: 50px;
  margin-top: 5px;
`

const Wrap = styled.View`
  flex: 1;
  background: white;
  padding: 40px 30px 0;
  flex-direction: column;
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

const AuditWrap = styled(TouchableOpacity)`
  margin-right: 10px;
`

const AuditImg = styled.Image`
  width: 150px;
  height: 120px;
  resize-mode: cover;
`
const AuditText = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #efefef;
  position: relative;
  top: -30px;
  left: 10px;
`

const AuditsWrapScroll = styled.ScrollView``

const AuditsWrap = styled.View``

const SeeAllWrap = styled(TouchableOpacity)`
  margin-top: 10px;
`

const SeeAll = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: ${defaultColors.grey};
  text-align: right;
`

const GoToWebsiteButton = styled(TouchableOpacity)`
  padding: 15px 0;
  width: 100%;
  border-radius: 50px;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  background: ${defaultColors.grey};
`
const GoToWebsiteText = styled.Text`
  text-align: center;
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: ${defaultColors.white};
`

const VersionText = styled.Text`
  align-self: center;
  color: ${defaultColors.grey};
  padding-bottom: 30px;
`

const LogoutButton = styled(GoToWebsiteButton)`
  width: 140px;
  align-self: center;
`
