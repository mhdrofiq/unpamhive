import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ROLES } from "../../config/roles";
import { DEPARTMENTS } from "../../config/departments";
import { STUDENT_POSITIONS } from "../../config/positions";
import { STAFF_POSITIONS } from "../../config/positions";

import axios from "axios";

const USER_REGEX = /^[A-z]{3,30}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const Register = () => {
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);

  const [role, setRole] = useState("Student");
  const [department, setDepartment] = useState("Fakultas MIPA");
  const [position, setPosition] = useState("Undergraduate");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    //checks regex everytime username is modified
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    //checks regex everytime password is modified
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    //checks regex everytime password is modified
    setValidMatch(password === matchPwd);
  }, [password, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [username, password, matchPwd]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onMatchPwdChanged = (e) => setMatchPwd(e.target.value);
  const onRoleChanged = (e) => {
    const value = e.target.value;
    setRole(value);
  };
  const onDepartmentChanged = (e) => {
    const value = e.target.value;
    setDepartment(value);
  };
  const onPositionChanged = (e) => {
    const value = e.target.value;
    setPosition(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(username, email, password, matchPwd, role, department, position);
    try{
      const res = await axios.post("http://localhost:3500/auth/register", JSON.stringify({ username, password, email, role, department, position}),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      console.log(JSON.stringify(res?.data));
      setSuccess(true);
      setUsername("");
      setEmail("");
      setPassword("");
      setMatchPwd("");
    } catch(err){
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('This username is already taken.');
      } else {
        setErrMsg('Registration Failed')
      }
    }
  };

  // THIS IS AN EXAMPLE OF HANDLING FOR MULTIPLE SELECT
  // const onDepartmentChanged = e => {
  //     const values = Array.from(  //create an array from
  //         e.target.selectedOptions, //the event gives us HTMLCollection
  //         (option) => option.value    //get the values from the array
  //     )
  //     setDepartment(values)
  // }

  //this array means: if all of these are true (by using the boolean)
  // const canSave = [role, department, position, validUsername, validEmail, validPassword ].every(Boolean) && !isLoading

  // const onSaveUserClicked = async (e) => {
  //     e.preventDefault()
  //     if (canSave) {  //check the canSave value
  //         await register({ username, email, password, role, department, position }) //call mutation
  //     }
  // }

  // const onSaveUserClicked = async (e) => {
  //     e.preventDefault()
  //     await register({ username, email, password, role, department, position }) //call mutation
  // }

  //this is for the select options (dropdown)
  const roleOptions = Object.values(ROLES).map((role) => {
    //for each role, create an option in the dropdown
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  const departmentOptions = Object.values(DEPARTMENTS).map((department) => {
    //for each role, create an option in the dropdown
    return (
      <option key={department} value={department}>
        {department}
      </option>
    );
  });

  let positionOptions;
  if (role != "Student") {
    positionOptions = Object.values(STAFF_POSITIONS).map((position) => {
      //for each role, create an option in the dropdown
      return (
        <option key={position} value={position}>
          {position}
        </option>
      );
    });
  } else {
    positionOptions = Object.values(STUDENT_POSITIONS).map((position) => {
      //for each role, create an option in the dropdown
      return (
        <option key={position} value={position}>
          {position}
        </option>
      );
    });
  }

  let errorMessage;
  if (errMsg) {
    errorMessage = (
      <div
        ref={errRef}
        className={errMsg ? "card mt-4" : "offscreen"}
        aria-live="assertive"
        style={{ backgroundColor: "#ffccd5" }}
      >
        <span className="card-body text-danger"><i class="bi bi-exclamation-triangle"></i> {errMsg}</span>
      </div>
    );
  } else {
    errorMessage = null;
  }

  const content = (
    <>
      <div className="d-flex align-items-center justify-content-center bg-light">
        <div className="p-4 card my-4" style={{ width: "500px" }}>
          <h2 className="mono-text">Create your account</h2>
          <div className="card-body">

            {success ? (

              <div
                className={success ? "card my-3" : "offscreen"}
                aria-live="assertive"
                style={{ backgroundColor: "#c1fba4" }}
              >
                <div className="card-body">
                  <span className="text-success">
                    Your account was successfully created. Click here to go to the
                    Sign in page
                  </span>
                  <div className="mt-3">
                    <Link to="/login" className="btn btn-outline-success">Sign in</Link>
                  </div>
                </div>
              </div>

            ) : (

              <form onSubmit={handleSubmit}>

                <div className="rounded text-bg-light d-flex flex-row gap-2 px-3 py-2 text-secondary">
                  <i className="bi bi-info-circle text-secondary"></i>
                  Only letters and numbers, must have 3-30 characters, and
                  contain no spaces. Example: MuhammadHanif
                </div>
                <div className="form-floating mt-1">
                  <input
                    type="username"
                    className={
                      validUsername ? "form-control" : "form-control is-invalid"
                    }
                    id="username"
                    placeholder="some-username"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
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
                    type="email"
                    className={
                      validEmail ? "form-control" : "form-control is-invalid"
                    }
                    id="email"
                    placeholder="some-email"
                    autoComplete="off"
                    value={email}
                    onChange={onEmailChanged}
                    required
                  />
                  <label
                    className="form-label text-secondary"
                    htmlFor="floatingInput"
                  >
                    Email
                  </label>
                </div>

                <div className="rounded text-bg-light d-flex flex-row gap-2 px-3 py-2 text-secondary mt-4">
                  <i className="bi bi-info-circle text-secondary"></i>
                  Only letters, numbers, or symbols allowed, must have 4-12
                  characters, and contain no spaces.
                </div>
                <div className="form-floating mt-1">
                  <input
                    type="password"
                    className={
                      validPassword ? "form-control" : "form-control is-invalid"
                    }
                    id="password"
                    placeholder="some-password"
                    autoComplete="off"
                    onChange={onPasswordChanged}
                    required
                  />
                  <label
                    className="form-label text-secondary"
                    htmlFor="password"
                  >
                    Password
                  </label>
                </div>

                <div className="form-floating mt-3">
                  <input
                    type="password"
                    className={
                      validMatch ? "form-control" : "form-control is-invalid"
                    }
                    id="matchPassword"
                    placeholder="some-password"
                    autoComplete="off"
                    onChange={onMatchPwdChanged}
                    required
                  />
                  <label
                    className="form-label text-secondary"
                    htmlFor="matchPassword"
                  >
                    Confirm Password
                  </label>
                </div>

                <label className="form-label text-secondary mt-4">
                  What is your role?
                </label>
                <select
                  id="roles"
                  name="roles"
                  className="form-select"
                  multiple={false}
                  value={role}
                  onChange={onRoleChanged}
                  required
                >
                  {roleOptions}
                </select>

                <label className="form-label text-secondary mt-3">
                  What is your department?
                </label>
                <select
                  id="departments"
                  name="departments"
                  className="form-select"
                  multiple={false}
                  value={department}
                  onChange={onDepartmentChanged}
                  required
                >
                  {departmentOptions}
                </select>

                <label className="form-label text-secondary mt-3">
                  What is your position?
                </label>
                <select
                  id="positions"
                  name="positions"
                  className="form-select"
                  multiple={false}
                  value={position}
                  onChange={onPositionChanged}
                >
                  {positionOptions}
                </select>

                {errorMessage}

                <button
                  className="w-100 btn btn-lg btn-success mt-5"
                  type="submit"
                >
                  Sign up
                </button>

                <div className="text-center my-3">
                  <span className="text-secondary">
                    Already have an account? <Link to="/login">Sign in</Link>
                  </span>
                </div>
              </form>

            )}

          </div>
        </div>
      </div>
    </>
  );

  return content;
};

export default Register;
