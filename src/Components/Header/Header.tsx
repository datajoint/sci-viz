import React from 'react'
import './Header.css'

interface HeaderProps {
    imageRoute: string
    text: string
}

interface HeaderState {}

/**
 * Header component
 */
export default class Header extends React.Component<HeaderProps, HeaderState> {
    render() {
        return (
            <header>
                <img className='header-img' src={this.props.imageRoute} alt='Sci-viz logo' />
                <div className='header-content'>
                    <text>
                        <i style={{ paddingLeft: '20px' }}>{this.props.text}</i>
                    </text>
                </div>
            </header>
        )
    }
}
