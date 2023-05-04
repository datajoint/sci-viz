import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import './Login.css'

interface LoginProps {
    setJWTTokenAndHostName: (jwt: string, hostname: string) => void // Call back function to setting the jwtToken
    imageRoute?: string
    defaultAddress?: string
    databaseHost?: string
}

interface LoginState {
    databaseAddress: string // Buffer object to store databaseAddress
    username: string // Buffer object to store username
    password: string // Buffer object to store password
    rememberMe: boolean // For storing the state if the user wants to remeber login info or not
    returnMessage: string // Buffer for error message from the server
}

/**
 * Component for handling authencation against the backend to connect to a mysql database
 */
function Login(props: LoginProps) {
    const [databaseAddress, setDatabaseAddress] = useState(props.defaultAddress || '')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [returnMessage, setReturnMessage] = useState('')

    useEffect(() => {
        const usernameCookie = Cookies.get('username')
        if (props.defaultAddress) {
            setUsername(usernameCookie || '')
        } else {
            const databaseAddressCookie = Cookies.get('databaseAddress')
            setDatabaseAddress(databaseAddressCookie || '')
            setUsername(usernameCookie || '')
        }
    }, [props.defaultAddress])

    function onDatabaseAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
        setDatabaseAddress(event.target.value)
    }

    function onUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value)
    }

    function onPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value)
    }

    function onRememberMeChange(event: React.ChangeEvent<HTMLInputElement>) {
        setRememberMe(event.target.checked)
    }

    async function onSubmit() {
        if (rememberMe) {
            Cookies.set('databaseAddress', databaseAddress)
            Cookies.set('username', username)
        }
        let apiUrl = `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}/login`
        if (props.databaseHost) {
            apiUrl = apiUrl.concat(`&database_host=${props.databaseHost}`)
        }
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                databaseAddress: databaseAddress,
                username: username,
                password: password
            })
        })
        if (response.status === 500) {
            const errorMessage = await response.text()
            setReturnMessage(errorMessage.toString())
            return
        }
        const jsonObject = await response.json()
        props.setJWTTokenAndHostName(jsonObject.jwt, databaseAddress)
    }

    function isFormReady() {
        return databaseAddress && username && password
    }

    return (
        <div className='login-div'>
            <div className='login-container'>
                <img
                    className='login-top-logo'
                    src={props.imageRoute}
                    alt='datajoint gui logo'
                />
                <form className='login-form'>
                    {props.defaultAddress ? (
                        <b>Target DB: {databaseAddress}</b>
                    ) : (
                        <>
                            <label className='login-input-label'>Host/Database Address</label>
                            <input
                                className='login-input'
                                type='text'
                                id='database-server'
                                value={databaseAddress}
                                onChange={onDatabaseAddressChange}
                            ></input>
                        </>
                    )}
                    <label className='login-input-label'>Username</label>
                    <input
                        className='login-input'
                        type='text'
                        id='username'
                        value={username}
                        onChange={onUsernameChange}
                    ></input>
                    <label className='login-input-label'>Password</label>
                    <input
                        className='login-input'
                        type='password'
                        id='password'
                        value={password}
                        onChange={onPasswordChange}
                    ></input>
                    <div className='login-interaction-div'>
                        <div>
                            <input
                                className='remember-me-checkbox'
                                type='checkbox'
                                id='remember-me-checkbox'
                                checked={rememberMe}
                                onChange={onRememberMeChange}
                            ></input>
                            <label
                                className='remember-me-checkbox-label'
                                htmlFor='remember-me-checkbox'
                            >
                                Remember Me
                            </label>
                        </div>
                        <button
                            className={
                                isFormReady()
                                    ? 'login-input-button ready'
                                    : 'login-input-button'
                            }
                            disabled={!isFormReady()}
                            onClick={onSubmit}
                            type='button'
                        >
                            Connect
                        </button>
                    </div>
                    <p className='form-message'>{returnMessage}</p>
                </form>
            </div>
        </div>
    )
}

export default Login
