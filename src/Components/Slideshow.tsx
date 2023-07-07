import { Button, Card, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
interface RestrictionStore {
    [key: string]: Array<string>
}

interface SlideshowProps {
    token: string
    route: string
    height: number
    restrictionList: Array<string>
    channelList?: Array<string>
    store?: RestrictionStore
    maxFPS: number // Max fps to play the video at
    chunkSize: number // Number of frames per request
    bufferSize: number // Number of chunks to buffer
    batchSize: number // Number of concurrent requests
    databaseHost?: string
}

interface FrameChunk {
    frameMeta: {
        fps: number
        frameCount: number
        finalChunk: boolean
    }
    frames: Array<string>
}

var currentChunk: FrameChunk | undefined
var numFramesQueried: number = 0
var chunkBuffer: Array<FrameChunk> = []
var intervalID: NodeJS.Timer | undefined

function Slideshow(props: SlideshowProps) {
    // States

    const [store, setStore] = useState<RestrictionStore | undefined>(props.store)
    const [currentFrame, setCurrentFrame] = useState<string>('')
    const [playing, setPlaying] = useState<boolean>(false)
    const [pendingRequestBatch, setPendingRequestBatch] = useState<boolean>(false)

    // Async functions
    const getFrames = async (): Promise<FrameChunk> => {
        let basePath = window.location.href.split('/')
        basePath.pop()

        let apiUrl =
            `${basePath.join('/')}${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` +
            props.route +
            `?chunk_size=${props.chunkSize}` +
            `&start_frame=${numFramesQueried}`
        if (props.channelList && storeReady(props.channelList, store!)) {
            let queryParamList: Array<string> = []
            for (let i in props.channelList) {
                queryParamList = queryParamList.concat(store![props.channelList[+i]])
            }
            apiUrl = apiUrl + '&' + queryParamList.join('&')
        }
        numFramesQueried += props.chunkSize

        if (props.databaseHost) {
            apiUrl = apiUrl.concat(`&database_host=${props.databaseHost}`)
        }

        return fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + props.token
            }
        })
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                return result as Promise<FrameChunk>
            })
    }

    // Functions

    // Resets the slideshow to its default state
    // Used when the restriction store changes and when the user hits the refresh button
    function reset() {
        currentChunk = undefined
        numFramesQueried = 0
        chunkBuffer = []
        intervalID = undefined
        setStore(props.store)
        setCurrentFrame('')
        setPendingRequestBatch(false)
        setPlaying(false)
    }

    function nextFrame() {
        if (currentChunk === undefined) {
            currentChunk = chunkBuffer.shift()
            return currentChunk?.frames.shift()
        } else if (currentChunk && currentChunk?.frames.length) {
            return currentChunk.frames.shift()
        } else {
            currentChunk = chunkBuffer.shift()
            return currentChunk?.frames.shift()
        }
    }

    // Returns True if the store is completly populated
    function storeReady(channelList: Array<string>, store: RestrictionStore): boolean {
        let channelCheckArr = Array<boolean>()
        channelList.forEach((element) => {
            if (store[element] && store[element].length) {
                channelCheckArr.push(true)
            } else {
                channelCheckArr.push(false)
            }
        })
        return !channelCheckArr.includes(false)
    }

    // Compares two Stores to see if the channels in the list have changed
    function storeComparison(
        store1: RestrictionStore,
        store2: RestrictionStore,
        channelList: Array<string>
    ): boolean {
        var store1Array: Array<Array<string>> = []
        var store2Array: Array<Array<string>> = []
        channelList.forEach((element) => {
            store1Array.push(store1[element])
            store2Array.push(store2[element])
        })
        return JSON.stringify(store1Array) === JSON.stringify(store2Array)
    }

    useEffect(() => {
        if (props.channelList) {
            if (!storeComparison(props.store!, store!, props.channelList)) {
                setStore(props.store!)
                reset()
            } else if (storeReady(props.channelList, store!)) {
                slideshowEngine()
            }
        } else {
            slideshowEngine()
        }

        function slideshowEngine() {
            if (
                chunkBuffer.length < props.bufferSize &&
                props.bufferSize - chunkBuffer.length >= props.batchSize &&
                !pendingRequestBatch
            ) {
                setPendingRequestBatch(true)
                let promiseArray: Array<Promise<FrameChunk>> = []
                for (let i = 0; i < props.batchSize; i++) {
                    promiseArray.push(getFrames())
                }
                Promise.all(promiseArray).then((result) => {
                    chunkBuffer = chunkBuffer.concat(result)
                    setPendingRequestBatch(false)

                    if (currentFrame === '') {
                        setCurrentFrame(nextFrame()!)
                    }
                })
            }
            if (playing && intervalID === undefined) {
                intervalID = setInterval(() => {
                    setCurrentFrame(nextFrame()!)
                }, 1000 / props.maxFPS)
            } else if (!playing && intervalID !== undefined) {
                clearInterval(intervalID)
                intervalID = undefined
            }
        }
    })
    return (
        <Card
            style={{ width: '100%', height: props.height }}
            bodyStyle={{ height: '100%' }}
            hoverable={true}
        >
            {currentFrame === '' || currentFrame === undefined ? (
                <div style={{ height: '95%' }}>
                    <Spin
                        size='large'
                        style={{
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                    />
                </div>
            ) : (
                <img
                    style={{ display: 'block', margin: 'auto' }}
                    height={'95%'}
                    src={`data:image/jpeg;base64,${currentFrame}`}
                    alt='vid'
                />
            )}
            <div style={{ display: 'block' }}>
                <Button
                    onClick={() => {
                        setPlaying(!playing)
                    }}
                >
                    {playing ? (
                        <FontAwesomeIcon icon={faPause} />
                    ) : (
                        <FontAwesomeIcon icon={faPlay} />
                    )}
                </Button>
                <Button
                    onClick={() => {
                        reset()
                    }}
                >
                    RESET
                </Button>
            </div>
        </Card>
    )
}
export default Slideshow
