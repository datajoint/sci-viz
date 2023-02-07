import {
    ComponentTypes,
    DropdownQueryComponent,
    DropdownComponent,
    RadioComponent,
    SliderComponent,
    FormComponent,
    ImageComponent,
    MetadataComponent,
    PlotComponent,
    MarkDownComponent,
    TableComponent,
    RestrictionStore
} from './SciVizInterfaces'
import TableView from '../Table/TableView'
import DjTable from '../Table/DjTable'
import FullPlotly from '../Plots/FullPlotly'
import Metadata from '../Table/Metadata'
import Image from '../Image'
import DynamicForm from '../Form/DynamicForm'
import Markdown from '../Markdown'
import DjSlider from '../Emitters/Slider'
import Dropdown from '../Emitters/Dropdown'
import DropdownQuery from '../Emitters/DropdownQuery'
import RadioButtons from '../Emitters/RadioButtons'

interface ComponentProps {
    name: string
    component: ComponentTypes
    jwtToken?: string
    gridHeight: number
    restrictionList?: string[]
    store?: RestrictionStore
    updateRestrictionList?: (queryParams: string) => string
    updateStore?: (key: string, record: string[]) => void
}

function SciVizComponent(props: ComponentProps) {
    var comp: JSX.Element = <></>
    const type = props.component.type
    if (/^markdown.*$/.test(type)) {
        const compData = props.component as MarkDownComponent
        comp = (
            <Markdown
                key={JSON.stringify(compData)}
                content={compData.text}
                imageRoute={
                    compData.image_route ? `require('${compData.image_route}')['default']` : ''
                }
                height={props.gridHeight * compData.height + (compData.height - 1) * 10}
            />
        )
    } else if (/^plot.*$/.test(type)) {
        const compData = props.component as PlotComponent
        comp = (
            <FullPlotly
                key={JSON.stringify(compData)}
                token={props.jwtToken!}
                route={compData.route}
                height={props.gridHeight * compData.height + (compData.height - 1) * 10}
                restrictionList={props.restrictionList!}
                store={props.store}
                channelList={compData.channels}
            />
        )
    } else if (/^metadata.*$/.test(type)) {
        const compData = props.component as MetadataComponent
        comp = (
            <div className='metadataContainer'>
                <Metadata
                    key={JSON.stringify(compData)}
                    token={props.jwtToken!}
                    route={compData.route}
                    name={props.name}
                    height={props.gridHeight}
                    restrictionList={props.restrictionList!}
                />
            </div>
        )
    } else if (/^file:image.*$/.test(type)) {
        const compData = props.component as ImageComponent
        comp = (
            <Image
                key={JSON.stringify(compData)}
                token={props.jwtToken!}
                route={compData.route}
                height={props.gridHeight * compData.height + (compData.height - 1) * 10}
                restrictionList={props.restrictionList!}
            />
        )
    } else if (/^table.*$/.test(type)) {
        const compData = props.component as TableComponent
        comp = (
            <TableView
                key={JSON.stringify(compData)}
                token={props.jwtToken!}
                route={compData.route}
                tableName={props.name}
                link={compData.link}
                channel={compData.channel}
                updateRestrictionList={props.updateRestrictionList!}
                updatePageStore={props.updateStore!}
            />
        )
    } else if (/^antd-table.*$/.test(type)) {
        const compData = props.component as TableComponent
        comp = (
            <DjTable
                key={JSON.stringify(compData)}
                token={props.jwtToken!}
                route={compData.route}
                name={props.name}
                height={props.gridHeight * compData.height + (compData.height - 1) * 10}
                link={compData.link}
                channel={compData.channel}
                store={props.store}
                channelList={compData.channels}
                restrictionList={props.restrictionList!}
                updatePageStore={props.updateStore!}
            />
        )
    } else if (/^form.*$/.test(type)) {
        const compData = props.component as FormComponent
        comp = (
            <DynamicForm
                key={JSON.stringify(compData)}
                token={props.jwtToken!}
                route={compData.route}
                name={props.name}
                height={props.gridHeight * compData.height + (compData.height - 1) * 10}
                store={props.store}
                channelList={compData.channels || []}
            />
        )
    } else if (/^slider.*$/.test(type)) {
        const compData = props.component as SliderComponent
        comp = (
            <DjSlider
                key={JSON.stringify(compData)}
                token={props.jwtToken!}
                route={compData.route}
                restrictionList={props.restrictionList!}
                channel={compData.channel}
                updatePageStore={props.updateStore!}
                channelList={compData.channels}
                store={props.store}
            />
        )
    } else if (/^dropdown-static.*$/.test(type)) {
        const compData = props.component as DropdownComponent
        comp = (
            <Dropdown
                key={JSON.stringify(compData)}
                height={props.gridHeight * compData.height + (compData.height - 1) * 10}
                payload={compData.content}
                channel={compData.channel}
                updatePageStore={props.updateStore!}
            />
        )
    } else if (/^dropdown-query.*$/.test(type)) {
        const compData = props.component as DropdownQueryComponent
        comp = (
            <DropdownQuery
                key={JSON.stringify(compData)}
                height={props.gridHeight * compData.height + (compData.height - 1) * 10}
                channel={compData.channel}
                route={compData.route}
                token={props.jwtToken!}
                updatePageStore={props.updateStore!}
            />
        )
    } else if (/^radiobuttons.*$/.test(type)) {
        const compData = props.component as RadioComponent
        comp = (
            <RadioButtons
                key={JSON.stringify(compData)}
                height={props.gridHeight * compData.height + (compData.height - 1) * 10}
                payload={compData.content}
                channel={compData.channel}
                updatePageStore={props.updateStore!}
            />
        )
    }
    return <>{comp}</>
}

export default SciVizComponent
