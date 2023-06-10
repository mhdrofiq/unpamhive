import { useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'

import useLogout from "../hooks/useLogout";
import logo from '../img/logo3.png'
import useAuth from '../hooks/useAuth';

const DASH_REGEX = /^\/dash(\/)?$/
const SUBMISSIONS_REGEX = /^\/dash\/submissions(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/
const LETTERS_REGEX = /^\/dash\/letters(\/)?$/
const INSTRUCTIONS_REGEX = /^\/dash\/instructions(\/)?$/
const SIGNATURE_REGEX = /^\/dash\/signature(\/)?$/

const DashHeader = () => {

    const { auth } = useAuth()
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const logout = useLogout();
    const isStaff = auth?.role === 'Staff'

    //TODO: dont forget to remove dash from the pathnames when auth is implemented
    const onSubmissionsClicked = () => navigate('/dash/submissions')
    const onLettersClicked = () => navigate('/dash/letters')
    const onInstructionsClicked = () => navigate('/dash/instructions')
    const onSignatureClicked = () => navigate('/dash/signature')
    const onLogoutClicked = async () => {
        await logout();
        console.log('Logout success')
        navigate('/')
    }

    let SubmissionsButton = null
    if (!SUBMISSIONS_REGEX.test(pathname) && pathname.includes('/')) {
        SubmissionsButton = (
            <a className='nav-link' href='#' onClick={onSubmissionsClicked}>{isStaff ? 'Student' : 'My'} Submissions</a>
        )
    } else {
        SubmissionsButton = (
            <a className='nav-link disabled' href='#'>{isStaff ? 'Student' : 'My'} Submissions</a>
        )
    }

    let lettersButton = null
    if (isStaff){
        if (!LETTERS_REGEX.test(pathname)) {
            lettersButton = (
                <a className='nav-link' href='#' onClick={onLettersClicked}>Letter Archive</a>
            )
        } else {
            lettersButton = (
                <a className='nav-link disabled' href='#'>Letter Archive</a>
            )
        }
    }

    let instructionsButton = null
    if (isStaff){
        if (!INSTRUCTIONS_REGEX.test(pathname)) {
            instructionsButton = (
                <a className='nav-link' href='#' onClick={onInstructionsClicked}>Instruction Letters</a>
            )
        } else {
            instructionsButton = (
                <a className='nav-link disabled' href='#'>Instruction Letters</a>
            )
        }
    }

    let signatureButton = null
    if (isStaff){
        if (!SIGNATURE_REGEX.test(pathname)) {
            signatureButton = (
                <a className='nav-link' href='#' onClick={onSignatureClicked}>My Signature</a>
            )
        } else {
            signatureButton = (
                <a className='nav-link disabled' href='#'>My Signature</a>
            )
        }
    }

    const logoutButton = (
        <a className='dropdown-item' href='#' onClick={onLogoutClicked}>Log out</a>
    )

    const content = (
       
        <>
        <header className=''>
            {/* <p className={errClass}>{error?.data?.message}</p> */}
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className='' to="/dash">
                        <img className="" src={logo} height="30"/>
                    </Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse ms-4" id="navbarCollapse">

                    <ul className="navbar-nav me-auto mb-2 mb-md-0">
                        <li className="nav-item">
                        {lettersButton}
                        </li>
                        <li className="nav-item">
                        {SubmissionsButton}
                        </li>
                        <li className="nav-item">
                        {instructionsButton}
                        </li>
                        <li className="nav-item">
                        {signatureButton}
                        </li>
                       
                    </ul>

                    <ul className="navbar-nav ms-auto">
                        <li className='nav-item dropdown'>
                            <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                Settings
                            </a>
                            <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                                <li><a className="dropdown-item" href="#">Account settings</a></li>
                                <li>{logoutButton}</li>
                            </ul>
                        </li>
                        
                    </ul>
                    
                    </div>
                </div>
            </nav>
            
        </header>
        </>
    )
    return content
}

export default DashHeader