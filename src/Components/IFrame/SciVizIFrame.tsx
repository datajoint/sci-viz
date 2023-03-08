import { useContext } from 'react'
import { Card } from 'antd'
import { ExternalContext } from '../SciViz/SciVizContext'

interface iFrameProps {
    height: number
    url: string
    databaseHost?: string
}

function SciVizIFrame(props: iFrameProps) {
    const { componentContext } = useContext(ExternalContext)
    let url = props.url

    if (url.indexOf('?') !== -1) {
        url += `${componentContext ? '&context=' + JSON.stringify(componentContext) : ''}`
        url += `${props.databaseHost ? '&database_host=' + props.databaseHost : ''}`
    } else {
        url += `${componentContext ? '?context=' + JSON.stringify(componentContext) : ''}`
        if (url.indexOf('?') !== -1) {
            url += `${props.databaseHost ? '&database_host=' + props.databaseHost : ''}`
        } else {
            url += `${props.databaseHost ? '?database_host=' + props.databaseHost : ''}`
        }
    }

    return (
        <Card
            style={{ width: '100%', height: props.height }}
            bodyStyle={{ height: '100%', padding: '5px' }}
            hoverable={true}
        >
            <iframe width='100%' style={{ height: '100%' }} src={url} />
        </Card>
    )
}

export default SciVizIFrame
