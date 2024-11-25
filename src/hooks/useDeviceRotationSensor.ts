import { useLayoutEffect, useState } from 'react'
import { Platform } from 'react-native'

import { gravity } from 'react-native-sensors'

type Rotation = 'top' | 'down' | 'right' | 'left'

export const useDeviceRotationSensor = () => {
  const [orientation, setOrientation] = useState('portrait')

  useLayoutEffect(() => {
    // We use gravity sensor here because react-native-orientation
    // can't detect landscape orientation when the device's orientation is locked
    const subscription = gravity.subscribe(({ x, y }) => {
      const radian = Math.atan2(y, x)
      const degree = (radian * 180) / Math.PI

      let rotation: Rotation = 'left'
      if (degree > -135) rotation = 'top'
      if (degree > -45) rotation = 'right'
      if (degree > 45) rotation = 'down'
      if (degree > 135) rotation = 'left'

      if (Platform.OS === 'android') {
        rotation = 'left'
        if (degree > -135) rotation = 'down'
        if (degree > -45) rotation = 'right'
        if (degree > 45) rotation = 'top'
        if (degree > 135) rotation = 'left'
      }

      if (rotation === 'top') setOrientation('portrait')
      if (rotation === 'right') setOrientation('landscape-left')
      if (rotation === 'down') setOrientation('portrait')
      if (rotation === 'left') setOrientation('landscape-right')
    })
    return () => subscription.unsubscribe()
  }, [])

  return { orientation }
}
