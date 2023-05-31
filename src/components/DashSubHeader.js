// import useAuth from "../hooks/useAuth"

const DashSubHeader = () => {

    // const { username, status }  = useAuth()

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', {dateStyle: 'full', timeStyle: 'long'}).format(date)

    const content = (
        <div className="nav-scroller bg-body shadow-sm">
            <nav className="nav" aria-label="Secondary navigation">
                {/* <a class="nav-link active" aria-current="page" href="#">Dashboard</a>
                <a class="nav-link" href="#">
                    Friends
                    <span class="badge text-bg-light rounded-pill align-text-bottom">27</span>
                </a> */}
                <li className="nav-link text-secondary">Current User: placeholder</li>
                <li className="nav-link text-secondary">User Type: placeholder</li>
                <li className="nav-link text-secondary ms-auto">{today}</li>
            </nav>
        </div>
    )
    return content
}

export default DashSubHeader