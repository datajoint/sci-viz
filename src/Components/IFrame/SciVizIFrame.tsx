import { useContext } from 'react'
import { Card } from 'antd'
import { ExternalContext } from '../SciViz/SciVizContext'

interface iFrameProps {
    height: number
    url: string
    databaseHost?: string
}

function SciVizIFrame(props: iFrameProps) {
    const { iframeParamMap } = useContext(ExternalContext)
    let url: URL | string = new URL(props.url)
    let params = props.databaseHost
        ? { ...iframeParamMap, database_host: props.databaseHost }
        : iframeParamMap

    if (params)
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.append(
                key,
                typeof value === 'object' ? JSON.stringify(value) : value
            )
        }

    url = url.toString()

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
