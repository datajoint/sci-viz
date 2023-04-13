import { createContext, useEffect, useState } from 'react'
import { Tabs } from 'antd'
import { SciVizSpec, TabItem } from './SciVizInterfaces'
import SciVizPage from './SciVizPage'

/** The interface for the SciVizPage props */
interface SciVizProps {
    /** The SciViz spec sheet */
    spec: SciVizSpec

    /** The URL that SciViz will be hosted at */
    baseURL: string

    /** A JWT token to perform queries */
    jwtToken?: string
}

export const MenuItemsContext = createContext<{
    menuItems: TabItem[] | undefined
    pageMap:
        | {
              [key: string]: TabItem
          }
        | undefined
}>({
    menuItems: undefined,
    pageMap: undefined
})

/**
 * Dynamically creates a SciViz app
 *
 * @param {SciVizSpec} spec - The SciViz spec sheet
 * @param {string} baseURL - The URL that SciViz will be hosted at
 * @param {string=} [jwtToken] - A JWT token to perform queries
 *
 * @returns A SciViz app
 */
function SciViz(props: SciVizProps) {
    const [pageMap, setPageMap] = useState<{
        [key: string]: TabItem
    }>({})
    const [menuItems, setMenuItems] = useState<TabItem[]>([])
    const [pageMemory, setPageMemory] = useState<TabItem | undefined>(undefined)
    const [pageIndex, setPageIndex] = useState<number | undefined>(undefined)

    /**
     * A function to set the current SciViz page route
     * @param {string} path - The route to set
     */
    const setRoute = (path: string) => {
        var URL = window.location.href
        var RegexLastWord = new RegExp('/([^/]+)/?$')
        var newURL = URL.replace(RegexLastWord, path!)
        window.history.pushState(null, '', newURL)
    }

    /**
     * A function to get the current SciViz page route
     * @returns The last route of the current URL
     */
    const getRoute = () => {
        return `/${window.location.pathname.split('/').pop()}`
    }

    /**
     * A callback function to display a SciViz hidden page.
     * Replaces the current tab bar with a new temporary one with just the hidden page and the previous page
     * @param route - The route of the hidden page
     * @param queryParams - The query params to restrict the components of the page by
     */
    const updateHiddenPage = (
        route: string,
        queryParams: string,
        currMenuItems: TabItem[],
        currPageMap: {
            [key: string]: TabItem
        }
    ) => {
        let currRoute = getRoute()
        let tempMenuItems = currMenuItems.map((obj) => ({ ...obj }))
        let tempPageMap = Object.assign({}, currPageMap)
        let index = tempMenuItems.findIndex((x) => x.key === currRoute)

        tempMenuItems[index].children = tempPageMap[route].children
        if (currRoute !== route) {
            setPageMemory(tempPageMap[currRoute])
            setPageIndex(index)
            setMenuItems(tempMenuItems)
            setRoute(`${route}?${queryParams}`)
        }
    }

    useEffect(() => {
        let tempPageMap: {
            [key: string]: TabItem
        } = {}
        let tempMenuItems: TabItem[] = []

        Object.entries(props.spec.SciViz.pages).forEach(([name, page]) => {
            tempPageMap[page.route] = {
                key: page.route,
                label: (
                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <div>{name}</div>
                    </span>
                ),
                children: (
                    <SciVizPage
                        key={JSON.stringify(page)}
                        jwtToken={props.jwtToken}
                        page={page}
                        updateHiddenPage={updateHiddenPage}
                    />
                )
            }

            if (!page.hidden)
                tempMenuItems.push({
                    key: page.route,
                    label: (
                        <span
                            style={{
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <div>{name}</div>
                        </span>
                    ),
                    children: (
                        <SciVizPage
                            key={JSON.stringify(page)}
                            jwtToken={props.jwtToken}
                            page={page}
                            updateHiddenPage={updateHiddenPage}
                        />
                    )
                })
        })
        setPageMap(tempPageMap)
        setMenuItems(tempMenuItems)
        var newURL = props.baseURL.replace(/\/$/, '') + tempMenuItems[0].key
        window.history.pushState(null, '', newURL)
    }, [])

    return (
        <MenuItemsContext.Provider
            value={{
                menuItems: menuItems.map((obj) => ({ ...obj })),
                pageMap: Object.assign({}, pageMap)
            }}
        >
            <Tabs
                centered
                type='line'
                size='large'
                items={menuItems}
                defaultActiveKey={pageMemory ? undefined : getRoute()}
                activeKey={pageMemory ? getRoute() : undefined}
                onTabClick={(activeKey) => {
                    if (pageMemory && pageIndex) {
                        let tempMenuItems = menuItems.map((obj) => ({ ...obj }))
                        tempMenuItems[pageIndex] = pageMemory
                        setMenuItems(tempMenuItems)
                        setPageMemory(undefined)
                        setPageIndex(undefined)
                    }
                    setRoute(pageMap[activeKey].key)
                }}
            />
            {pageIndex ? menuItems[pageIndex].children : <></>}
        </MenuItemsContext.Provider>
    )
}

export default SciViz
