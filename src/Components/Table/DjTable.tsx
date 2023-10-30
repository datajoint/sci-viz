import React, { useContext, useEffect, useRef, useState } from 'react'
import { Card, PaginationProps, Spin, Table, TablePaginationConfig } from 'antd'
import type { FilterValue } from 'antd/es/table/interface'
import { useQuery } from 'react-query'
import { MenuItemsContext } from '../SciViz/SciViz'
import { TabItem } from '../SciViz/SciVizInterfaces'

interface RestrictionStore {
    [key: string]: Array<string>
}

interface DjTableProps {
    token: string
    route: string
    name: string
    height: number
    restrictionList: Array<string>
    link?: string
    updatePageStore: (key: string, record: Array<string>) => void
    updateHiddenPage?: (
        route: string,
        queryParams: string,
        currPageMap: {
            [key: string]: TabItem
        }
    ) => void
    channel?: string
    channelList?: Array<string>
    store?: RestrictionStore
    databaseHost?: string
    pageSizeDefault?: number
}

interface DjTableState {
    columns: Array<{}>
    data: Array<{}>
    fullUnq: {
        text: string
        value: string | number
    }[][]
    numberOfTuples: number
    offset: number | undefined
    filter: { [key: string]: djFilter }
    sorter: Array<string>
    keys: Array<string> | undefined
    selectedRow: React.Key[]
    loading: boolean
}

interface djAttributesArray {
    [index: number]: string
    name: string
    type: string
    nullable: boolean
    default: string
    autoincriment: boolean
}
interface djAttributes {
    attributeHeaders: Array<string>
    attributes: {
        primary: Array<djAttributesArray>
        secondary: Array<djAttributesArray>
    }
}
interface djUniques {
    unique_values: {
        primary: Array<{ text: string; value: string | number }[]>
        secondary: Array<{ text: string; value: string | number }>
    }
}

interface djRecords {
    recordHeader: Array<string>
    records: Array<Array<number | null | bigint | boolean | string>>
    totalCount: number
}

interface djFilter {
    filteredValue: FilterValue | null
    filtered: boolean
    restriction: string
}

/**
 * DjTable component
 */
