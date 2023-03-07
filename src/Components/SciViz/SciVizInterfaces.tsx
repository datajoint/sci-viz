/** The interface for a SciViz page's restriction storage */
export interface RestrictionStore {
    /** The `channel` to `restriction list` */
    [key: string]: string[]
}

/** The interface for the SciViz spec */
export interface SciVizSpec {
    /** The SciViz spec */
    SciViz: {
        /** The dictionary of pages */
        pages: { [key: string]: SciVizPageType }

        /** A flag to set authentication */
        auth?: {
            /** The authentication method to use */
            mode: 'database' | 'oidc' | 'none'
            /** The authentication endpoint for OIDC */
            endpoint?: string
            /** The authentication database for OIDC */
            database?: string
            /** The authentication client id for OIDC */
            client_id?: string
        }

        /** A SciViz deployment-specific key to set the host sub-route */
        route?: string

        /** A SciViz deployment-specific key to set the website title */
        website_title?: string

        /** A SciViz deployment-specific key to set the website favicon */
        favicon_name?: string

        /** A SciViz deployment-specific key to set the website header */
        header?: {
            /** The route of the header image */
            image_route: string
            /** The text of the header */
            text: string
        }
        /** A SciViz deployment-specific key to set the host name */
        hostname?: string

        /** A SciViz deployment-specific key to set the login page */
        login?: {
            /** The image route of the login page */
            image_route: string
        }
    }

    /** The version of the spec */
    version?: string
}

/** The interface for SciViz pages */
export interface SciVizPageType {
    /** The route of the page */
    route: string

    /** The dictionary of grids */
    grids: { [key: string]: GridTypes }

    /** A flag to set a page as hidden */
    hidden?: boolean
}

/** Grid types */
export type GridTypes = SciVizFixedGrid | SciVizDynamicGrid

/**
 * The interface for Fixed grids
 * @extends {SciVizGrid} - The base interface
 */
export interface SciVizFixedGrid extends SciVizGrid {
    /** The type of the grid */
    type: 'fixed'

    /** The dictionary of components */
    components: { [key: string]: ComponentTypes }
}

/**
 * The interface for Dynamic grids
 * @extends {SciVizGrid} - The base interface
 * @extends {SciVizQueried} - The queried interface
 */
export interface SciVizDynamicGrid extends SciVizGrid, SciVizQueried {
    /** The type of the grid */
    type: 'dynamic'

    /** The route of the grid */
    route: string

    /** The dictionary of components to dynamically generate*/
    component_templates: { [key: string]: DynamicGridComponentTypes }

    /** The list of channels to listen to */
    channels?: string[]
}

/** The base interface for SciViz grids */
interface SciVizGrid {
    /** The number of columns */
    columns: number

    /** The height of the rows in pixels */
    row_height: number
}

/** All SciViz components */
export type ComponentTypes =
    | DropdownQueryComponent
    | DropdownComponent
    | RadioComponent
    | SliderComponent
    | FormComponent
    | ImageComponent
    | MetadataComponent
    | PlotComponent
    | MarkDownComponent
    | TableComponent
    | SlideshowComponent
    | DateRangePickerComponent

/** All SciViz components that are compatible with dynamic grids */
export type DynamicGridComponentTypes = MetadataComponent | PlotComponent

/**
 * The interface for Date Range Picker components
 * @extends {SciVizComponent} - The base interface
 */
export interface DateRangePickerComponent extends SciVizComponent {
    /** The name of the component's channel */
    channel: string
}

/**
 * The interface for Dropdown Query components
 * @extends {SciVizComponent} - The base interface
 * @extends {SciVizQueried} - The queried interface
 */
export interface DropdownQueryComponent extends SciVizComponent, SciVizQueried {
    /** The name of the component's channel */
    channel: string
}

/**
 * The interface for Dropdown components
 * @extends {SciVizComponent} - The base interface
 */
