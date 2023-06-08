import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import axios from "axios";


//import { useDispatch } from 'react-redux'
// import usePersist from '../../hooks/usePersist'

const Login = () => {

  const { setAuth } = useContext(AuthContext);

  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  // const [persist, setPersist] = usePersist()

  const navigate = useNavigate();
  //const dispatch = useDispatch()

  useEffect(() => {
    userRef.current.focus(); //puts focus on the username field
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]); //clear error message state when username and password state changes

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post("http://localhost:3500/auth", JSON.stringify({ username, password }),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      //console.log(JSON.stringify(res?.data));
      //console.log(username, password);
      const accessToken = res?.data?.accessToken;
      const role = res?.data?.role;
      setAuth({ username, password, role, accessToken });
      //setSuccess(true);
      //console.log("Login Success", accessToken, role);
      navigate("/dash");
    } catch(err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
          setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
          setErrMsg('Unauthroized or incorrect credentials, please try again');
      } else {
          setErrMsg('Login Failed due to unexecpted error');
      }
      //errRef.current.focus();
    }
    
  };

  let errorMessage
  if(errMsg) {
    errorMessage = (
      <div className={errMsg ? "card mt-4" : "offscreen"} aria-live="assertive" style={{backgroundColor:'#ffccd5'}}>
        <span className="card-body text-danger">{errMsg}</span>
      </div>
    );
  } else {
    errorMessage = null;
  }

  const content = (
    <>
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="p-4 card" style={{ width: "400px" }}>
          <form className="card-body" onSubmit={handleSubmit}>
            <h2 className="mono-text mt-4">Login to Hive</h2>
            
            {errorMessage}
            
            <div className="form-floating mt-4">
              <input
                type="username"
                className="form-control"
                id="floatingInput"
                ref={userRef}
                value={username}
                placeholder="some-username"
                onChange={handleUserInput}
                autoComplete="off"
                required
              />
              <label
                className="form-label text-secondary"
                htmlFor="floatingInput"
              >
                Username
              </label>
            </div>

            <div className="form-floating mt-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="some-password"
                onChange={handlePwdInput}
                autoComplete="off"
                required
              />
              <label
                className="form-label text-secondary"
                htmlFor="floatingPassword"
              >
                Password
              </label>
            </div>

            <button className="w-100 btn btn-lg btn-success mt-3" type="submit">
              Sign in
            </button>

            <div className="text-center my-3">
              <span className="text-secondary">
                Don't have an account? <Link to="/register">Sign up</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
  return content;
};

export default Login;