function DjTable({
    token,
    route,
    name,
    height,
    restrictionList,
    link,
    updatePageStore,
    updateHiddenPage,
    channel,
    channelList,
    store,
    databaseHost,
    pageSizeDefault
}: DjTableProps) {
    const [state, setState] = useState<DjTableState>({
        columns: [],
        data: [],
        fullUnq: [],
        numberOfTuples: pageSizeDefault || 5,
        offset: 1,
        filter: {},
        sorter: [],
        keys: undefined,
        selectedRow: [0],
        loading: false
    })
    const prevPropsRef = useRef<RestrictionStore | undefined>()
    const pageMap = useContext(MenuItemsContext)

    const handleChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: any //must use any here due to antd callback design
    ) => {
        let filter: { [key: string]: djFilter } = {}
        let isFilterNull = true

        for (const key in filters) {
            if (filters[key] !== null) {
                filter[`${key}`] = {
                    filteredValue: filters[key],
                    restriction: `${key}=${filters[key]}`,
                    filtered: true
                }
                isFilterNull = false
            }
        }

        let sorterArr: string[] = []

        let isSorterNull = true

        if (sorter['order'] !== null && sorter['field'] !== null) {
            isSorterNull = false
            let sort = ''
            if (sorter['order'] === 'ascend') {
                sort = 'ASC'
            } else if (sorter['order'] === 'descend') {
                sort = 'DESC'
            }
            sorterArr.push(`${sorter['field']} ${sort}`)
        }

        let offset = pagination.current

        if (isFilterNull) {
            setState((prevState) => ({
                ...prevState,
                offset: offset,
                filter: {}
            }))
        } else {
            setState((prevState) => ({
                ...prevState,
                offset: offset,
                filter: filter
            }))
        }

        if (isSorterNull) {
            setState((prevState) => ({
                ...prevState,
                offset: offset
            }))
        } else {
            setState((prevState) => ({
                ...prevState,
                offset: offset,
                sorter: sorterArr
            }))
        }
    }

    const constructRecordURL = (): string => {
        let queryParamList = [...restrictionList]
        let channelCheckArr = Array<boolean>()

        channelList?.forEach((element) => {
            if (store![element]) {
                channelCheckArr.push(true)
            } else {
                channelCheckArr.push(false)
            }
        })

        for (let i in channelList) {
            if (typeof store![channelList[+i]] != undefined) {
                queryParamList = queryParamList.concat(store![channelList[+i]])
            }
        }
        if (queryParamList.indexOf('') !== -1) {
            queryParamList.splice(queryParamList.indexOf(''), 1)
        }

        let apiUrl = `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + route

        if (
            !state.sorter.join(',').includes('ASC') &&
            !state.sorter.join(',').includes('DESC')
        ) {
            let params: Record<string, string> = {
                page: String(state.offset),
                limit: String(state.numberOfTuples)
            }
            let queryString = new URLSearchParams(params).toString()
            apiUrl = apiUrl + '?' + queryString
        } else {
            let params: Record<string, string> = {
                page: String(state.offset),
                limit: String(state.numberOfTuples),
                order: state.sorter.join(',')
            }
            let queryString = new URLSearchParams(params).toString()
            apiUrl = apiUrl + '?' + queryString
        }

        if (queryParamList.length) {
            apiUrl = apiUrl + '&' + queryParamList.join('&')
        }

        if (Object.keys(state.filter).length !== 0) {
            for (const key of Object.keys(state.filter)) {
                apiUrl = apiUrl + '&' + state.filter[key].restriction
            }
        }

        if (databaseHost) {
            apiUrl = apiUrl.concat(`&database_host=${databaseHost}`)
        }

        return apiUrl
    }
    const getRecords = (): Promise<djRecords> => {
        return fetch(constructRecordURL(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        })
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                return result as Promise<djRecords>
            })
    }
    const recordsQuery = useQuery(`${constructRecordURL()}_table`, getRecords, {
        enabled: !(
            store &&
            channelList &&
            !channelList.every((val) => Object.keys(store!).includes(val))
        ),
        refetchOnWindowFocus: false
    })

    const getAttributes = (): Promise<djAttributes> => {
        let apiUrlAttr =
            `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + route + '/attributes'

        if (databaseHost) {
            apiUrlAttr = apiUrlAttr.concat(`&database_host=${databaseHost}`)
        }

        return fetch(apiUrlAttr, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        })
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                return result as Promise<djAttributes>
            })
    }
    const attributesQuery = useQuery(
        `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}${route}/attributes`,
        getAttributes,
        {
            enabled: !(
                store &&
                channelList &&
                !channelList.every((val) => Object.keys(store!).includes(val))
            ),
            refetchOnWindowFocus: false
        }
    )

    const constructUniquesURL = (): string => {
        let apiUrlUnqs =
            `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + route + '/uniques'

        let queryParamList = [...restrictionList]
        let channelCheckArr = Array<boolean>()

        channelList?.forEach((element) => {
            if (store![element]) {
                channelCheckArr.push(true)
            } else {
                channelCheckArr.push(false)
            }
        })

        for (let i in channelList) {
            if (typeof store![channelList[+i]] != undefined) {
                queryParamList = queryParamList.concat(store![channelList[+i]])
            }
        }
        if (queryParamList.indexOf('') !== -1) {
            queryParamList.splice(queryParamList.indexOf(''), 1)
        }

        if (queryParamList.length) {
            if (apiUrlUnqs.includes('?') === false) {
                apiUrlUnqs = apiUrlUnqs + '?' + queryParamList.join('&')
            } else {
                apiUrlUnqs = apiUrlUnqs + '&' + queryParamList.join('&')
            }
        }

        if (Object.keys(state.filter).length !== 0) {
            for (const key of Object.keys(state.filter)) {
                if (apiUrlUnqs.includes('?') === false) {
                    apiUrlUnqs = apiUrlUnqs + '?' + state.filter[key].restriction
                } else {
                    apiUrlUnqs = apiUrlUnqs + '&' + state.filter[key].restriction
                }
            }
        }

        if (databaseHost) {
            apiUrlUnqs = apiUrlUnqs.concat(`&database_host=${databaseHost}`)
        }

        return apiUrlUnqs
    }
    const getUniques = (): Promise<djUniques> => {
        return fetch(constructUniquesURL(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        })
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                return result as Promise<djUniques>
            })
    }
    const uniquesQuery = useQuery(`${constructUniquesURL()}_table`, getUniques, {
        enabled: !(
            store &&
            channelList &&
            !channelList.every((val) => Object.keys(store!).includes(val))
        )
    })

    const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
        setState((prevState) => ({
            ...prevState,
            numberOfTuples: pageSize
        }))
    }

    const parseDate = (dateTimeString: string) => {
        // Handle case with null
        let microseconds = ''
        if (dateTimeString === null) {
            return '=NULL='
        }
        if ((parseFloat(dateTimeString) * 1000 + '').includes('.')) {
            microseconds = (parseFloat(dateTimeString) * 1000 + '').split('.')[1]
        }
        let date = new Date(parseFloat(dateTimeString) * 1000)
        return date
            .toUTCString()
            .replace(' GMT', '.' + date.getUTCMilliseconds() + microseconds + ' GMT')
    }

    // Store previous props
    useEffect(() => {
        prevPropsRef.current = store
    })
    const getPreviousProps = () => {
        return prevPropsRef.current
    }

    // Effect for handling emitter updates
    useEffect(() => {
        if (recordsQuery.isSuccess && attributesQuery.isSuccess) {
            let propsUpdate = false
            if (store !== getPreviousProps()!) {
                channelList?.forEach((element) => {
                    if (
                        JSON.stringify(store![element]) !==
                        JSON.stringify(getPreviousProps()![element])
                    ) {
                        console.log('PROPS UPDATED')
                        propsUpdate = true
                    }
                })
            }
            if (propsUpdate) {
                let pks: string[] = []
                attributesQuery.data.attributes.primary.forEach(
                    (value: djAttributesArray, index: number) => {
                        pks.push(value[0])
                    }
                )

                let record: string[] = []

                for (const val in recordsQuery.data.records) {
                    pks.forEach((value: string, index: number) => {
                        //this works because i assume the primary keys are the first ones in recordsQuery.data.recordHeader
                        if (recordsQuery.data.recordHeader[index] === value) {
                            //might need revision
                            record.push(`${value}=${recordsQuery.data.records[val][index]}`)
                        }
                    })
                }

                updatePageStore(channel!, record.slice(0, 2))
            }
        }
    }, [
        store,
        recordsQuery.data,
        attributesQuery.data,
        attributesQuery.isSuccess,
        channel,
        channelList,
        recordsQuery.isSuccess,
        updatePageStore
    ])

    // Effect for constructing the table
    useEffect(() => {
        if (recordsQuery.isSuccess && attributesQuery.isSuccess) {
            let tempCols: {}[] = []
            let tempData: {}[] = []
            let fullAttr = attributesQuery.data.attributes.primary.concat(
                attributesQuery.data.attributes.secondary
            )
            fullAttr.forEach((value: djAttributesArray, index: number) => {
                value[1].includes('datetime') ||
                value[1] === 'time' ||
                value[1] === 'timestamp' ||
                value[1] === 'date'
                    ? tempCols.push({
                          title: value[0],
                          dataIndex: value[0],
                          filterDropdown: !state.fullUnq.length ? (
                              <Spin size='small' />
                          ) : undefined,
                          filters: state.fullUnq.length ? state.fullUnq[index][0] : undefined,
                          filterMultiple: false,
                          sorter: {},
                          filteredValue: state.filter[value[0]]
                              ? state.filter[value[0]].filteredValue
                              : null,
                          filtered: state.filter[value[0]]
                              ? state.filter[value[0]].filtered
                              : false,
                          filterSearch: true,
                          render: (date: string) => parseDate(date)
                      })
                    : tempCols.push({
                          title: value[0],
                          dataIndex: value[0],
                          filterDropdown: !state.fullUnq.length ? (
                              <Spin size='small' />
                          ) : undefined,
                          filters: state.fullUnq.length ? state.fullUnq[index][0] : undefined,
                          filterMultiple: false,
                          sorter: {},
                          filteredValue: state.filter[value[0]]
                              ? state.filter[value[0]].filteredValue
                              : null,
                          filtered: state.filter[value[0]]
                              ? state.filter[value[0]].filtered
                              : false,
                          filterSearch: true
                      })
            })
            recordsQuery.data.records.forEach(
                (value: (string | number | bigint | boolean | null)[], index: number) => {
                    let tmp: {} = { key: index }
                    value.forEach(
                        (value: string | number | bigint | boolean | null, index: number) => {
                            Object.assign(tmp, {
                                [recordsQuery.data.recordHeader[index]]: value
                            })
                        }
                    )
                    tempData.push(tmp)
                }
            )
            setState((prevState) => ({
                ...prevState,
                columns: tempCols,
                data: tempData
            }))
        }
    }, [
        recordsQuery.data,
        attributesQuery.data,
        state.fullUnq,
        attributesQuery.isSuccess,
        recordsQuery.isSuccess,
        state.filter
    ])

    // Effect for updating filters
    useEffect(() => {
        if (uniquesQuery.isSuccess) {
            let uniques = uniquesQuery.data.unique_values.primary.concat(
                uniquesQuery.data.unique_values.secondary
            )
            setState((prevState) => ({
                ...prevState,
                fullUnq: uniques
            }))
        }
    }, [uniquesQuery.data, uniquesQuery.isSuccess])

    useEffect(() => {
        if (state.keys && link && updateHiddenPage) {
            updateHiddenPage(link, state.keys.join('&'), pageMap!)
            setState((prevState) => ({
                ...prevState,
                keys: undefined
            }))
        }
    }, [state.keys, link, pageMap, updateHiddenPage])

    return (
        <Card
            title={name}
            style={{ width: '100%', height: height }}
            bodyStyle={{
                height: `${((height - 57.13) / height) * 100}%`, // 57.13 is the height of the title element
                overflowY: 'auto'
            }}
            hoverable={true}
        >
            <Table
                columns={state.columns}
                loading={recordsQuery.isLoading || attributesQuery.isLoading}
                rowSelection={
                    channel
                        ? {
                              selectedRowKeys: state.selectedRow,
                              type: 'radio',
                              onChange: (
                                  selectedRowKeys: React.Key[],
                                  // Must use any since the native type of selectedRows is {}[]
                                  // which is basically unusable since you cannot index into the object
                                  selectedRows: any[]
                              ) => {
                                  let record: string[] = []

                                  let pks: string[] = []

                                  attributesQuery.data?.attributes.primary.forEach(
                                      (value: djAttributesArray, index: number) => {
                                          pks.push(value[0])
                                      }
                                  )

                                  for (const val in selectedRows[0]) {
                                      pks.forEach((value: string, index: number) => {
                                          if (val !== 'key' && val === value) {
                                              record.push(
                                                  `${val}=${selectedRows[0][val.toString()]}`
                                              )
                                          }
                                      })
                                  }

                                  updatePageStore(channel!, record)

                                  setState((prevState) => ({
                                      ...prevState,
                                      selectedRow: [...selectedRowKeys]
                                  }))
                              }
                          }
                        : undefined
                }
                dataSource={state.data}
                key={state.data.toString() + state.columns.toString()}
                onChange={handleChange}
                // any is needed due to ant design return type
                onRow={(record: any, rowIndex: number | undefined) => {
                    return {
                        onClick: (event) => {
                            event.stopPropagation()
                            let keysArr: string[] = []
                            attributesQuery.data?.attributes.primary.forEach(
                                (value: djAttributesArray, index: number) => {
                                    keysArr.push(`${value[0]}=${record[value[0]]}`)
                                }
                            )
                            setState((prevState) => ({
                                ...prevState,
                                keys: keysArr
                            }))
                        }
                    }
                }}
                pagination={{
                    total: recordsQuery.data?.totalCount || 0,
                    pageSize: state.numberOfTuples,
                    current: state.offset,
                    showTotal: (total: number) => `Total records: ${total}`,
                    showSizeChanger:
                        (recordsQuery.data?.totalCount || 0) > (pageSizeDefault || 5)
                            ? true
                            : false,
                    onShowSizeChange: onShowSizeChange,
                    pageSizeOptions: pageSizeDefault
                        ? [5, 10, 20, 50, 100].includes(pageSizeDefault)
                            ? [5, 10, 20, 50, 100]
                            : [5, 10, 20, 50, 100, pageSizeDefault].sort(function (a, b) {
                                  return a - b
                              })
                        : [5, 10, 20, 50, 100]
                }}
            />
        </Card>
    )
}

export default DjTable
