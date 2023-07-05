import { useState, useEffect } from 'react'
import packageInfo from '../../../package.json'

import './Footer.css'

function Footer() {
    const [backendVersion, setBackendVersion] = useState('')

    async function getVersionNumber() {
        const response = await fetch(
            `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}/version`,
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
                    <b>Front End Version:</b> {packageInfo.version} <b>Back End Version:</b>{' '}
                    {backendVersion}
                </div>
            </div>
        </footer>
    )
}

export default Footer
