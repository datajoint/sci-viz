import { Tabs } from 'antd'
import { SciVizSpec } from './SciVizInterfaces'
import SciVizPage from './SciVizPage'

interface SciVizProps {
    spec: SciVizSpec
    baseURL: string
    jwtToken?: string
}

function SciViz(props: SciVizProps) {
    const menuItems = Object.entries(props.spec.SciViz.pages).map(([name, page]) => {
        if (page.hidden) return null
        return {
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
    })
    const filteredItems = menuItems.filter((item) => !!item) as {
        key: string
        label: JSX.Element
        children: JSX.Element
    }[]
    const changeURL = (path: string) => {
        var URL = window.location.href
        if (props.baseURL === URL) {
            var newURL = URL.replace(/\/$/, '') + filteredItems[0].key
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
            return filteredItems[0].key
        }
        var RegexLastWord = new RegExp('/([^/]+)/?$')
        var lastWord = URL.match(RegexLastWord)![0]
        return lastWord
    }
    changeURL(getRoute())

    return (
        <Tabs
            centered
            type='line'
            size='large'
            items={filteredItems}
            defaultActiveKey={getRoute()}
            onChange={(activeKey) =>
                changeURL(
                    filteredItems[filteredItems.findIndex((pages) => pages.key === activeKey)]
                        .key
                )
            }
        />
    )
}

export default SciViz
