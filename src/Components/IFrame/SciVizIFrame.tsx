import { useContext } from 'react'
import { Card } from 'antd'
import { SciVizContext } from '../SciViz/SciVizContext'

interface iFrameProps {
    height: number
    url: string
}

function SciVizIFrame(props: iFrameProps) {
    const { componentContext } = useContext(SciVizContext)
    return (
        <Card
            style={{ width: '100%', height: props.height }}
            bodyStyle={{ height: '100%', padding: '5px' }}
            hoverable={true}
        >
            <iframe width='100%' style={{ height: '100%' }} src={props.url} />
        </Card>
    )
}

export default SciVizIFrame
