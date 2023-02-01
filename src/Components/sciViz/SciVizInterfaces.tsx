export interface SciVizSpec {
    SciViz: {
        pages: {[key:string]:SciVizPage}
        auth?: boolean
        website_title?:string
        favicon_name?: string
        header?: {
            image_route: string
            text: string
        }
        hostname?: string
        login?: {
            image_route: string
        }
    }
    version?: string
}

export interface SciVizPage {
    route: string
    hidden?: boolean
    grids: {[key: string]: GridTypes}
}

export type GridTypes = SciVizFixedGrid // | SciVizDynamicGrid

interface SciVizFixedGrid {
    type: 'fixed'
    columns: number
    row_height: number
    components: {[key:string]:ComponentTypes}
}

export type ComponentTypes = DropdownQueryComponent | RadioDropdownComponent | SliderComponent | FormComponent | ImageComponent | MetadataComponent | PlotComponent | MarkDownComponent | TableComponent

interface DropdownQueryComponent extends SciVizComponent {
    restriction: string
    dj_query: string
    channel: string
}

interface RadioDropdownComponent extends SciVizComponent {
    channel: string
    content: {[key:string]: string}
}

interface SliderComponent extends SciVizComponent {
    restriction: string
    dj_query: string
    channel: string
    channels?: string[]
}

interface FormComponent extends SciVizComponent {
    tables: string[]
    map?: {
        type: 'attribute' | 'table'
        input: string
        destination: string
        map?: {
            type: 'attribute'
            input: string
            destination: string
        }
    }
    channels?: string[]
}

interface ImageComponent extends SciVizComponent {
    restriction: string
    dj_query: string
}

interface MetadataComponent extends SciVizComponent {
    restriction: string
    dj_query: string
}

interface PlotComponent extends SciVizComponent {
    restriction: string
    dj_query: string
    channels?: string[]
}

interface MarkDownComponent extends SciVizComponent {
    text: string
    image_route?: string
}

interface TableComponent extends SciVizComponent {
    restriction: string
    dj_query: string
}

interface SciVizComponent {
    type: string
    route: string
    x: number
    y: number
    height: number
    width: number
}