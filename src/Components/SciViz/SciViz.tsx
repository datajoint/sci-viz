import { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import { SciVizSpec } from './SciVizInterfaces'
import SciVizPage from './SciVizPage'

interface SciVizProps {
    spec: SciVizSpec
    baseURL: string
    jwtToken?: string
}

interface PageItem {
    key: string
    label: JSX.Element
    children: JSX.Element
}

function SciViz(props: SciVizProps) {
    const [hiddenItems, setHiddenItems] = useState<PageItem[][]>([])
    let pageMap: {
        [key: string]: PageItem
    } = {}
    let menuItems: PageItem[] = []
    const changeURL = (path?: string) => {
        var URL = window.location.href
        var RegexLastWord = new RegExp('/([^/]+)/?$')
        var newURL = URL.replace(RegexLastWord, path!)
        window.history.pushState(null, '', newURL)
    }
    const getRoute = () => {
        var URL = window.location.href
        if (props.baseURL === URL) {
            return menuItems[0].key
        }
        var RegexLastWord = /\/([\w-]+)(?=\?|$)/
        var lastWord = URL.match(RegexLastWord)![0]
        return lastWord
    }
    const updateHiddenPage = (route: string, queryParams: string) => {
        var currRoute = getRoute()
        changeURL(`${route}?${queryParams}`)
        setHiddenItems((prevItems) => [[pageMap[currRoute], pageMap[route]], ...prevItems])
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
                <SciVizPage
                    key={JSON.stringify(page)}
                    jwtToken={props.jwtToken}
                    page={page}
                    updateHiddenPage={updateHiddenPage}
                />
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
                        updateHiddenPage={updateHiddenPage}
                    />
                )
            })
    })
    useEffect(() => {
        var URL = window.location.href
        var newURL = URL.replace(/\/$/, '') + menuItems[0].key
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
                changeURL(pageMap[activeKey].key)
            }}
        />
    )
}

export default SciViz
