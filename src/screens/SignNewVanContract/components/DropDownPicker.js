import React, { useState, useCallback, useContext, useMemo } from 'react'
import { TouchableWithoutFeedback, View, Platform, StyleSheet } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { ContractContext } from '../../../providers/ContractProvider'
import { defaultColors } from '../../../theme/colors'

const DropDown = ({ error, fieldNum, placeholder, searchPlaceholder }) => {
  const [opened, setOpened] = useState(false)
  const [value, setValue] = useState(null)

  const { contractData, otherInfo, setOtherFields } = useContext(ContractContext)

  const setInspected = useCallback(() => {
    const key = 'value'
    const newArr = []
    Object.values(contractData?.fields?.other_fields?.[fieldNum].options).forEach((item) => {
      newArr.push({
        value: item,
        label: item,
      })
    })
    // todo data duplication should be fixed from BE
    const arrayUniqueByKey = [...new Map(newArr.map((item) => [item[key], item])).values()]
    return arrayUniqueByKey
  }, [])

  const inspectedOptions = useMemo(() => setInspected(), [])

  const setInspectedBy = useCallback(
    (val) => {
      if (val) {
        Object.entries(contractData?.fields?.other_fields?.[fieldNum]?.options).forEach((opt) => {
          if (opt[1].toLowerCase() === val().toLowerCase()) {
            setOtherFields(contractData?.fields?.other_fields?.[fieldNum].slug, opt[0])
          }
        })
      }
      setValue(val())
    },
    [contractData?.fields?.other_fields, setOtherFields],
  )

  const isError = error && otherInfo && !otherInfo[contractData?.fields?.other_fields?.[fieldNum].slug]

  return (
    <>
      {Platform.OS === 'android' ? (
        <View style={styles.margin}>
          <TouchableWithoutFeedback>
            <DropDownPicker
              style={{ borderColor: isError ? 'red' : defaultColors.grey }}
              open={opened}
              searchable
              setOpen={setOpened}
              value={value}
              items={inspectedOptions}
              setValue={setInspectedBy}
              listMode={'SCROLLVIEW'}
              placeholder={placeholder}
              searchPlaceholder={searchPlaceholder}
            />
          </TouchableWithoutFeedback>
        </View>
      ) : (
        <View style={styles.container}>
          <DropDownPicker
            style={{ borderColor: isError ? 'red' : defaultColors.grey }}
            containerStyle={styles.dropDown}
            dropDownContainerStyle={styles.dropDownContainer}
            open={opened}
            searchable
            setOpen={setOpened}
            value={value}
            items={inspectedOptions}
            setValue={setInspectedBy}
            listMode={'SCROLLVIEW'}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            zIndex={4000}
          />
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  margin: {
    marginBottom: 20,
  },
  container: {
    zIndex: 100,
    elevation: 10,
    marginBottom: 20,
  },
  dropDownContainer: {
    backgroundColor: defaultColors.white,
    zIndex: 100,
    height: 170,
  },
  dropDown: { zIndex: 100, elevation: 10 },
})

export default DropDown
