import { Button } from 'antd'
import { useEffect, useState } from 'react'
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
}

interface FrameChunk {
  frameMeta: {
    fps: number
    frameCount: number
    finalChunk: boolean
  }
  frames: Array<string>
}

// var pendingRequestBatch: boolean = false
var currentChunk: FrameChunk | undefined
var numFramesQueried: number = 0
var chunkBuffer: Array<FrameChunk> = []
var intervalID: NodeJS.Timer | undefined

function Slideshow(props: SlideshowProps) {
  const [currentFrame, setCurrentFrame] = useState<string>('')
  const [playing, setPlaying] = useState<boolean>(false)
  // const [chunkBuffer, setChunkBuffer] = useState<Array<FrameChunk>>([])
  const [pendingRequestBatch, setPendingRequestBatch] = useState<boolean>(false)
  const getFrames = async (): Promise<FrameChunk> => {
    let apiUrl =
      `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` +
      props.route +
      `?chunk_size=${props.chunkSize}` +
      `&start_frame=${numFramesQueried}`
    numFramesQueried += props.chunkSize
    return fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.token,
      },
    })
      .then((result) => {
        return result.json()
      })
      .then((result) => {
        return result as Promise<FrameChunk>
      })
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
  useEffect(() => {
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
        // setChunkBuffer(chunkBuffer.concat(result))
        setPendingRequestBatch(false)
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
  })
  return (
    <>
      <img
        height={props.height}
        src={`data:image/jpeg;base64,${currentFrame}`}
        alt="vid"
      ></img>
      <Button
        // icon={
        //   <FontAwesomeIcon
        //     icon={'fa-solid fa-play' as IconProp}
        onClick={() => {
          setPlaying(!playing)
        }}
        //   />
        // }
      >
        play/pause
      </Button>
    </>
  )
}
export default Slideshow
