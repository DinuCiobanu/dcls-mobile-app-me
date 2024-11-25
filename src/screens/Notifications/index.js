import React, { useContext, useEffect, useCallback, useState } from 'react'
import { TouchableOpacity } from 'react-native'

import styled from 'styled-components/native'
import moment from 'moment'
import { NotificationsContext } from '../../providers/NotificationsProvider'
import { defaultColors } from '../../theme/colors'

const Notifications = () => {
  const [unread, setUnread] = useState(0)
  const [limit, setLimit] = useState(5)

  const { markAllAsRead, markRead, notifications } = useContext(NotificationsContext)

  const seeAllNotifications = useCallback(() => {
    setLimit(notifications.length)
  }, [notifications])

  const unreadNotifications = useCallback(() => {
    let counter = 0
    notifications.forEach((notification) => {
      if (!notification.read) {
        counter++
      }
    })

    setUnread(counter)
  }, [notifications])

  useEffect(() => {
    unreadNotifications()
  }, [notifications, unreadNotifications])

  const renderNotification = useCallback(
    (item, index) => {
      if (index + 1 > limit) return

      return (
        <NotificationWrap key={index} onPress={() => markRead(index)}>
          <NotificationWrapCheck active={item.read === false} />

          <NotificationWrapTitle>
            <Bolded>DCS </Bolded>
            {item.name}
            <Bolded> {moment(item.timestamp).fromNow()}</Bolded>
          </NotificationWrapTitle>
        </NotificationWrap>
      )
    },
    [limit, markRead],
  )

  return (
    <Container>
      <ScrollArea
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
      >
        <Header>
          <HeaderHeading>Notifications</HeaderHeading>
          <HeaderSubHeading>You have {unread} unread notifications</HeaderSubHeading>
        </Header>

        <Wrap>
          {notifications?.length > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <MarkAll>Mark all as read</MarkAll>
            </TouchableOpacity>
          )}

          {notifications?.map(renderNotification)}

          {notifications?.length > limit && (
            <TouchableOpacity onPress={seeAllNotifications}>
              <ShowMore>View all</ShowMore>
            </TouchableOpacity>
          )}
        </Wrap>
      </ScrollArea>
    </Container>
  )
}

export default Notifications

const Container = styled.ScrollView`
  flex: 1;
  background: ${defaultColors.white};
`

const Header = styled.View`
  width: 100%;
  background: ${defaultColors.defaultBlack};
  padding: 75px 0 40px;
`

const HeaderHeading = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 35px;
  color: ${defaultColors.white};
  margin: 0 30px;
`

const HeaderSubHeading = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  color: ${defaultColors.grey};
  margin: 2px 30px 0;
`

const Wrap = styled.View`
  background: ${defaultColors.white};
  padding: 20px 30px 0;
  flex: 1;
`

const MarkAll = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: ${defaultColors.grey};
  margin-bottom: 5px;
`

const ShowMore = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: ${defaultColors.grey};
  margin-top: 5px;
  text-align: center;
`

const NotificationWrap = styled.TouchableOpacity`
  padding: 15px 0;
  flex-direction: row;
  align-items: center;
`

const NotificationWrapTitle = styled.Text`
  margin-left: 24px;
  font-family: Roboto-Regular;
  font-style: normal;
  font-size: 14px;
  line-height: 16px;
  color: ${defaultColors.defaultBlack};
`

const Bolded = styled.Text`
  font-weight: bold;
  font-family: Roboto-Regular;
  font-style: normal;
  font-size: 14px;
  line-height: 16px;
  color: ${defaultColors.defaultBlack};
`

const NotificationWrapCheck = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 100px;
  background-color: ${({ active }) => (active ? defaultColors.black : defaultColors.darkGrey)};
`

const ScrollArea = styled.ScrollView``
