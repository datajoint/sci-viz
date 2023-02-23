import { useEffect, useState, createContext } from 'react'
import { SciVizPageType, RestrictionStore } from './SciVizInterfaces'
import SciVizGrid from './SciVizGrid'
import './Page.css'

export interface StoreContextType {
    store: RestrictionStore | undefined
    updateStore: ((key: string, record: string[]) => void) | undefined
}

export const StoreContext = createContext<StoreContextType>({
    store: undefined,
    updateStore: undefined
})

/** The interface for the SciVizPage props */
interface PageProps {
    /** The data of the page */
    page: SciVizPageType

    /** A JWT token to perform queries */
    jwtToken?: string
}

/**
 * Dynamically creates a SciViz page
 *
 * @param {SciVizPageType} page - The data of the page
 * @param {string=} [jwtToken] - A JWT token to perform queries
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
                        <StoreContext.Provider value={{ store, updateStore }}>
                            <SciVizGrid
                                key={JSON.stringify(grid)}
                                name={name}
                                grid={grid}
                                jwtToken={props.jwtToken}
                                restrictionList={[...restrictionList]}
                            />
                        </StoreContext.Provider>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default SciVizPage
