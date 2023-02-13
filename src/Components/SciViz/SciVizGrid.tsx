import React, { Suspense } from 'react'
import { Spin } from 'antd'
import { Responsive, WidthProvider } from 'react-grid-layout'
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

interface GridProps {
    name: string
    grid: GridTypes
    jwtToken?: string
    restrictionList?: string[]
    store?: RestrictionStore
    updateRestrictionList?: (queryParams: string) => string
    updateStore?: (key: string, record: string[]) => void
}

/**
 * Dynamically creates a SciViz grid
 *
 * @param {string} name - The name of the grid
 * @param {ComponentTypes} grid - The data of the grid
 * @param {string=} jwtToken - A JWT token to perform queries
 * @param {string[]=} restrictionList - A list of restrictions for grids with queried components
 * @param {RestrictionStore=} store - An information store for grids with linked components
 * @param {(queryParams: string) => string=} updateRestrictionList - A callback function to refresh the restriction list
 * @param {(key: string, record: string[]) => void=} updateStore - A callback function to refresh the store
 *
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
                            <SciVizComponent
                                key={JSON.stringify(component)}
                                name={name}
                                component={component}
                                jwtToken={props.jwtToken}
                                height={gridData.row_height}
                                restrictionList={[...props.restrictionList!]}
                                store={Object.assign({}, props.store)}
                                updateRestrictionList={props.updateRestrictionList}
                                updateStore={props.updateStore}
                            />
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
