import React, { useCallback, useState } from 'react'

import styled from 'styled-components/native'
import { useFocusEffect } from '@react-navigation/native'
import { Alert, FlatList, Platform, Text } from 'react-native'
import Share from 'react-native-share'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { defaultColors } from '../../theme/colors'
import * as Storage from '../../utils/storage'
import { api } from '../../states/api/base'

const Invoices = () => {
  const [invoices, setInvoices] = useState([])
  const [page, setPage] = useState(1)

  const handleFetchInvoices = async () => {
    await api.v1
      .get(`invoices?page=${page}`)
      .then((response) => {
        setInvoices((prev) => [...prev, ...response.data.data.invoices])
      })
      .catch((err) => {
        console.log(err, 'err')
      })
  }

  const handleDownloadInvoice = async (invoiceId) => {
    const token = await Storage.getToken()
    const res = await api.v1.get(`invoices/${invoiceId}/download`, { responseType: 'blob' })

    const dirs = ReactNativeBlobUtil.fs.dirs

    ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: 'pdf',
      path: `${dirs.DocumentDir}/${res.data._data.blobId}.pdf`,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: res.data._data.blobId,
        description: 'File downloaded by download manager.',
        mime: 'application/pdf',
      },
    })
      .fetch('GET', `https://mydcsl.com/api/invoices/${invoiceId}/download`, {
        Authorization: 'Bearer ' + token,
      })
      .then((res) => {
        // in iOS, we want to save our files by opening up the saveToFiles bottom sheet action.
        // whereas in android, the download manager is handling the download for us.
        if (Platform.OS === 'ios') {
          const filePath = res.path()
          const options = {
            type: 'application/pdf',
            url: filePath,
            saveToFiles: true,
          }
          Share.open(options)
            .then(() => Alert.alert('Invoice downloaded successfully'))
            .catch((err) => console.log(err))
        }
      })
      .catch((err) => console.log('BLOB ERROR -> ', err))
  }

  useFocusEffect(
    useCallback(() => {
      handleFetchInvoices()
    }, [page]),
  )

  const renderItem = ({ item }) => {
    const statusColor = item.status === 'paid' ? defaultColors.green : defaultColors.orange
    return (
      <InvoiceWrap>
        <InvoiceContent>
          <MainText>{item.user_full_name}</MainText>
          <MainText>{item.formatted_id}</MainText>
          <Text>Gross amount: {item.total_gross}</Text>
          {item?.paid_on && <Text>Paid on: {item.paid_on}</Text>}
          <Status>
            <Text>Status:</Text>
            <InvoiceStatus color={statusColor}>
              <Text>{item.status}</Text>
            </InvoiceStatus>
          </Status>
        </InvoiceContent>
        <Button onPress={() => handleDownloadInvoice(item.id)}>
          <ButtonHeading>Download</ButtonHeading>
        </Button>
      </InvoiceWrap>
    )
  }

  return (
    <>
      <FlatList
        contentContainerStyle={{ backgroundColor: defaultColors.white }}
        data={invoices.length ? invoices : []}
        renderItem={renderItem}
        keyExtractor={(item) => 'invoice-' + item?.id}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={() => (
          <Header>
            <HeaderHeading>Invoices</HeaderHeading>
          </Header>
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => setPage((prevPage) => prevPage + 1)}
      />
    </>
  )
}

export default Invoices

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

const InvoiceWrap = styled.View`
  background: ${defaultColors.white};
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 30px;
  padding-right: 30px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-color: ${defaultColors.grey};
  border-bottom-width: 1px;
`

const Button = styled.TouchableOpacity`
  padding: 10px 10px;
  border-radius: 50px;
  background: ${defaultColors.grey};
`

const ButtonHeading = styled.Text`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 10px;
  text-align: center;
  color: #ffffff;
`
const InvoiceStatus = styled.View`
  background-color: ${({ color }) => color};
  border-radius: 10px;
  padding: 6px 15px;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
`

const InvoiceContent = styled.View``

const Status = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
`

const MainText = styled.Text`
  font-family: Roboto-Regular;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  color: ${defaultColors.black};
`
