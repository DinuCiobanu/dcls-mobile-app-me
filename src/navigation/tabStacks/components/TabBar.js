import React, { useCallback } from 'react'
import { TouchableOpacity, Platform } from 'react-native'
import styled from 'styled-components/native'
import { TabIcon } from '../TabIcon'
import { defaultColors } from '../../../theme/colors'
import { icons } from '../../../assets/icons'

const tabNames = [
  { key: 0, title: 'Home' },
  { key: 1, title: 'Time tracking' },
  { key: 2, title: 'Van audit' },
  { key: 3, title: 'Notifications' },
  { key: 4, title: 'Invoices' },
]

const TabBar = ({ navigation: { navigate }, state: { index: activeTab, routeNames } }) => {
  const handleTabPress = useCallback(
    (route) => () => {
      navigate(route)
    },
    [navigate],
  )

  const renderTab = useCallback(
    (route, index) => {
      return (
        <Wrap key={index}>
          <TouchableOpacity onPress={handleTabPress(route)}>
            {activeTab === index ? (
              <Entity active={activeTab === index}>
                <TabIcon icon={icons.tabBarActive[index].ico} />
                <Heading active={true}>{tabNames[index].title}</Heading>
              </Entity>
            ) : (
              <Entity active={activeTab === index}>
                <TabIcon icon={icons.tabBar[index].ico} />
                <Heading>{tabNames[index].title}</Heading>
              </Entity>
            )}
          </TouchableOpacity>
        </Wrap>
      )
    },
    [handleTabPress, activeTab],
  )
  return (
    <Container
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      {routeNames.map(renderTab)}
    </Container>
  )
}

export default TabBar

const Container = styled.View`
  height: 75px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  z-index: 10;
  background: ${defaultColors.white};
`

const Wrap = styled.View`
  background: ${Platform.OS === 'ios' ? 'transparent' : defaultColors.white};
  box-shadow: 0px -2px 15px rgba(0, 0, 0, 0.09);
  padding: ${Platform.OS === 'ios' ? '-35px 15px 0' : '15px 15px 15px'};
  flex-direction: row;
  justify-content: space-around;
`

const Entity = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
`

const Heading = styled.Text`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  color: ${({ active }) => (active ? defaultColors.black : defaultColors.grey)};
`
