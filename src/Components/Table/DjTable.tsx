import React, { useEffect, useRef, useState } from 'react'
import { Card, PaginationProps, Table, TablePaginationConfig } from 'antd'
import type { FilterValue } from 'antd/es/table/interface'

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
    updateHiddenPage?: (route: string, queryParams: string) => void
    channel?: string
    channelList?: Array<string>
    store?: RestrictionStore
    databaseHost?: string
    pageSizeDefault?: number
}

interface DjTableState {
    data: djRecords
    dataAttributes: djAttributes
    numberOfTuples: number
    offset: number | undefined
    filter: { [key: string]: djFilter }
    sorter: Array<string>
    keys: Array<string> | undefined
    selectedRow: (string | number)[]
    loading: boolean
}

interface djAttributesArray {
    [index: number]: string
    name: string
    type: string
    nullable: boolean
    default: string
    autoincriment: boolean
    filter: { text: string; value: string | number }[]
}
interface djAttributes {
    attributeHeaders: Array<string>
    attributes: {
        primary: Array<djAttributesArray>
        secondary: Array<djAttributesArray>
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
function DjTable(props: DjTableProps) {
    const [state, setState] = useState<DjTableState>({
        data: { recordHeader: [], records: [[]], totalCount: 0 },
        dataAttributes: {
            attributeHeaders: [],
            attributes: { primary: [], secondary: [] }
        },
        numberOfTuples: props.pageSizeDefault || 5,
        offset: 1,
        filter: {},
        sorter: [],
        keys: undefined,
        selectedRow: [0],
        loading: false
    })
    const [prevState, setPrevState] = useState<DjTableState>({
        data: { recordHeader: [], records: [[]], totalCount: 0 },
        dataAttributes: {
            attributeHeaders: [],
            attributes: { primary: [], secondary: [] }
        },
        numberOfTuples: props.pageSizeDefault || 5,
        offset: 1,
        filter: {},
        sorter: [],
        keys: undefined,
        selectedRow: [0],
        loading: false
    })
    const isInitialMount = useRef(true)
    const prevPropsRef = useRef<DjTableProps>()

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
            if (sorter['order'] == 'ascend') {
                sort = 'ASC'
            } else if (sorter['order'] == 'descend') {
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

    const getRecords = (): Promise<djRecords> => {
        let queryParamList = [...props.restrictionList]
        let channelCheckArr = Array<boolean>()

        props.channelList?.forEach((element) => {
            if (props.store![element]) {
                channelCheckArr.push(true)
            } else {
                channelCheckArr.push(false)
            }
        })

        if (props.restrictionList.includes('') && channelCheckArr.includes(false)) {
            let arr = Array<string>()
            let arrRec = Array<Array<number | null | bigint | boolean | string>>()

            return Promise.resolve({
                recordHeader: arr,
                records: arrRec,
                totalCount: 0
            })
        }

        for (let i in props.channelList) {
            if (typeof props.store![props.channelList[+i]] != undefined) {
                queryParamList = queryParamList.concat(props.store![props.channelList[+i]])
            }
        }
        if (queryParamList.indexOf('') !== -1) {
            queryParamList.splice(queryParamList.indexOf(''), 1)
        }

        let apiUrl = `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + props.route

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

        if (props.databaseHost) {
            apiUrl = apiUrl.concat(`&database_host=${props.databaseHost}`)
        }

        return fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + props.token
            }
        })
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                return result as Promise<djRecords>
            })
    }

    const getAttributes = (): Promise<djAttributes> => {
        let apiUrlAttr =
            `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + props.route + '/attributes'

        let queryParamList = [...props.restrictionList]
        let channelCheckArr = Array<boolean>()

        props.channelList?.forEach((element) => {
            if (props.store![element]) {
                channelCheckArr.push(true)
            } else {
                channelCheckArr.push(false)
            }
        })

        for (let i in props.channelList) {
            if (typeof props.store![props.channelList[+i]] != undefined) {
                queryParamList = queryParamList.concat(props.store![props.channelList[+i]])
            }
        }
        if (queryParamList.indexOf('') !== -1) {
            queryParamList.splice(queryParamList.indexOf(''), 1)
        }

        if (queryParamList.length) {
            if (apiUrlAttr.includes('?') == false) {
                apiUrlAttr = apiUrlAttr + '?' + queryParamList.join('&')
            } else {
                apiUrlAttr = apiUrlAttr + '&' + queryParamList.join('&')
            }
        }

        if (Object.keys(state.filter).length !== 0) {
            for (const key of Object.keys(state.filter)) {
                if (apiUrlAttr.includes('?') == false) {
                    apiUrlAttr = apiUrlAttr + '?' + state.filter[key].restriction
                } else {
                    apiUrlAttr = apiUrlAttr + '&' + state.filter[key].restriction
                }
            }
        }

        if (props.databaseHost) {
            apiUrlAttr = apiUrlAttr.concat(`&database_host=${props.databaseHost}`)
        }

        return fetch(apiUrlAttr, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + props.token
            }
        })
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                return result as Promise<djAttributes>
            })
    }

    const getUniques = (): Promise<djAttributes> => {
        let apiUrlUnqs =
            `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + props.route + '/uniques'

        let queryParamList = [...props.restrictionList]
        let channelCheckArr = Array<boolean>()

        props.channelList?.forEach((element) => {
            if (props.store![element]) {
                channelCheckArr.push(true)
            } else {
                channelCheckArr.push(false)
            }
        })

        for (let i in props.channelList) {
            if (typeof props.store![props.channelList[+i]] != undefined) {
                queryParamList = queryParamList.concat(props.store![props.channelList[+i]])
            }
        }
        if (queryParamList.indexOf('') !== -1) {
            queryParamList.splice(queryParamList.indexOf(''), 1)
        }

        if (queryParamList.length) {
            if (apiUrlUnqs.includes('?') == false) {
                apiUrlUnqs = apiUrlUnqs + '?' + queryParamList.join('&')
            } else {
                apiUrlUnqs = apiUrlUnqs + '&' + queryParamList.join('&')
            }
        }

        if (Object.keys(state.filter).length !== 0) {
            for (const key of Object.keys(state.filter)) {
                if (apiUrlUnqs.includes('?') == false) {
                    apiUrlUnqs = apiUrlUnqs + '?' + state.filter[key].restriction
                } else {
                    apiUrlUnqs = apiUrlUnqs + '&' + state.filter[key].restriction
                }
            }
        }

        if (props.databaseHost) {
            apiUrlUnqs = apiUrlUnqs.concat(`&database_host=${props.databaseHost}`)
        }

        return fetch(apiUrlUnqs, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + props.token
            }
        })
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                return result as Promise<djAttributes>
            })
    }

    // Store previous state and props
    useEffect(() => {
        setPrevState(state)
    }, [state])
    useEffect(() => {
        prevPropsRef.current = props
    })
    const getPreviousProps = () => {
        return prevPropsRef.current
    }

    // On mount
    useEffect(() => {
        let records: djRecords
        setState((prevState) => ({
            ...prevState,
            loading: true
        }))
        getRecords()
            .then((result) => {
                records = result
            })
            .then(() => {
                return getAttributes()
            })
            .then((result) => {
                setState((prevState) => ({
                    ...prevState,
                    dataAttributes: result,
                    data: records,
                    loading: false
                }))

                let pks: string[] = []

                state.dataAttributes.attributes.primary.map(
                    (value: djAttributesArray, index: number) => {
                        pks.push(value[0])
                    }
                )

                let record: string[] = []

                for (const val in state.data.records) {
                    pks.forEach((value: string, index: number) => {
                        //this works because i assume the primary keys are the first ones in state.data.recordHeader
                        if (state.data.recordHeader[index] === value) {
                            //might need revision
                            record.push(`${value}=${state.data.records[val][index]}`)
                        }
                    })
                }

                props.updatePageStore(props.channel!, record.slice(0, 2))
            })
            .then(() => {
                getUniques().then((result) => {
                    setState((prevState) => ({
                        ...prevState,
                        dataAttributes: result
                    }))
                })
            })
    }, [])

    // On update
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
        } else {
            if (state.keys && props.link && props.updateHiddenPage) {
                props.updateHiddenPage(props.link, state.keys.join('&'))
                setState((prevState) => ({
                    ...prevState,
                    keys: undefined
                }))
            }
            if (
                state.offset !== prevState.offset ||
                state.filter !== prevState.filter ||
                state.sorter !== prevState.sorter
            ) {
                let attributes: djAttributes
                setState((prevState) => ({
                    ...prevState,
                    loading: true
                }))
                getAttributes()
                    .then((attrs) => {
                        attributes = attrs
                    })
                    .then(() => {
                        getRecords().then((result) => {
                            setState((prevState) => ({
                                ...prevState,
                                dataAttributes: attributes,
                                data: result,
                                loading: false
                            }))
                        })
                    })
            }
            let propsUpdate = false
            if (props.store !== getPreviousProps()!.store) {
                props.channelList?.forEach((element) => {
                    if (
                        JSON.stringify(props.store![element]) !==
                        JSON.stringify(getPreviousProps()!.store![element])
                    ) {
                        console.log('PROPS UPDATED')
                        propsUpdate = true
                    }
                })
            }
            if (propsUpdate) {
                let attributes: djAttributes
                setState((prevState) => ({
                    ...prevState,
                    loading: true
                }))
                getAttributes()
                    .then((attrs) => {
                        attributes = attrs
                    })
                    .then(() => {
                        getRecords().then((payload) => {
                            setState((prevState) => ({
                                ...prevState,
                                dataAttributes: attributes,
                                data: payload,
                                loading: false
                            }))
                            let pks: string[] = []
                            state.dataAttributes.attributes.primary.map(
                                (value: djAttributesArray, index: number) => {
                                    pks.push(value[0])
                                }
                            )

                            let record: string[] = []

                            for (const val in state.data.records) {
                                pks.forEach((value: string, index: number) => {
                                    //this works because i assume the primary keys are the first ones in state.data.recordHeader
                                    if (state.data.recordHeader[index] === value) {
                                        //might need revision
                                        record.push(
                                            `${value}=${state.data.records[val][index]}`
                                        )
                                    }
                                })
                            }

                            props.updatePageStore(props.channel!, record.slice(0, 2))
                        })
                    })
            }
        }
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

    const compileTable = () => {
        // could make an interface for these
        let columns: Array<{}> = []
        let data: Array<{}> = []

        let fullAttr = state.dataAttributes.attributes.primary.concat(
            state.dataAttributes.attributes.secondary
        )

        fullAttr.map((value: djAttributesArray, index: number) => {
            value[1].includes('datetime') ||
            value[1] === 'time' ||
            value[1] === 'timestamp' ||
            value[1] === 'date'
                ? columns.push({
                      title: value[0],
                      dataIndex: value[0],
                      filters: value[5],
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
                : columns.push({
                      title: value[0],
                      dataIndex: value[0],
                      filters: value[5],
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
        state.data.records.map(
            (value: (string | number | bigint | boolean | null)[], index: number) => {
                let tmp: {} = { key: index }
                value.map(
                    (value: string | number | bigint | boolean | null, index: number) => {
                        Object.assign(tmp, { [state.data.recordHeader[index]]: value })
                    }
                )
                data.push(tmp)
            }
        )
        return (
            <Table
                columns={columns}
                loading={state.loading}
                rowSelection={
                    props.channel
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

                                  state.dataAttributes.attributes.primary.map(
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

                                  props.updatePageStore(props.channel!, record)

                                  setState((prevState) => ({
                                      ...prevState,
                                      selectedRow: [...selectedRowKeys]
                                  }))
                              }
                          }
                        : undefined
                }
                dataSource={data}
                key={data.toString() + columns.toString()}
                onChange={handleChange}
                // any is needed due to ant design return type
                onRow={(record: any, rowIndex: number | undefined) => {
                    return {
                        onClick: (event) => {
                            event.stopPropagation()
                            let keysArr: string[] = []
                            state.dataAttributes.attributes.primary.map(
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
                    total: state.data.totalCount,
                    pageSize: state.numberOfTuples,
                    current: state.offset,
                    showTotal: (total: number) => `Total records: ${total}`,
                    showSizeChanger:
                        state.data.totalCount > (props.pageSizeDefault || 5) ? true : false,
                    onShowSizeChange: onShowSizeChange,
                    pageSizeOptions: props.pageSizeDefault
                        ? [5, 10, 20, 50, 100].includes(props.pageSizeDefault)
                            ? [5, 10, 20, 50, 100]
                            : [5, 10, 20, 50, 100, props.pageSizeDefault].sort(function (
                                  a,
                                  b
                              ) {
                                  return a - b
                              })
                        : [5, 10, 20, 50, 100]
                }}
            />
        )
    }

    return (
        <Card
            title={props.name}
            style={{ width: '100%', height: props.height }}
            bodyStyle={{
                height: `${((props.height - 57.13) / props.height) * 100}%`, // 57.13 is the height of the title element
                overflowY: 'auto'
            }}
            hoverable={true}
        >
            <>{compileTable()}</>
        </Card>
    )
}

export default DjTable
