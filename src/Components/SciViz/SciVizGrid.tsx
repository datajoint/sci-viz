import React, { Suspense } from 'react'
import { Spin } from 'antd'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { QueryClient, QueryClientProvider } from 'react-query'
import {
    GridTypes,
    SciVizFixedGrid,
    SciVizDynamicGrid,
    RestrictionStore
} from './SciVizInterfaces'
import './Page.css'

const SciVizComponent = React.lazy(() => import('./SciVizComponent'))
const DynamicGrid = React.lazy(() => import('../DynamicGrid'))

const ResponsiveGridLayout = WidthProvider(Responsive)

/** The interface for the SciVizGrid props */
interface GridProps {
    /** The name of the grid */
    name: string

    /** The data of the grid */
    grid: GridTypes

    /** A JWT token to perform queries */
    jwtToken?: string

    /** A list of restrictions for grids with queried components */
    restrictionList?: string[]

    /** An information store for grids with linked components */
    store?: RestrictionStore

    /** The query client to use for dynamic form queries */
    queryClient?: QueryClient

    /** An override for the query prefix */
    apiPrefix?: string

    /** An override for the query suffix */
    apiSuffix?: string

    /** An override for the loading spinner */
    spinner?: JSX.Element

    /** A callback function to refresh the restriction list */
    updateRestrictionList?: (queryParams: string) => string

    /** A callback function to refresh the store */
    updateStore?: (key: string, record: string[]) => void

    /** A callback function for handling hidden pages */
    updateHiddenPage?: (route: string, queryParams: string) => void
}

/**
 * Dynamically creates a SciViz grid
 *
 * @param {string} name - The name of the grid
 * @param {ComponentTypes} grid - The data of the grid
 * @param {string=} jwtToken - A JWT token to perform queries
 * @param {string[]=} restrictionList - A list of restrictions for grids with queried components
 * @param {RestrictionStore=} store - An information store for grids with linked components
 * @param {QueryClient=} queryClient - The query client to use for dynamic form queries
 * @param {string=} apiPrefix - An override for the query prefix
 * @param {string=} apiSuffix - An override for the query suffix
 * @param {JSX.Element=} spinner - An override for the loading spinner
 * @param {(queryParams: string) => string=} updateRestrictionList - A callback function to refresh the restriction list
 * @param {(key: string, record: string[]) => void=} updateStore - A callback function to refresh the store
 * @param {(route: string, queryParams: string) => void=} [updateHiddenPage] - A callback function for handling hidden pages
 *
 * @returns A SciViz grid
 */
function SciVizGrid(props: GridProps) {
    var grid: JSX.Element = <></>
    const type = props.grid.type
    if (type === 'fixed') {
        const gridData = props.grid as SciVizFixedGrid
        grid = (
            <Suspense fallback={<Spin size='default' />}>
                <ResponsiveGridLayout
                    className='mygrid'
                    rowHeight={gridData.row_height}
                    measureBeforeMount={true}
                    breakpoints={{ lg: 1200, sm: 768 }}
                    cols={{ lg: gridData.columns, sm: 1 }}
                    useCSSTransforms={true}
                >
                    {Object.entries(gridData.components).map(([name, component]) => (
                        <div
                            key={JSON.stringify(component)}
                            data-grid={{
                                x: component.x,
                                y: component.y,
                                w: component.width,
                                h: component.height,
                                static: true
                            }}
                        >
                            <QueryClientProvider client={props.queryClient!}>
                                <SciVizComponent
                                    key={JSON.stringify(component)}
                                    name={name}
                                    component={component}
                                    jwtToken={props.jwtToken}
                                    height={gridData.row_height}
                                    restrictionList={[...props.restrictionList!]}
                                    store={Object.assign({}, props.store)}
                                    queryClient={props.queryClient}
                                    apiPrefix={props.apiPrefix}
                                    apiSuffix={props.apiSuffix}
                                    spinner={props.spinner}
                                    updateRestrictionList={props.updateRestrictionList}
                                    updateStore={props.updateStore}
                                    updateHiddenPage={props.updateHiddenPage}
                                />
                            </QueryClientProvider>
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </Suspense>
        )
    } else if (type === 'dynamic') {
        const gridData = props.grid as SciVizDynamicGrid
        let componentList: string[] = []
        let routeList: string[] = []
        Object.entries(gridData.component_templates).forEach(([name, component]) => {
            componentList.push(component.type)
            routeList.push(component.route)
        })
        grid = (
            <Suspense fallback={<Spin size='default' />}>
                <DynamicGrid
                    route={gridData.route}
                    token={props.jwtToken!}
                    columns={gridData.columns}
                    rowHeight={gridData.row_height}
                    componentList={componentList}
                    routeList={routeList}
                    queryParams={[...props.restrictionList!]}
                    channelList={gridData.channels}
                    store={
                        gridData.channels
                            ? props.store
                                ? Object.assign({}, props.store)
                                : {}
                            : undefined
                    }
                />
            </Suspense>
        )
    }

    return grid
}

export default SciVizGrid
