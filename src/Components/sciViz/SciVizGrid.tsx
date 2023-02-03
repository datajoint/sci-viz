import { Suspense } from 'react'
import { Spin } from 'antd'
import { Responsive, WidthProvider } from 'react-grid-layout'
import {
    GridTypes,
    SciVizFixedGrid,
    SciVizDynamicGrid,
    RestrictionStore
} from './SciVizInterfaces'
import SciVizComponent from './SciVizComponent'
import DynamicGrid from '../DynamicGrid'

const ResponsiveGridLayout = WidthProvider(Responsive)

interface GridProps {
    name: string
    grid: GridTypes
    jwtToken: string
    restrictionList?: string[]
    store?: RestrictionStore
    updateRestrictionList?: (queryParams: string) => string
    updateStore?: (key: string, record: string[]) => void
}

function SciVizGrid(props: GridProps) {
    const generateGrid = () => {
        var grid: JSX.Element = <></>
        const type = props.grid.type
        if (type === 'fixed') {
            const gridData = props.grid as SciVizFixedGrid
            grid = (
                <li>
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
                                <SciVizComponent
                                    name={name}
                                    component={component}
                                    gridHeight={gridData.row_height}
                                    restrictionList={props.restrictionList}
                                    store={props.store}
                                    updateRestrictionList={props.updateRestrictionList}
                                    updateStore={props.updateStore}
                                />
                            ))}
                        </ResponsiveGridLayout>
                    </Suspense>
                </li>
            )
        } else if (type === 'dynamic') {
            const gridData = props.grid as SciVizDynamicGrid
            let componentList: string[] = []
            let routeList: string[] = []
            Object.entries(gridData.component_templates).forEach(
                ([component_name, component]) => {
                    componentList.push(component.type)
                    routeList.push(component.route)
                }
            )
            grid = (
                <Suspense fallback={<Spin size='default' />}>
                    <li>
                        <DynamicGrid
                            route={gridData.route}
                            token={props.jwtToken}
                            columns={gridData.columns}
                            rowHeight={gridData.row_height}
                            componentList={componentList}
                            routeList={routeList}
                            queryParams={props.restrictionList}
                            channelList={gridData.channels}
                            store={gridData.channels ? props.store : undefined}
                        />
                    </li>
                </Suspense>
            )
        }
        return grid
    }
    return generateGrid()
}

export default SciVizGrid
