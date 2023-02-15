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
    SlideshowComponent,
    DateRangePickerComponent,
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
import Slideshow from '../Slideshow'
import DateRangePicker from '../Emitters/DateRangePicker'
import './Page.css'

interface ComponentProps {
    name: string
    component: ComponentTypes
    jwtToken?: string
    gridHeight: number
    restrictionList?: string[]
    store?: RestrictionStore
    updateRestrictionList?: (queryParams: string) => string
    updateStore?: (key: string, record: string[]) => void
    updateHiddenPage?: (route: string, queryParams: string) => void
}

function SciVizComponent(props: ComponentProps) {
    var comp: JSX.Element = <></>
    const type = props.component.type
    const calculatedHeight =
        props.gridHeight * props.component.height + (props.component.height - 1) * 10
    if (/^markdown.*$/.test(type)) {
        const compData = props.component as MarkDownComponent
        comp = (
            <Markdown
                key={JSON.stringify(compData)}
                content={compData.text}
                imageRoute={
                    compData.image_route //? require(compData.image_route)['default'] : undefined
                }
                height={calculatedHeight}
            />
        )
    } else if (/^plot.*$/.test(type)) {
        const compData = props.component as PlotComponent
        comp = (
            <FullPlotly
                key={JSON.stringify(compData)}
                token={props.jwtToken!}
                route={compData.route}
                height={calculatedHeight}
                restrictionList={[...props.restrictionList!]}
                store={Object.assign({}, props.store)}
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
                    restrictionList={[...props.restrictionList!]}
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
                height={calculatedHeight}
                restrictionList={[...props.restrictionList!]}
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
                height={calculatedHeight}
                link={compData.link}
                channel={compData.channel}
                store={Object.assign({}, props.store)}
                channelList={compData.channels}
                restrictionList={[...props.restrictionList!]}
                updatePageStore={props.updateStore!}
                updateHiddenPage={props.updateHiddenPage}
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
                height={calculatedHeight}
                store={Object.assign({}, props.store)}
                channelList={compData.channels}
            />
        )
    } else if (/^slideshow.*$/.test(type)) {
        const compData = props.component as SlideshowComponent
        comp = (
            <Slideshow
                key={JSON.stringify(compData)}
                token={props.jwtToken!}
                route={compData.route}
                height={calculatedHeight}
                batchSize={compData.batch_size}
                chunkSize={compData.chunk_size}
                bufferSize={compData.buffer_size}
                maxFPS={compData.max_FPS}
                restrictionList={[...props.restrictionList!]}
                store={Object.assign({}, props.store)}
                channelList={compData.channels}
            />
        )
    } else if (/^slider.*$/.test(type)) {
        const compData = props.component as SliderComponent
        comp = (
            <DjSlider
                key={JSON.stringify(compData)}
                token={props.jwtToken!}
                route={compData.route}
                restrictionList={[...props.restrictionList!]}
                channel={compData.channel}
                updatePageStore={props.updateStore!}
                channelList={compData.channels}
                store={Object.assign({}, props.store)}
            />
        )
    } else if (/^dropdown-static.*$/.test(type)) {
        const compData = props.component as DropdownComponent
        comp = (
            <Dropdown
                key={JSON.stringify(compData)}
                height={calculatedHeight}
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
                height={calculatedHeight}
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
                height={calculatedHeight}
                payload={compData.content}
                channel={compData.channel}
                updatePageStore={props.updateStore!}
            />
        )
    } else if (/^daterangepicker.*$/.test(type)) {
        const compData = props.component as DateRangePickerComponent
        comp = (
            <DateRangePicker
                key={JSON.stringify(compData)}
                height={calculatedHeight}
                channel={compData.channel}
                updatePageStore={props.updateStore!}
            />
        )
    }
    return <>{comp}</>
}

export default SciVizComponent