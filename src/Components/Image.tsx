import React from 'react'
import { Card } from 'antd'

interface ImageProps {
  route: string
  token: string
  restrictionList: Array<string>
  height: number | string
}

interface ImageState {
  imageLocation: string
}

/**
 * Image component
 */
export default class Image extends React.Component<ImageProps, ImageState> {
  constructor(props: ImageProps) {
    super(props)
    this.state = {
      imageLocation: '',
    }
  }

  componentDidMount() {
    let apiUrl =
      `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + this.props.route
    if (this.props.restrictionList.length > 0) {
      apiUrl = apiUrl + '?'
      apiUrl = apiUrl + this.props.restrictionList.shift()
      while (this.props.restrictionList.length > 0) {
        apiUrl = apiUrl + '&' + this.props.restrictionList.shift()
      }
    }
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
    }).then((result) =>
      result.blob().then((result) => {
        this.setState({ imageLocation: URL.createObjectURL(result) })
      })
    )
  }

  render() {
    return (
      <img
        src={this.state.imageLocation}
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    )
  }
}
