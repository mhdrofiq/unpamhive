// import axios from 'axios'
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

import { DEPARTMENTS } from "../../config/departments";
import { STUDENT_POSITIONS } from "../../config/positions";
import { STAFF_POSITIONS } from "../../config/positions";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Modal } from "react-bootstrap";

const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const EditUser = () => {

  useTitle("Account Settings");
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);

  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("Fakultas MIPA");
  const [position, setPosition] = useState("Undergraduate");
  const [active, setActive] = useState();
  const [refresh, setRefresh] = useState();

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get(`/users/${auth?.userId}`).then((res) => {
      setUsername(res.data.username);
      setEmail(res.data.email);
      setPassword(res.data.password);
      setRole(res.data.role);
      setDepartment(res.data.department);
      setPosition(res.data.position);
      setActive(res.data.active);
      setRefresh(res.data.refreshToken);
    });
  }, []);

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

  const onEmailChanged = (e) => setEmail(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onMatchPwdChanged = (e) => setMatchPwd(e.target.value);
  const onDepartmentChanged = (e) => {
    const value = e.target.value;
    setDepartment(value);
  };
  const onPositionChanged = (e) => {
    const value = e.target.value;
    setPosition(value);
  };

  const hideModal = () => setSuccess(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userObject = {
      id: auth?.userId,
      username: username,
      email: email,
      password: password,
      role: role,
      department: department,
      position: position,
      active: active,
    };

    try {
      const res = await axios.patch(`/users`, userObject);
      console.log(JSON.stringify(res?.data));
      setUsername("");
      setEmail("");
      setPassword("");
      setMatchPwd("");
  
      navigate(0)
      setSuccess(true)
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("This username is already taken.");
      } else {
        setErrMsg("Update user failed");
      }
    }
  };

  const onDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete("/users", {
        data: { id: auth?.userId },
      });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
    navigate("/dash");
  };

  const departmentOptions = Object.values(DEPARTMENTS).map((department) => {
    //for each role, create an option in the dropdown
    return (
      <option key={department} value={department}>
        {department}
      </option>
    );
  });

  let positionOptions;
  if (role !== "Student") {
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
        <span className="card-body text-danger">
          <i class="bi bi-exclamation-triangle"></i> {errMsg}
        </span>
      </div>
    );
  } else {
    errorMessage = null;
  }

  return (
    <div className="p-3 rounded bg-white shadow-sm">

      <Modal
        show={success}
        onHide={hideModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
          <i className="bi bi-check-circle"></i> Account Updated Successfully, now refreshing...
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        </Modal.Body>
      </Modal>

      <div className="card text-bg-light d-flex flex-row gap-2 p-3 text-secondary">
        <i className="bi bi-info-circle text-secondary"></i>
        This form allows you to update your account information. Note that all
        the fields are optional if you want some of your information to remain
        unchanged.
      </div>

      <header className="my-4">
        <h4 className="mono-text">Update your account</h4>
      </header>

      <div className="d-flex gap-1">
        <button
          className="btn btn-sm btn-outline-danger"
          title="Delete"
          data-bs-toggle="modal"
          data-bs-target="#deleteModal"
        >
          <i class="bi bi-trash"></i> Delete your account
        </button>
      </div>

      <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">
                Are you sure you want to permanently delete your account?
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                data-bs-dismiss="modal"
                className="btn btn-danger"
              >
                Yes, delete my account
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-lg-row flex-sm-column gap-3 ">
        <div className="card mt-3">
          <form className="form card-body" onSubmit={handleSubmit}>
            <div className="form-floating mt-1">
              <input
                type="username"
                className='form-control'
                id="username"
                placeholder="some-username"
                autoComplete="off"
                value={username}
                disabled
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
              />
              <label
                className="form-label text-secondary"
                htmlFor="floatingInput"
              >
                Email
              </label>
            </div>

            <div className="form-floating mt-3">
              <input
                type="role"
                className="form-control"
                id="role"
                value={role}
                disabled
              />
              <label
                className="form-label text-secondary"
                htmlFor="floatingInput"
              >
                Role
              </label>
            </div>

            <label className="form-label text-secondary mt-3">
              What is your new department?
            </label>
            <select
              id="departments"
              name="departments"
              className="form-select"
              multiple={false}
              value={department}
              onChange={onDepartmentChanged}
            >
              {departmentOptions}
            </select>

            <label className="form-label text-secondary mt-3">
              What is your new position?
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

            <div className="mt-4">
              <button className="btn btn-success px-4" title="Save">
                Update Account
              </button>
            </div>
          </form>
        </div>

        <div className="card mt-3">
          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="rounded text-bg-light d-flex flex-row gap-2 px-3 py-2 text-secondary">
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
                />
                <label className="form-label text-secondary" htmlFor="password">
                  New Password
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
                />
                <label
                  className="form-label text-secondary"
                  htmlFor="matchPassword"
                >
                  Confirm New Password
                </label>
              </div>

              <div className="mt-4">
                <button className="btn btn-success px-4" title="Save">
                  Update Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
