import { useState, useEffect } from 'react'
import { version } from '../../../package.json'

import './Footer.css'

function Footer() {
    const [backendVersion, setBackendVersion] = useState('')

    async function getVersionNumber() {
        let basePath = window.location.href.split('/')
        basePath.pop()
        const response = await fetch(
            `${basePath.join('/')}${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}/version`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        )

        if (response.status === 500) {
            throw new Error('Unable to get version number')
        }

        return response.json()
    }

    useEffect(() => {
        getVersionNumber()
            .then((result) => {
                if (result.version) {
                    setBackendVersion(result.version)
                }
            })
            .catch((error) => {
                setBackendVersion('Unable to get version number')
            })
    }, [])

    return (
        <footer>
            <div className='footer-content'>
                <p>© 2023, DataJoint SciViz</p>
            </div>
            <div className='version-info-div'>
                <div className='version-number'>
                    <b>Front End Version:</b> {version} <b>Back End Version:</b>{' '}
                    {backendVersion}
                </div>
            </div>
        </footer>
    )
}

export default Footer
