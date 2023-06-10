import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section className="p-5">
            <h1>Unauthorized Access</h1>
            <br />
            <p>You do not have access to the requested page.</p>
            <div>
                <button onClick={goBack}>Go Back</button>
            </div>
        </section>
    )
}

export default Unauthorized