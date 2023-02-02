import { ComponentTypes, DropdownQueryComponent, RadioDropdownComponent, SliderComponent, FormComponent, ImageComponent, MetadataComponent, PlotComponent, MarkDownComponent, TableComponent } from "./SciVizInterfaces"
import TableView from '../Table/TableView'
import DjTable from '../Table/DjTable'
import FullPlotly from '../Plots/FullPlotly'
import Metadata from '../Table/Metadata'
import Image from '../Image'
import DynamicForm from '../Form/DynamicForm'
import Markdown from '../Markdown'
import DjDropdown from '../Emitters/Dropdown'
import DjDropdownQuery from '../Emitters/DropdownQuery'
import DjRadioButtons from '../Emitters/RadioButtons'
import DjSlider from '../Emitters/Slider'

interface ComponentProps {
    name: string
    component: ComponentTypes
    gridHeight: number
}

function SciVizComponent(props: ComponentProps) {
    const generateComponent = () => {
        var comp: JSX.Element = <></>
        const type = props.component.type
        if (/^markdown.*$/.test(type)) {
            const compData = props.component as MarkDownComponent
            comp = <Markdown content={compData.text} imageRoute={compData.image_route ? `require('${compData.image_route}')['default']` : ''} height={props.gridHeight*compData.height+(compData.height-1)*10}/>
        }
        return (
        <div key={props.name} data-grid={{x: props.component.x, y: props.component.y, w: props.component.width, h: props.component.height, static: true}}>
            {comp}
        </div>
      )
    }
    return (
        generateComponent()
    )
}

export default SciVizComponent
