import { useSelector } from 'react-redux'
import { RootState } from './Redux/store'
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
    DateRangePickerComponent
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

/** The interface for the SciVizComponent props */
interface ComponentProps {
    /** The name of the component */
    name: string

    /** The data of the component */
    component: ComponentTypes

    /** The height of the component */
    height: number

    /** A JWT token to perform queries */
    jwtToken?: string

    /** A list of restrictions for queried components */
    restrictionList?: string[]
}

/**
 * Dynamically creates a SciViz component
 *
 * @param {string} name - The name of the component
 * @param {ComponentTypes} component - The data of the component
 * @param {number} height - The height of the component
 * @param {string=} jwtToken - A JWT token to perform queries
 * @param {string[]=} restrictionList - A list of restrictions for queried components
 *
 * @returns A SciViz component
 */
function SciVizComponent(props: ComponentProps) {
    var comp: JSX.Element = <></>
    const updateHiddenPage = useSelector(
        (state: RootState) => state.hiddenPage.updateHiddenPage
    )
    const updatePageStore = useSelector((state: RootState) => state.pageStore.updatePageStore)
    const pageStore = useSelector((state: RootState) => state.pageStore.pageStore)
    const type = props.component.type
    const calculatedHeight =
        props.height * props.component.height + (props.component.height - 1) * 10
    if (/^markdown.*$/.test(type)) {
        const compData = props.component as MarkDownComponent
        comp = (
            <Markdown
                key={JSON.stringify(compData)}
                content={compData.text}
                imageRoute={compData.image_route}
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
                store={Object.assign({}, pageStore)}
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
                    height={props.height}
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
                store={Object.assign({}, pageStore)}
                channelList={compData.channels}
                restrictionList={[...props.restrictionList!]}
                updatePageStore={updatePageStore!}
                updateHiddenPage={updateHiddenPage}
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
                store={Object.assign({}, pageStore)}
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
                store={Object.assign({}, pageStore)}
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
                updatePageStore={updatePageStore!}
                channelList={compData.channels}
                store={Object.assign({}, pageStore)}
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
                updatePageStore={updatePageStore!}
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
                updatePageStore={updatePageStore!}
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
                updatePageStore={updatePageStore!}
            />
        )
    } else if (/^daterangepicker.*$/.test(type)) {
        const compData = props.component as DateRangePickerComponent
        comp = (
            <DateRangePicker
                key={JSON.stringify(compData)}
                height={calculatedHeight}
                channel={compData.channel}
                updatePageStore={updatePageStore!}
            />
        )
    }

    return comp
}

export default SciVizComponent
