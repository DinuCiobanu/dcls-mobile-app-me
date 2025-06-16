import { useLayoutEffect, useState } from 'react'
import { Dimensions } from 'react-native'

// import {gravity} from 'react-native-sensors'

type Rotation = 'top' | 'down' | 'right' | 'left'

const appGravity = {
  subscribe(cb: any) {
    let sub = {
      unsubscribe() {},
    }
    try {
      // let Sensors = require('react-native-sensors')
      // sub = accelerometer.subscribe(cb)
    } catch (error) {
      console.log('50-57', error)
    }
    return sub
  },
}
export const useDeviceRotationSensor = () => {
  const [orientation, setOrientation] = useState('portrait')

  useLayoutEffect(() => {
    const onChange = ({ window }: any) => {
      const isPortrait = window.height >= window.width
      let rotation = isPortrait ? 'top' : 'left'

      if (rotation === 'top') setOrientation('portrait')
      if (rotation === 'right') setOrientation('landscape-left')
      if (rotation === 'down') setOrientation('portrait')
      if (rotation === 'left') setOrientation('landscape-right')
    }

    const subscription = Dimensions.addEventListener('change', onChange)

    return () => {
      subscription.remove()
    }
  }, [])
  // useLayoutEffect(() => {
  //   // We use gravity sensor here because react-native-orientation
  //   // can't detect landscape orientation when the device's orientation is locked
  //   //@ts-ignore
  //   const subscription = appGravity.subscribe(({ x, y }) => {
  //     const radian = Math.atan2(y, x)
  //     const degree = (radian * 180) / Math.PI

  //     let rotation: Rotation = 'left'
  //     if (degree > -135) rotation = 'top'
  //     if (degree > -45) rotation = 'right'
  //     if (degree > 45) rotation = 'down'
  //     if (degree > 135) rotation = 'left'

  //     if (Platform.OS === 'android') {
  //       rotation = 'left'
  //       if (degree > -135) rotation = 'down'
  //       if (degree > -45) rotation = 'right'
  //       if (degree > 45) rotation = 'top'
  //       if (degree > 135) rotation = 'left'
  //     }

  //     if (rotation === 'top') setOrientation('portrait')
  //     if (rotation === 'right') setOrientation('landscape-left')
  //     if (rotation === 'down') setOrientation('portrait')
  //     if (rotation === 'left') setOrientation('landscape-right')
  //   })
  //   return () => subscription.unsubscribe()
  // }, [])

  return { orientation }
}
