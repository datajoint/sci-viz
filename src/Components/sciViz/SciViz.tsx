import { Tabs } from 'antd'
import { SciVizSpec } from './SciVizInterfaces'
import SciVizPage from './SciVizPage'

interface SciVizProps {
    jwtToken: string
    spec: SciVizSpec
}

function SciViz(props: SciVizProps) {
    const menuItems = Object.entries(props.spec.SciViz.pages).map(([name, page]) => ({
        key: name,
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
        children: <SciVizPage key={name} jwtToken={props.jwtToken} page={page} />
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
