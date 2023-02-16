import { useEffect, useState } from 'react'
import Login from './Components/Login/Login'
import Footer from './Components/Footer/Footer'
import Header from './Components/Header/Header'
import SciViz from './Components/SciViz/SciViz'
import { SciVizSpec } from './Components/SciViz/SciVizInterfaces'
import './App.css'
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'

window.onbeforeunload = () => ''

interface DJGUIAppState {
    jwtToken: string // Storage object for JWT token obtain after logging in successfully
    hostname: string // Name of the database that the user is connected to
    spec: SciVizSpec | undefined
    baseURL: string
}

function App() {
    const [state, setState] = useState<DJGUIAppState>({
        jwtToken: '',
        hostname: '',
        spec: undefined,
        baseURL: ``
    })
    document.title = state.spec?.SciViz.website_title || 'SciViz'
    document
        .getElementById('favicon')!
        .setAttribute('href', `/${state.spec?.SciViz.favicon_name || 'favicon.ico'}`)

    /**
     * A callback function to set jwt token and host name
     * @param jwt JWT token obtain after logging sucessfully from the backend
     * @param hostname Hostname of the database that is being connected to
     */
    const setJWTTokenAndHostName = (jwt: string, hostname: string) => {
        setState((prevState) => ({ ...prevState, jwtToken: jwt, hostname: hostname }))
    }

    useEffect(() => {
        fetch(`https://${window.location.hostname}/sciviz_spec.json`)
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

    return (
        <div>
            {state.spec ? (
                <>
                    <Header
                        text={state.spec.SciViz.header?.text || 'Powered by datajoint'}
                        imageRoute={
                            state.spec.SciViz.header?.image_route
                                ? require(state.spec.SciViz.header.image_route)['default']
                                : require('./logo.svg')['default']
                        }
                    />
                    {state.spec.SciViz.auth && !state.jwtToken ? (
                        <>
                            {window.history.pushState(null, '', `${state.baseURL}login`)}
                            <Login
                                setJWTTokenAndHostName={setJWTTokenAndHostName}
                                defaultAddress={state.spec.SciViz.hostname || state.hostname}
                                imageRoute={
                                    state.spec.SciViz.login?.image_route
                                        ? require(state.spec.SciViz.login.image_route)[
                                              'default'
                                          ]
                                        : require('./logo.svg')['default']
                                }
                            ></Login>
                        </>
                    ) : (
                        <>
                            <SciViz
                                spec={state.spec}
                                baseURL={state.baseURL}
                                jwtToken={state.jwtToken}
                            />
                        </>
                    )}
                    <Footer />
                </>
            ) : (
                <>Retrieving Spec file</>
            )}
        </div>
    )
}

export default App
