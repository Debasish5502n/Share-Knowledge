import React from 'react'
import './Nav.css'

const Nav = () => {
    return (
        <>
        <div className='nav_contener'>
            <div className='left_contener'>
                <div className='logo'>Coding</div>
            </div>

            <div className='right_contener'>
                <a href='#'>Home</a>
                <a href='#'>About</a>
                <a href='#'>Contact</a>
                <a href='#'>Submit</a>

                <div className='search_box'>
                <input className='search_input' type="text" placeholder="Search..."></input>
                <button type="submit" className="search-button">Search</button>
                </div>
            </div>
        </div>
        <div className='nav_divider'></div>
        </>
    )
}

export default Nav