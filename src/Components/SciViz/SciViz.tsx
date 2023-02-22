import { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import { useDispatch } from 'react-redux'
import { setUpdateHiddenPage } from './Redux/HiddenPageSlice/hiddenPageSlice'
import { AppDispatch } from './Redux/store'
import { SciVizSpec } from './SciVizInterfaces'
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

/** The interface for an antd Tab item */
interface TabItem {
    /** The key of the tab */
    key: string

    /** The label of the tab */
    label: JSX.Element

    /** The content of the tab */
    children: JSX.Element
}

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
    const dispatch = useDispatch<AppDispatch>()
    const [hiddenItems, setHiddenItems] = useState<TabItem[][]>([])
    let pageMap: {
        [key: string]: TabItem
    } = {}
    let menuItems: TabItem[] = []

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
        var URL = window.location.href
        if (props.baseURL === URL) {
            return menuItems[0].key
        }
        var RegexLastWord = /\/([\w-]+)(?=\?|$)/
        var lastWord = URL.match(RegexLastWord)![0]
        return lastWord
    }

    Object.entries(props.spec.SciViz.pages).forEach(([name, page]) => {
        pageMap[page.route] = {
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
                <SciVizPage key={JSON.stringify(page)} jwtToken={props.jwtToken} page={page} />
            )
        }

        if (!page.hidden)
            menuItems.push({
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
                    />
                )
            })
    })
    useEffect(() => {
        dispatch(
            setUpdateHiddenPage((route: string, queryParams: string) => {
                var currRoute = getRoute()
                setRoute(`${route}?${queryParams}`)
                setHiddenItems((prevItems) => [
                    [pageMap[currRoute], pageMap[route]],
                    ...prevItems
                ])
            })
        )

        var newURL = props.baseURL.replace(/\/$/, '') + menuItems[0].key
        window.history.pushState(null, '', newURL)
    }, [])

    return (
        <Tabs
            centered
            type='line'
            size='large'
            items={hiddenItems.length ? hiddenItems[0] : menuItems}
            defaultActiveKey={getRoute()}
            activeKey={hiddenItems.length ? getRoute() : undefined}
            onChange={(activeKey) => {
                if (hiddenItems.length) {
                    setHiddenItems(hiddenItems.slice(1))
                }
                setRoute(pageMap[activeKey].key)
            }}
        />
    )
}

export default SciViz
