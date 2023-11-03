import React from 'react'

interface ImageProps {
    route: string
    token: string
    restrictionList: Array<string>
    height: number | string
    databaseHost?: string
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
            imageLocation: ''
        }
    }

    componentDidMount() {
        let basePath = window.location.href.split('/')
        basePath.pop()

        let apiUrl =
            `${basePath.join('/')}${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` +
            this.props.route
        if (this.props.restrictionList.length > 0) {
            apiUrl = apiUrl + '?'
            apiUrl = apiUrl + this.props.restrictionList.shift()
            while (this.props.restrictionList.length > 0) {
                apiUrl = apiUrl + '&' + this.props.restrictionList.shift()
            }
        }

        if (this.props.databaseHost) {
            apiUrl = apiUrl.concat(`&database_host=${this.props.databaseHost}`)
        }

        fetch(apiUrl, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        }).then((result) =>
            result.blob().then((result) => {
                this.setState({ imageLocation: URL.createObjectURL(result) })
            })
        )
    }

    render() {
        return (
            <img
                alt=''
                src={this.state.imageLocation}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
        )
    }
}
