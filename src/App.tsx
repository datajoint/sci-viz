import React, { useEffect, useState } from 'react'
import { Alert, Spin } from 'antd'
import { SciVizSpec } from './Components/SciViz/SciVizInterfaces'
import Login from './Components/Login/Login'
import Footer from './Components/Footer/Footer'
import Header from './Components/Header/Header'
import SciViz from './Components/SciViz/SciViz'
import './App.css'
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'

window.onbeforeunload = () => ''

/** Top level state object interface */
interface DJGUIAppState {
    /** The jwt token obtained after logging in */
    jwtToken: string

    /** Name of the database that the user is connected to */
    hostname: string

    /** The SciViz spec object fetched from the public folder */
    spec: SciVizSpec | undefined

    /** The base url that SciViz will be hosted on*/
    baseURL: string

    /** The code for OIDC authentication */
    code: string | null

    /** The error message if OIDC authentication fails */
    errorMsg: string | null
}

function App() {
    const searchParams = new URLSearchParams(document.location.search)
    const [state, setState] = useState<DJGUIAppState>({
        jwtToken: '',
        hostname: '',
        spec: undefined,
        baseURL: ``,
        code: searchParams.get('code'),
        errorMsg: null
    })
    document.title = state.spec?.SciViz.website_title || 'SciViz'
    document
        .getElementById('favicon')!
        .setAttribute('href', `${state.spec?.SciViz.favicon_name || '/favicon.ico'}`)

    /**
     * A callback function to set jwt token and host name
     * @param jwt JWT token obtain after logging sucessfully from the backend
     * @param hostname Hostname of the database that is being connected to
     */
    const setJWTTokenAndHostName = (jwt: string, hostname: string) => {
        setState((prevState) => ({ ...prevState, jwtToken: jwt, hostname: hostname }))
    }

    useEffect(() => {
        fetch(`/sciviz_spec.json`)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setState((prevState) => ({
                    ...prevState,
                    spec: data as SciVizSpec,
                    baseURL: `https://${window.location.hostname}${data?.SciViz.route || ''}/`
                }))
            })
    }, [])

    if (!state.spec) return <Spin tip='Retrieving SciViz Spec' size='large' />
    else if (state.spec.SciViz.auth.oidc && !state.code && !state.jwtToken) {
        const redirect = window.location.hostname
        let transmitted_state: string = encodeURIComponent(
            JSON.stringify({ nextUrl: `${window.location.pathname}${window.location.search}` })
        )
        window.location.href = `${state.spec.SciViz.auth.endpoint}/protocol/openid-connect/auth?scope=openid&response_type=code&client_id=${state.spec.SciViz.auth.client_id}&code_challenge=ubNp9Y0Y_FOENQ_Pz3zppyv2yyt0XtJsaPqUgGW9heA&code_challenge_method=S256&redirect_uri=https://${redirect}&state=${transmitted_state}`
        return <Spin size='large' />
    } else if (!state.spec.SciViz.auth.oidc && !state.jwtToken) {
        return (
            <React.StrictMode>
                <Header
                    text={state.spec.SciViz.header?.text || 'Powered by datajoint'}
                    imageRoute={state.spec.SciViz.header?.image_route || '/logo.svg'}
                />
                <>
                    {window.history.pushState(null, '', `${state.baseURL}login`)}
                    <Login
                        setJWTTokenAndHostName={setJWTTokenAndHostName}
                        defaultAddress={state.spec.SciViz.hostname || state.hostname}
                        imageRoute={state.spec.SciViz.login?.image_route || '/logo.svg'}
                    ></Login>
                </>
                <Footer />
            </React.StrictMode>
        )
    } else if (state.code && !state.jwtToken) {
        let apiUrl = `/api/login?code=${state.code}&database_host=${state.spec.SciViz.auth.database}`
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (!response.ok)
                    return response.text().then((text) => {
                        return Promise.reject(text)
                    })
                return response.json()
            })
            .then((data) => {
                setState((prevState) => ({
                    ...prevState,
                    jwtToken: data
                }))
            })
            .catch((error) => {
                if (state.errorMsg !== error)
                    setState((prevState) => ({
                        ...prevState,
                        errorMsg: error
                    }))
            })
        return state.errorMsg ? (
            <Alert message={`Failed to log in:${state.errorMsg}`} type='error' />
        ) : (
            <Spin tip='Logging in with OIDC' size='large' />
        )
    } else {
        return (
            <React.StrictMode>
                <Header
                    text={state.spec.SciViz.header?.text || 'Powered by datajoint'}
                    imageRoute={state.spec.SciViz.header?.image_route || '/logo.svg'}
                />
                <SciViz spec={state.spec} baseURL={state.baseURL} jwtToken={state.jwtToken} />
                <Footer />
            </React.StrictMode>
        )
    }
}

export default App
