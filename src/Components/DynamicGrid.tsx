import React from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import FullPlotly from './Plots/FullPlotly'
import Metadata from './Table/Metadata'
import { Pagination } from 'antd'
import Image from './Image'

interface DynamicGridProps {
    route: string
    token: string
    columns: number
    rowHeight: number
    componentList: Array<string>
    routeList: Array<string>
    cascadeRestriction?: boolean
    queryParams?: Array<string>
    channelList?: Array<string>
    store?: RestrictionStore
}

interface RestrictionStore {
    [key: string]: Array<string>
}

interface DynamicGridState {
    data: djRecords
    page: number
}

interface djRecords {
    recordHeader: Array<string>
    records: Array<Array<number | null | bigint | boolean | string>>
    totalCount: number
}

const ResponsiveGridLayout = WidthProvider(Responsive)

/**
 * DynamicGrid component
 */
export default class DynamicGrid extends React.Component<DynamicGridProps, DynamicGridState> {
    constructor(props: DynamicGridProps) {
        super(props)
        this.state = {
            data: { recordHeader: [], records: [[]], totalCount: 0 },
            page: 1
        }
        this.onChange = this.onChange.bind(this)
        this.query = this.query.bind(this)
    }
    public static defaultProps = {
        cascadeRestriction: false,
        channelList: []
    }
    query() {
        let apiUrl =
            `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` +
            this.props.route +
            `?limit=${this.props.columns}` +
            `&page=${this.state.page}`
        if (this.props.queryParams != undefined && !this.props.queryParams.includes('')) {
            apiUrl = apiUrl + '&' + this.props.queryParams.join('&')
        }

        let storeParams: Array<string> = []

        // check if the data store is populated
        for (let i in this.props.channelList) {
            if (typeof this.props.store![this.props.channelList[+i]] != undefined) {
                storeParams = storeParams.concat(this.props.store![this.props.channelList[+i]])
            } else {
                return
            }
        }

        if (storeParams.length > 0) {
            apiUrl = apiUrl + '&' + storeParams.join('&')
        }

        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.props.token
            }
        })
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                this.setState({
                    data: {
                        recordHeader: result.recordHeader,
                        records: result.records,
                        totalCount: result.totalCount
                    }
                })
            })
    }

    componentDidMount() {
        this.query()
    }

    onChange = (page: any) => {
        this.setState({
            page: page
        })
    }

    componentDidUpdate(prevProps: DynamicGridProps, prevState: DynamicGridState): void {
        if (this.state.page != prevState.page || prevProps.store != this.props.store) {
            this.query()
        }
    }

    render() {
        return (
            <>
                <ResponsiveGridLayout
                    className='mygrid'
                    rowHeight={this.props.rowHeight}
                    measureBeforeMount={false}
                    breakpoints={{ lg: 1200, sm: 768 }}
                    cols={{ lg: this.props.columns, sm: 1 }}
                    useCSSTransforms={true}
                >
                    {this.state.data.records.map(
                        (
                            record: Array<number | null | bigint | boolean | string>,
                            index: number
                        ) => {
                            let restrictionList: Array<string>
                            restrictionList = []
                            for (const i in this.state.data.recordHeader) {
                                restrictionList.push(
                                    this.state.data.recordHeader[i].toString() +
                                        '=' +
                                        record[i]!.toString()
                                )
                            }
                            // if restrictionList is empty that means that the data is empty/unfetched
                            // which means that we should not render anything
                            if (restrictionList.length == 0) {
                                return <div></div>
                            }
                            return (
                                <div
                                    key={record.toString()}
                                    data-grid={{
                                        x: index % this.props.columns,
                                        y: Math.floor(index / this.props.columns),
                                        w: 1,
                                        h: 1,
                                        static: true
                                    }}
                                >
                                    <div className='plotContainer'>
                                        {this.props.componentList.map(
                                            (componentType: string, compListIndex: number) => {
                                                let restrictionListCopy = [...restrictionList]
                                                if (componentType.match(/^plot.*$/)) {
                                                    return (
                                                        <FullPlotly
                                                            route={
                                                                this.props.routeList[
                                                                    compListIndex
                                                                ]
                                                            }
                                                            token={this.props.token}
                                                            restrictionList={
                                                                restrictionListCopy
                                                            }
                                                            height={
                                                                this.props.rowHeight /
                                                                this.props.componentList.length
                                                            }
                                                        />
                                                    )
                                                }
                                                if (componentType.match(/^metadata.*$/)) {
                                                    return (
                                                        <Metadata
                                                            name='Metadata'
                                                            route={
                                                                this.props.routeList[
                                                                    compListIndex
                                                                ]
                                                            }
                                                            token={this.props.token}
                                                            height={
                                                                this.props.rowHeight /
                                                                this.props.componentList.length
                                                            }
                                                            restrictionList={
                                                                restrictionListCopy
                                                            }
                                                        />
                                                    )
                                                }
                                                if (
                                                    componentType.match(
                                                        /^file:image:attach.*$/
                                                    )
                                                ) {
                                                    return (
                                                        <Image
                                                            route={
                                                                this.props.routeList[
                                                                    compListIndex
                                                                ]
                                                            }
                                                            token={this.props.token}
                                                            height={
                                                                this.props.rowHeight /
                                                                this.props.componentList.length
                                                            }
                                                            restrictionList={
                                                                restrictionListCopy
                                                            }
                                                        />
                                                    )
                                                }
                                            }
                                        )}
                                    </div>
                                </div>
                            )
                        }
                    )}
                </ResponsiveGridLayout>
                <Pagination
                    total={this.state.data.totalCount}
                    defaultPageSize={this.props.columns}
                    hideOnSinglePage={false}
                    style={{ textAlign: 'center' }}
                    onChange={this.onChange}
                    key={String(this.state.data)}
                />
            </>
        )
    }
}