export interface DropdownComponent extends SciVizComponent {
    /** The name of the component's channel */
    channel: string

    /** The `label` to `value` content dictionary */
    content: { [key: string]: string }
}

/**
 * The interface for Radio components
 * @extends {SciVizComponent} - The base interface
 */
export interface RadioComponent extends SciVizComponent {
    /** The name of the component's channel */
    channel: string

    /** The `label` to `value` content dictionary */
    content: { [key: string]: string }
}

/**
 * The interface for Slider components
 * @extends {SciVizComponent} - The base interface
 * @extends {SciVizQueried} - The queried interface
 */
export interface SliderComponent extends SciVizComponent, SciVizQueried {
    /** The name of the component's channel */
    channel: string

    /** The list of channels to listen to */
    channels?: string[]
}

/**
 * The interface for Slideshow components
 * @extends {SciVizComponent} - The base interface
 * @extends {SciVizQueried} - The queried interface
 */
export interface SlideshowComponent extends SciVizComponent, SciVizQueried {
    /** The number of concurrent requests */
    batch_size: number

    /** The number of frames per request */
    chunk_size: number

    /** The number of requests kept in memory */
    buffer_size: number

    /** The max frames per second to display */
    max_FPS: number

    /** The list of channels to listen to */
    channels?: string[]
}

/**
 * The interface for Form components
 * @extends {SciVizComponent} - The base interface
 */
export interface FormComponent extends SciVizComponent {
    /** The list of tables in schema.table format */
    tables: string[]

    /** A mapping for renaming field inputs */
    map?: {
        /** The type of the field */
        type: 'attribute' | 'table'

        /** The new name of the field */
        input: string

        /** The original name of the field */
        destination: string

        /** A nested mapping to rename the values of a table type input's dropdown */
        map?: {
            /** The type of the field */
            type: 'attribute'

            /** The new name of the field */
            input: string

            /** The original name of the field */
            destination: string
        }
    }

    /** The list of channels to listen to */
    channels?: string[]
}

/**
 * The interface for Image components
 * @extends {SciVizComponent} - The base interface
 * @extends {SciVizQueried} - The queried interface
 */
export interface ImageComponent extends SciVizComponent, SciVizQueried {}

/**
 * The interface for Metadata components
 * @extends {SciVizComponent} - The base interface
 * @extends {SciVizQueried} - The queried interface
 */
export interface MetadataComponent extends SciVizComponent, SciVizQueried {}

/**
 * The interface for Plot components
 * @extends {SciVizComponent} - The base interface
 * @extends {SciVizQueried} - The queried interface
 */
export interface PlotComponent extends SciVizComponent, SciVizQueried {
    /** The list of channels to listen to */
    channels?: string[]
}

/**
 * The interface for Markdown components
 * @extends {SciVizComponent} - Omits `route`
 */
export interface MarkDownComponent extends Omit<SciVizComponent, 'route'> {
    /** The text to display */
    text: string

    /** The route to the image to use as a background  */
    image_route?: string
}

/**
 * The interface for Table components
 * @extends {SciVizComponent} - The base interface
 * @extends {SciVizQueried} - The queried interface
 */
export interface TableComponent extends SciVizComponent, SciVizQueried {
    /** The route of the hidden page to link rows to */
    link?: string

    /** The name of the component's channel */
    channel?: string

    /** The list of channels to listen to */
    channels?: string[]
}

/** An interface for SciViz components that get queried */
interface SciVizQueried {
    /** The restriction to use */
    restriction: string

    /** The query of the component */
    dj_query: string
}

/** The base interface for SciViz components */
interface SciVizComponent {
    /** The type of the component */
    type: string

    /** The route of the component */
    route: string

    /** The X coordinate of the component on its grid */
    x: number

    /** The Y coordinate of the component on its grid */
    y: number

    /** The height in cells of the component on its grid */
    height: number

    /** The width in cells of the component on its grid */
    width: number
}
