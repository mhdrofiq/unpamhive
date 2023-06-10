// import axios from "axios";
import axios from '../../api/axios'
import DatePicker from "react-datepicker";
import useTitle from '../../hooks/useTitle';

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";

const EditInstruction = () => {

  useTitle("Edit Instruction");
  const { id } = useParams(); //this letter's id
  const navigate = useNavigate();

  const [staffusers, setStaffUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [user, setUser] = useState('');
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [letterNumber, setLetterNumber] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [prevFile, setPrevFile] = useState("");
  const [file, setFile] = useState();

  function getUsernameFromId(targetId) {
    let senderName = null;
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i]._id === targetId) {
        senderName = allUsers[i].username;
        break;
      }
    }
    return senderName;
  }

  useEffect(() => {
    axios.get(`/users`).then((res) => {
      setAllUsers(res.data);
    });

    axios.get(`/users`).then((res) => {
      setStaffUsers(res.data.filter((user) => user.role === "Staff"));
    });

    axios.get(`/letters`).then((res) => {
      const letter = res.data.filter((letter) => letter._id === id);
      setUser(letter[0].user);
      setRecipient(letter[0].recipient);
      setTitle(letter[0].title);
      setDescription(letter[0].description);
      setLetterNumber(letter[0].letterNumber);
      setStart(new Date(letter[0].start));
      setEnd(new Date(letter[0].end));
      setPrevFile(letter[0].file);
      setFile(letter[0].file);
    });
    axios
      .get(`/letters/download/${id}`, {
        responseType: "blob",
      })
      .then((res) => {
        const blob = new Blob([res.data], { type: res.data.type });
        setFile(blob);

        // const oldfile = new File([blob], 'prevFile')
        // setFile(oldfile);
        // console.log(file);
      });
  }, []);

  const onUserChanged = (e) => setUser(e.target.value);
  const onRecipientChanged = (e) => setRecipient(e.target.value);
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onLetterNumberChanged = (e) => setLetterNumber(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);
  const onFileChanged = (e) => setFile(e.target.files[0]);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("user", user);
      formData.append("recipient", recipient);
      formData.append("title", title);
      formData.append("letterNumber", letterNumber);
      formData.append("letterType", "Instruction");
      formData.append("description", description);
      formData.append("start", start);
      formData.append("end", end);
      formData.append("file", file);
      const res = await axios.patch("/letters", formData);
      console.log(res.data);
      //this.props.history.push("/letters");
      setUser("");
      setRecipient("");
      setTitle("");
      setLetterNumber("");
      setDescription("");
      setStart("");
      setEnd("");
      file("");
    } catch (err) {
      console.log(err);
    }
    navigate("/dash/instructions");
  };

  const onDelete = async (e) => {
    e.preventDefault();
    try {
      // const formData = new FormData();
      // formData.append("id", id);
      const res = await axios.delete("/letters", {
        data: { id: id },
      });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
    navigate("/dash/instructions");
  };

  const staffOptions = staffusers.map((user) => {
    return (
      <option key={user._id} value={user._id}>
        {user.username}
      </option>
    );
  });

  return (
    <div className="p-3 rounded bg-white shadow-sm">
      <div className="card text-bg-light d-flex flex-row gap-2 p-3 text-secondary">
        <i className="bi bi-info-circle text-secondary"></i>
        This form allows you to edit this instruction's details. It is not
        necessary to edit all the fields below, the fields that are left
        unendited will retain its current values. All of the fields below must
        not be left empty.
      </div>

      <header className="my-4">
        <h4 className="mono-text">Edit this Instruction</h4>
      </header>

      <div className="d-flex gap-1">
        <Link className="btn btn-sm btn-secondary me-5" to="/dash/instructions">
          <i class="bi bi-arrow-left"></i> Instructions List
        </Link>
        <button
          className="btn btn-sm btn-outline-danger"
          title="Delete"
          data-bs-toggle="modal"
          data-bs-target="#deleteModal"
        >
          <i class="bi bi-trash"></i> Delete Instruction
        </button>
      </div>

      <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">
                Are you sure you want to permanently delete this instruction?
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
                close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onDelete}
                data-bs-dismiss="modal"
              >
                Yes, delete this instruction
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

          <label className="form-label text-secondary" htmlFor="recipient">
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

          <label className="form-label mt-3 text-secondary" htmlFor="number">
            Letter number
          </label>
          <input
            className="form-control"
            id="number"
            name="number"
            type="text"
            autoComplete="off"
            value={letterNumber}
            onChange={onLetterNumberChanged}
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

          <label className="form-label mt-3 text-secondary" htmlFor="startDate">
            Starting Date of Instruction
          </label>
          <DatePicker selected={start} onChange={(date) => setStart(date)} />

          <label className="form-label mt-3 text-secondary" htmlFor="endDate">
            Ending Date of Instruction
          </label>
          <DatePicker selected={end} onChange={(date) => setEnd(date)} />

          <label
            className="form-label mt-3 text-secondary"
            htmlFor="currentFile"
          >
            File previously uploaded
          </label>
          <div>
            <span>{prevFile}</span>
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

export default EditInstruction;
