import { useEffect, useState } from 'react'
import { SciVizPage, RestrictionStore } from './SciVizInterfaces'
import SciVizGrid from './SciVizGrid'

interface PageProps {
    page: SciVizPage
    jwtToken: string
}

function SciVizPage(props: PageProps) {
    const [restrictionList, setRestrictionList] = useState<string[]>([])
    const [store, setStore] = useState<RestrictionStore>({})
    const pageData = props.page

    useEffect(() => {
        setRestrictionList(new URLSearchParams(window.location.search).toString().split('&'))
    }, [])
    const updateRestrictionList = (queryParams: string): string => {
        setRestrictionList(new URLSearchParams(queryParams).toString().split('&'))
        return queryParams
    }
    const updateStore = (key: string, record: string[]) => {
        let myStore = store || { [key]: record }
        myStore[key] = record
        setStore(myStore)
    }

    return (
        <div>
            <div className='grid-container'>
                <ul className='grid-list'>
                    {Object.entries(pageData.grids).map(([name, grid]) => (
                        <SciVizGrid
                            name={name}
                            grid={grid}
                            jwtToken={props.jwtToken}
                            restrictionList={restrictionList}
                            store={store}
                            updateRestrictionList={updateRestrictionList}
                            updateStore={updateStore}
                        />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default SciVizPage
