import axios from "axios";

import { useState, useEffect } from "react";
import { CATEGORIES } from "../../config/categories";
import { useNavigate, Link } from "react-router-dom";

const CreateSubmission = () => {
  const [staffusers, setStaffUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [user, setUser] = useState("");
  const [recipient, setRecipient] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3500/users`).then((res) => {
      setAllUsers(res.data);
      setUser(res.data[0]._id); // set default sender id
    });

    axios.get(`http://localhost:3500/users`).then((res) => {
      setStaffUsers(res.data.filter((user) => user.role === "Staff"));
      setRecipient(res.data[0]._id); // set default recipient id
    });
  }, []);

  const onUserChanged = (e) => setUser(e.target.value);
  const onRecipientChanged = (e) => setRecipient(e.target.value);
  const onCategoryChanged = (e) => setCategory(e.target.value);
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);
  const onFileChanged = (e) => setFile(e.target.files[0]);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("user", user);
      formData.append("recipient", recipient);
      formData.append("category", category);
      formData.append("title", title);
      formData.append("letterType", "Submission");
      formData.append("letterStatus", "Open");
      formData.append("description", description);
      formData.append("rejectMessage", '');
      formData.append("file", file);
      const res = await axios.post("http://localhost:3500/letters", formData);
      console.log(res.data);
      //this.props.history.push("/letters");
      setUser("");
      setRecipient("");
      setCategory("");
      setTitle("");
      setDescription("");
      setFile("");
      navigate("/dash/submissions");
    } catch (err) {
      console.log(err);
    }
  };

  const userOptions = allUsers.map((user) => {
    return (
      <option key={user._id} value={user._id}>
        {user.username}
      </option>
    );
  });

  const staffOptions = staffusers.map((user) => {
    return (
      <option key={user._id} value={user._id}>
        {user.username}
      </option>
    );
  });

  const categoryOptions = Object.values(CATEGORIES).map((type) => {
    return (
      <option key={type} value={type}>
        {type}
      </option>
    );
  });

  return (
    <div className="p-3 rounded bg-white shadow-sm">
      <div className="card text-bg-light d-flex flex-row gap-2 p-3 text-secondary">
        <i className="bi bi-info-circle text-secondary"></i>
        This is a form which allows you to send a submission (a digital letter)
        to an academic staff member to get their approval of your letter by
        digitally signing it. You must provide all the details required by the
        fields below, including the letter itself which must be in the form of a
        PDF file that is less than 16MB in size.
      </div>

      <header className="my-4">
        <h4 className="mono-text">Create a Submission</h4>
      </header>

      <div className="d-flex gap-1">
        <Link className="btn btn-sm btn-secondary me-5" to="/dash/submissions">
          <i class="bi bi-arrow-left"></i> My Submissions
        </Link>
      </div>

      <div className="card mt-3 w-75">
        <form
          className="form card-body"
          onSubmit={onSubmit}
          encType="multipart/form-data"
        >
          <div
            className="card p-3 text-success"
            style={{ backgroundColor: "#c1fba4" }}
          >
            <h5>Before you start</h5>
            We recommend using our provided official templates for letters. This
            helps you reduce mistakes caused by formatting, typos, and poor
            grammar! If you find a template that suits your needs, download it
            and fill it out. Then, upload it to the form below.
            <div className="mt-3">
              <a className="btn btn-sm btn-outline-success">
                <i class="bi bi-archive"></i> Link to official templates
              </a>
            </div>
          </div>

          <label className="form-label mt-3 text-secondary" htmlFor="username">
            Sender
          </label>
          <select
            id="username"
            name="username"
            className="form-select"
            value={user}
            onChange={onUserChanged}
          >
            {userOptions}
          </select>

          <label className="form-label mt-3 text-secondary" htmlFor="recipient">
            Recipient
          </label>
          <select
            id="recipient"
            name="recipient"
            className="form-select"
            // value={category}
            onChange={onRecipientChanged}
          >
            {staffOptions}
          </select>

          <label className="form-label mt-3 text-secondary" htmlFor="category">
            Select Letter Category
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            // value={category}
            onChange={onCategoryChanged}
          >
            {categoryOptions}
          </select>

          <label className="form-label mt-3 text-secondary" htmlFor="title">
            Title/Subject
          </label>
          <input
            className="form-control"
            id="title"
            name="title"
            type="text"
            autoComplete="off"
            // value={title}
            onChange={onTitleChanged}
            required
          />

          <label
            className="form-label mt-3 text-secondary"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            // value={description}
            onChange={onDescriptionChanged}
            required
          />

          <label className="form-label mt-3 text-secondary" htmlFor="file">
            Upload Your Letter
          </label>
          <input
            className="form-control"
            type="file"
            name="file"
            // ref={fileInputRef}
            onChange={onFileChanged}
          ></input>

          <div className="card d-flex flex-row gap-2 p-3 mt-3" style={{backgroundColor: '#fae588'}}>
            <i class="bi bi-exclamation-triangle"></i>
            Please make sure that all information is correct before submitting.
            Once submitted, you will not be able to edit the letter.
          </div>

          <div className="mt-4">
            <button className="btn btn-success px-5" title="Save">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubmission;