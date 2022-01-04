import React from 'react'

interface ImageProps {
  route: string
  token: string
  restrictionList: Array<string>
}

interface ImageState {
  image: any
}

/**
 * Image component
 */
export default class Image extends React.Component<ImageProps, ImageState> {
  constructor(props: ImageProps) {
    super(props)
    this.state = {
      image: {},
    }
  }

  componentDidMount() {
    let apiUrl =
      `${process.env.REACT_APP_DJLABBOOK_BACKEND_PREFIX}` + this.props.route
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
        this.setState({ image: URL.createObjectURL(result) })
      })
    )
    console.log(this.state.image)
  }

  render() {
    return <img src={this.state.image} />
  }
}
