import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashSubHeader from './DashSubHeader'
import DashFooter from './DashFooter'

const DashLayout = () => {
    return (
        <>
            <div className='bg-light d-flex flex-column min-vh-100'>
                <DashHeader/>
                <DashSubHeader/>
                <div className='mx-3 py-3'>
                    <Outlet/>
                </div>
                <DashFooter/>
            </div>
        </>
    )
}

export default DashLayout