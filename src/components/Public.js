import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    // <section className='col-lg-8 mx-auto p-5 py-md-5 text-center'>
    <div className="d-flex vh-100 flex-column justify-content-center align align-items-center my-auto" style={{backgroundColor:'#343a40'}}>
      <div className="text-center text-light">
        <div style={{width: '400px'}}>
        {/* <img className="mb-4" src={logo} width="" height="45"/> */}
          <h5 className="mb-1 mono-text">Welcome to HIVE</h5>
          <p className=""><i>(Digital Letter Archive & Signing System)</i></p>
          <p className="">
            Log in with your account to continue.
          </p>

          <div className="d-flex gap-3 justify-content-center">
            <div>
              <Link className="btn btn-success" to="/login">
                Log in
              </Link>
            </div>
            <div>
              <Link className="btn btn-success" to="/register">
                Sign up
              </Link>
            </div>
          </div>

          <ul className="justify-content-center d-flex gap-2">
            <li className="d-flex align-items-start"></li>
            <li className="d-flex align-items-start"></li>
          </ul>
        </div>
      </div>
    </div>
  );
  return content;
};

export default Public;
