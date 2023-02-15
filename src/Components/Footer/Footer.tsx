import React from 'react'
import { version } from '../../../package.json'

import './Footer.css'

interface FooterProps {
    databaseHost?: 'CHETANA'
}

interface FooterState {
    backendVersion: string
}

/**
 * Footer component
 */
export default class Footer extends React.Component<FooterProps, FooterState> {
    constructor(props: FooterProps) {
        super(props)

        this.state = {
            backendVersion: ''
        }
    }

    /**
     * Get the version number upon being mounted.
     */
    componentDidMount() {
        let apiUrl = `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}/version`

        if (this.props.databaseHost) {
            apiUrl = apiUrl.concat(`&database_host=${this.props.databaseHost}`)
        }

        fetch(apiUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((result) => {
                // Check for error mesage 500, if so throw and error
                if (result.status === 500) {
                    throw new Error('Unable to get version number')
                }

                return result.json()
            })
            .then((result) => {
                if (result.version) {
                    this.setState({ backendVersion: result.version })
                }
            })
            .catch((error) => {
                this.setState({ backendVersion: 'Unable to get version number' })
            })
    }

    render() {
        return (
            <footer>
                <div className='footer-content'>
                    <p>© 2021, DataJoint SciViz</p>
                </div>
                <div className='version-info-div'>
                    <div className='version-number'>
                        <b>Front End Version:</b> {version} <b>Back End Version:</b>{' '}
                        {this.state.backendVersion}
                    </div>
                </div>
            </footer>
        )
    }
}
