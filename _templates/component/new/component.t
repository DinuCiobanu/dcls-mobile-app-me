---
to: src/components/<%= name %>.tsx
---

import React from 'react'
import { Text, View } from 'react-native'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface <%= name %>Props {}

export const <%= name %>: React.FC<<%= name %>Props> = () => {
  return (
    <View>
      <Text>Component Generator</Text>
      <Text><%= name %></Text>
    </View>
  )
}
