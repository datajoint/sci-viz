import { Tabs } from 'antd'
import { SciVizSpec } from './SciVizInterfaces'
import SciVizPage from './SciVizPage'

interface SciVizProps {
    spec: SciVizSpec
    jwtToken?: string
}

/**
 * Dynamically creates a SciViz app
 *
 * @param {SciVizSpec} spec - The SciViz spec sheet
 * @param {string=} jwtToken - A JWT token to perform queries
 *
 * @returns A SciViz app
 */
function SciViz(props: SciVizProps) {
    const menuItems = Object.entries(props.spec.SciViz.pages).map(([name, page]) => ({
        key: JSON.stringify(page),
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
    }))
    return (
        <Tabs
            centered
            type='line'
            size='large'
            items={menuItems}
            defaultActiveKey={menuItems[0].key}
        />
    )
}

export default SciViz
