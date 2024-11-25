import { Svg, Circle } from 'react-native-svg'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { icons } from '../../assets/icons'

const CircularProgress = ({
  style = { margin: 10 },
  size = 20,
  strokeWidth = 2,
  progressPercent = 5,
  bgColor = 'black',
  pgColor = 'gray',
  icon = icons.timeTracking.resume,
  pause = true,
}) => {
  const radius = (parseFloat(size) - parseFloat(strokeWidth, 10)) / 2
  const circum = radius * 2 * Math.PI
  const svgProgress = 100 - parseFloat(progressPercent)

  const strokeDashoffset = radius * Math.PI * 2 * (svgProgress / 100)
  return (
    <View style={style}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          stroke={bgColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={parseFloat(strokeWidth, 10) > 0 ? parseFloat(strokeWidth, 10) : 2}
        />

        {/* Progress Circle */}
        <Circle
          stroke={pgColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={`${circum} ${circum}`}
          strokeDashoffset={parseFloat(strokeDashoffset, 10) >= 0 ? parseFloat(strokeDashoffset, 10) : 2}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          {...{ strokeWidth }}
        />
        <PauseWrap size={size} isPaused={!pause}>
          <PauseIcon source={icon} />
        </PauseWrap>
      </Svg>
    </View>
  )
}

export default CircularProgress

const PauseWrap = styled.View`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  margin-left: ${({ isPaused }) => (isPaused ? '2px' : '0px')};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const PauseIcon = styled.Image``
