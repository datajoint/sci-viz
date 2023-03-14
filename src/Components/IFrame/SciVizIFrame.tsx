import { useContext } from 'react'
import { Card } from 'antd'
import { ExternalContext } from '../SciViz/SciVizContext'

interface iFrameProps {
    height: number
    url: string
    databaseHost?: string
}

function SciVizIFrame(props: iFrameProps) {
    const { iframeQueryParamMap } = useContext(ExternalContext)
    let url: URL | string = new URL(props.url)
    let params: {
        [k: string]: any
    } = {}

    if (iframeQueryParamMap)
        params = {
            ...Object.fromEntries(
                Object.entries(iframeQueryParamMap).map(([k, v]) => [
                    k,
                    typeof v === 'object' ? JSON.stringify(v) : v
                ])
            )
        }
    params = props.databaseHost ? { ...params, database_host: props.databaseHost } : params

    for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value)
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
