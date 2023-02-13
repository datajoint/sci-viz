import React from 'react'
import Login from './Components/Login/Login'
import Footer from './Components/Footer/Footer'
import Header from './Components/Header/Header'
import SciViz from './Components/SciViz/SciViz'
import { SciVizSpec } from './Components/SciViz/SciVizInterfaces'
import './App.css'
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'

window.onbeforeunload = () => ''

interface DJGUIAppProps {}

interface DJGUIAppState {
    jwtToken: string // Storage object for JWT token obtain after logging in successfully
    hostname: string // Name of the database that the user is connected to
    spec: SciVizSpec | undefined
    baseURL: string
}

export default class App extends React.Component<DJGUIAppProps, DJGUIAppState> {
    constructor(props: DJGUIAppProps) {
        super(props)
        this.state = {
            jwtToken: '',
            hostname: '',
            spec: undefined,
            baseURL: ``
        }

        this.setJWTTokenAndHostName = this.setJWTTokenAndHostName.bind(this)
        this.getBasename = this.getBasename.bind(this)
    }

    /**
     * Setter function for jwt token and host name
     * @param jwt JWT token obtain after logging sucessfully from the backend
     * @param hostname Hostname of the database that is being connected to
     */
    setJWTTokenAndHostName(jwt: string, hostname: string) {
        this.setState({ jwtToken: jwt, hostname: hostname })
    }
    getBasename() {
        if (window.location.href.split('/').length == 4) {
            return ''
        } else {
            let arr = window.location.href.split('/').splice(3)
            arr.pop() // pop the empty string
            return '/' + arr.join('/')
        }
    }
    componentDidMount(): void {
        fetch(`https://${window.location.hostname}/sciviz_spec.json`)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                this.setState({ spec: data as SciVizSpec })
                this.setState({
                    baseURL: `https://${window.location.hostname}${
                        this.state.spec?.SciViz.route || ''
                    }/`
                })
            })
    }

    render() {
        return (
            <div>
                {this.state.spec ? (
                    <>
                        <Header
                            text='Powered by datajoint'
                            imageRoute={require('./logo.svg')['default']}
                        />
                        {this.state.jwtToken !== '' ? (
                            <>
                                {window.history.pushState(null, '', this.state.baseURL)}
                                <SciViz
                                    spec={this.state.spec}
                                    baseURL={this.state.baseURL}
                                    jwtToken={this.state.jwtToken}
                                />
                            </>
                        ) : (
                            <>
                                {window.history.pushState(
                                    null,
                                    '',
                                    `${this.state.baseURL}login`
                                )}
                                <Login
                                    setJWTTokenAndHostName={this.setJWTTokenAndHostName}
                                    defaultAddress='localdb'
                                    imageRoute={require('./logo.svg')['default']}
                                ></Login>
                            </>
                        )}
                        <Footer />{' '}
                    </>
                ) : (
                    <>loading</>
                )}
            </div>
        )
    }
}
