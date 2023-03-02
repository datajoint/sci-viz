import { useEffect, useState } from 'react'
import { QueryClient } from 'react-query'
import { SciVizPageType, RestrictionStore } from './SciVizInterfaces'
import SciVizGrid from './SciVizGrid'
import './Page.css'

/** The interface for the SciVizPage props */
interface PageProps {
    /** The data of the page */
    page: SciVizPageType

    /** A JWT token to perform queries */
    jwtToken?: string

    /** The query client to use for dynamic form queries */
    queryClient?: QueryClient

    /** An override for the query prefix */
    apiPrefix?: string

    /** An override for the query suffix */
    apiSuffix?: string

    /** An override for the loading spinner */
    spinner?: JSX.Element

    /** A callback function for handling hidden pages */
    updateHiddenPage?: (route: string, queryParams: string) => void
}

/**
 * Dynamically creates a SciViz page
 *
 * @param {SciVizPageType} page - The data of the page
 * @param {string=} [jwtToken] - A JWT token to perform queries
 * @param {QueryClient=} queryClient - The query client to use for dynamic form queries
 * @param {string=} apiPrefix - An override for the query prefix
 * @param {string=} apiSuffix - An override for the query suffix
 * @param {JSX.Element=} spinner - An override for the loading spinner
 * @param {(route: string, queryParams: string) => void=} [updateHiddenPage] - A callback function for handling hidden pages
 *
 * @returns A SciViz page
 */
function SciVizPage(props: PageProps) {
    const [restrictionList, setRestrictionList] = useState<string[]>([])
    const [store, setStore] = useState<RestrictionStore>({})
    const pageData = props.page

    useEffect(() => {
        setRestrictionList(new URLSearchParams(window.location.search).toString().split('&'))
    }, [])

    /**
     * A callback function to refresh the restriction list
     * @param {string} queryParam - The query paramters to set the restriciton list as
     * @returns The query params
     */
    const updateRestrictionList = (queryParams: string): string => {
        setRestrictionList(new URLSearchParams(queryParams).toString().split('&'))
        return queryParams
    }

    /**
     * A callback function to refresh the page store
     * @param {string} key - The key of the component that the store object belongs to
     * @param {string[]} record - The list of key-values as strings to add to the store
     */
    const updateStore = (key: string, record: string[]) => {
        setStore((prevStore) => ({
            ...prevStore,
            [key]: record
        }))
    }

    return (
        <div>
            <div className='grid-container'>
                <ul className='grid-list'>
                    {Object.entries(pageData.grids).map(([name, grid]) => (
                        <SciVizGrid
                            key={JSON.stringify(grid)}
                            name={name}
                            grid={grid}
                            jwtToken={props.jwtToken}
                            restrictionList={[...restrictionList]}
                            store={Object.assign({}, store)}
                            queryClient={props.queryClient}
                            apiPrefix={props.apiPrefix}
                            apiSuffix={props.apiSuffix}
                            spinner={props.spinner}
                            updateRestrictionList={updateRestrictionList}
                            updateStore={updateStore}
                            updateHiddenPage={props.updateHiddenPage}
                        />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default SciVizPage
