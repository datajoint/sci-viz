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
    let url = props.url
    let appendSymbol = url.indexOf('?') === -1 ? '?' : '&'
    let qParams: string | undefined

    if (iframeQueryParamMap)
        qParams =
            Object.entries(iframeQueryParamMap)
                .map(([key, value]) => {
                    return `${key}=${JSON.stringify(value)}`
                })
                .join('&') +
            `${props.databaseHost ? '&database_host=' + props.databaseHost : ''}`

    url += `${
        qParams
            ? appendSymbol + qParams
            : props.databaseHost
            ? `${appendSymbol}database_host=${props.databaseHost}`
            : ''
    }`

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
