import { useNavigate, useLocation } from 'react-router-dom'

const DashFooter = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClicked = () => navigate('/dash')

    let goHomeButton = null
    if (pathname !== '/dash') {
        goHomeButton = (
            <button
                className="dash-footer__button icon-button"
                title="Home"
                onClick={onGoHomeClicked}
            >
                Go home
            </button>
        )
    }

    const content = (
        <footer className="mt-auto p-2 text-secondary shadow" style={{backgroundColor: '#dee2e6'}}>
            <span className='ms-2'>Designed and built by @mhdrofiq · © 2022 - 2023 · Pamulang Univeristy · Universiti Teknologi Malaysia</span>
        </footer>
    )
    return content
}
export default DashFooter