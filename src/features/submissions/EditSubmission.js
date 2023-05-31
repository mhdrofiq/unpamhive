import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { CATEGORIES } from "../../config/categories";
import { useNavigate, Link } from "react-router-dom";

const EditSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [staffusers, setStaffUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [user, setUser] = useState("");
  const [recipient, setRecipient] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState();
  const [filename, setFilename] = useState('');

  function getUsernameFromId(targetId) {
    let senderName = null;
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i]._id === targetId) {
        senderName = allUsers[i].username;
      }
    }
    return senderName;
  }

  function getFilename(str){
    return str.replace("uploads\\", "")
  }

  useEffect(() => {
    axios.get(`http://localhost:3500/users`).then((res) => {
      setAllUsers(res.data);
    });

    axios.get(`http://localhost:3500/users`).then((res) => {
      setStaffUsers(res.data.filter((user) => user.role === "Staff"));
    });

    axios.get(`http://localhost:3500/letters`).then((res) => {
      const letter = res.data.filter((letter) => letter._id === id);
      setUser(letter[0].user);
      setRecipient(letter[0].recipient);
      setTitle(letter[0].title);
      setDescription(letter[0].description);
      setCategory(letter[0].category);
      setFilename(getFilename(letter[0].file));
    });
  }, []);

  useEffect(() => {
    axios
    .get(`http://localhost:3500/letters/download/${id}`, {
      responseType: "blob",
    })
    .then((res) => {
      const blob = new Blob([res.data], { type: res.data.type });
      //console.log(filename)
      const oldfile = new File([blob], filename, {type: 'application/pdf'})
      setFile(oldfile);
      // console.log(file);
    });
  }, [filename])

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
      formData.append("id", id);
      formData.append("user", user);
      formData.append("recipient", recipient);
      formData.append("category", category);
      formData.append("title", title);
      formData.append("letterType", "Submission");
      formData.append("description", description);
      formData.append("rejectMessage", '');
      formData.append("file", file);
      const res = await axios.patch("http://localhost:3500/letters", formData);
      console.log(res.data);
      //this.props.history.push("/letters");
      setUser("");
      setRecipient("");
      setCategory("");
      setTitle("");
      setDescription("");
      file("");
    } catch (err) {
      console.log(err);
    }
    navigate("/dash/submissions");
  };

  const onDelete = async (e) => {
    e.preventDefault();
    try {
      // const formData = new FormData();
      // formData.append("id", id);
      const res = await axios.delete("http://localhost:3500/letters", {
        data: { id: id },
      });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
    navigate("/dash/submissions");
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
        This form allows you to edit this submission's details. It is not necessary to edit all the fields below, the fields that are left unendited will retain its current values. All of the fields below must not be left empty.
      </div>

      <header className="my-4">
        <h4 className="mono-text">Edit this Submission</h4>
      </header>

      <div className="d-flex gap-1">
        <Link className="btn btn-sm btn-secondary me-5" to="/dash/submissions">
          <i class="bi bi-arrow-left"></i> My Submissions
        </Link>
        <button
          className="btn btn-sm btn-outline-danger"
          title="Delete"
          data-bs-toggle="modal"
          data-bs-target="#deleteModal"
        >
          <i class="bi bi-trash"></i> Delete submission
        </button>
      </div>

      <div
        class="modal fade"
        id="deleteModal"
        tabindex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">
                Are you sure you want to permanently delete this submission?
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
              <button type="button" data-bs-dismiss="modal" className="btn btn-danger" onClick={onDelete}>
                Yes, delete this submission
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-3 w-75">
        <form
          className="form card-body"
          onSubmit={onSubmit}
          encType="multipart/form-data"
        >
          <label className="form-label text-secondary" htmlFor="username">
            Sender
          </label>
          <select
            id="username"
            name="username"
            className="form-select"
            value={getUsernameFromId(user)}
            onChange={onUserChanged}
            required
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
            value={getUsernameFromId(recipient)}
            onChange={onRecipientChanged}
            required
          >
            {staffOptions}
          </select>

          <label className="form-label mt-3 text-secondary" htmlFor="category">
            Select letter category
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={category}
            onChange={onCategoryChanged}
            required
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
            value={title}
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
            value={description}
            onChange={onDescriptionChanged}
            required
          />

          <label
            className="form-label mt-3 text-secondary"
            htmlFor="currentFile"
          >
            File previously uploaded
          </label>
          <div>
            <span>{filename}</span>
          </div>

          <label className="form-label mt-3 text-secondary" htmlFor="file">
            Upload a a new file to replace the existing file
          </label>
          <input
            className="form-control"
            type="file"
            name="file"
            onChange={onFileChanged}
          ></input>

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

export default EditSubmission;
