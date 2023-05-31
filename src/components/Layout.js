import { Outlet } from 'react-router-dom'

//layout will be the parent component of the app
//why use layout?
    //because if we want decide to add a banner or footer for example that
    //would go across the ENTIRE application, we can do it here
const Layout = () => {
    return <Outlet/>
}

export default Layout