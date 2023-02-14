import { useState } from 'react'
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
    const [hiddenPage, setHiddenPage] = useState('')
    let pageMap: {
        [key: string]: PageItem
    } = {}
    let menuItems: PageItem[] = []
    const changeURL = (path: string) => {
        var URL = window.location.href
        if (props.baseURL === URL) {
            var newURL = URL.replace(/\/$/, '') + menuItems[0].key
            window.history.pushState(null, '', newURL)
            return
        } else {
            var RegexLastWord = new RegExp('/([^/]+)/?$')
            var newURL = URL.replace(RegexLastWord, path)
            window.history.pushState(null, '', newURL)
            return
        }
    }
    const getRoute = () => {
        var URL = window.location.href
        if (props.baseURL === URL) {
            return menuItems[0].key
        }
        var RegexLastWord = new RegExp('/([^/]+)/?$')
        var lastWord = URL.match(RegexLastWord)![0]
        return lastWord
    }
    const updateHiddenPage = (route: string, queryParams: string) => {
        changeURL(`${route}?${queryParams}`)
        setHiddenPage(route)
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
    if (hiddenPage) menuItems.push(pageMap[hiddenPage])
    changeURL(getRoute())

    return (
        <Tabs
            centered
            type='line'
            size='large'
            items={menuItems}
            defaultActiveKey={getRoute()}
            activeKey={hiddenPage ? hiddenPage : undefined}
            onChange={(activeKey) => {
                if (hiddenPage) {
                    menuItems.pop()
                    setHiddenPage('')
                }
                changeURL(pageMap[activeKey].key)
            }}
        />
    )
}

export default SciViz
