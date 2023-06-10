import useAuth from '../hooks/useAuth';

const DashSubHeader = () => {

    const { auth } = useAuth();

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', {dateStyle: 'full', timeStyle: 'long'}).format(date)

    const content = (
        <div className="nav-scroller bg-body shadow-sm">
            <nav className="nav" aria-label="Secondary navigation">
                <li className="nav-link text-secondary">Current User: {auth?.username}</li>
                <li className="nav-link text-secondary">User Type: {auth?.role}</li>
                <li className="nav-link text-secondary ms-auto">Logged in at: {today}</li>
            </nav>
        </div>
    )
    return content
}

export default DashSubHeader