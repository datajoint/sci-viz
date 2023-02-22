import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUpdatePageStore, setPageStore } from './Redux/Slices/pageStoreSlice'
import { AppDispatch } from './Redux/store'
import { SciVizPageType, RestrictionStore } from './SciVizInterfaces'
import SciVizGrid from './SciVizGrid'
import './Page.css'

/** The interface for the SciVizPage props */
interface PageProps {
    /** The data of the page */
    page: SciVizPageType

    /** A JWT token to perform queries */
    jwtToken?: string

    /** A callback function for handling hidden pages */
    updateHiddenPage?: (route: string, queryParams: string) => void
}

/**
 * Dynamically creates a SciViz page
 *
 * @param {SciVizPageType} page - The data of the page
 * @param {string=} [jwtToken] - A JWT token to perform queries
 * @param {(route: string, queryParams: string) => void=} [updateHiddenPage] - A callback function for handling hidden pages
 *
 * @returns A SciViz page
 */
function SciVizPage(props: PageProps) {
    const dispatch = useDispatch<AppDispatch>()
    const [restrictionList, setRestrictionList] = useState<string[]>([])
    const [store, setStore] = useState<RestrictionStore>({})
    const pageData = props.page

    dispatch(setPageStore(store))
    useEffect(() => {
        dispatch(
            setUpdatePageStore((key: string, record: string[]) => {
                setStore((prevStore) => ({
                    ...prevStore,
                    [key]: record
                }))
            })
        )

        setRestrictionList(new URLSearchParams(window.location.search).toString().split('&'))
    }, [])

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
                            updateHiddenPage={props.updateHiddenPage}
                        />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default SciVizPage
