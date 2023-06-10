// import axios from "axios";
import axios from '../../api/axios.js'
import DatePicker from "react-datepicker";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";

const CreateInstruction = () => {

    useTitle("Create Instruction");
    const navigate = useNavigate()
    const { auth } = useAuth();

    const [staffusers, setStaffUsers] = useState([]);
    const [user, setUser] = useState(auth?.userId);
    const [recipient, setRecipient] = useState("");
    const [title, setTitle] = useState("");
    const [letterNumber, setLetterNumber] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [file, setFile] = useState("");

    useEffect(() => {
        axios.get(`/users`).then((res) => {
            const fileteredUsers = res.data.filter((user) => (user.role === "Staff") && (user._id !== auth?.userId))
            setStaffUsers(fileteredUsers);
            setRecipient(fileteredUsers[0]._id); // set default recipient id
        });
    }, []);

    const onRecipientChanged = (e) => setRecipient(e.target.value);
    const onTitleChanged = (e) => setTitle(e.target.value);
    const onLetterNumberChanged = (e) => setLetterNumber(e.target.value);
    const onDescriptionChanged = (e) => setDescription(e.target.value);
    const onFileChanged = (e) => setFile(e.target.files[0]);
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("user", user);
            formData.append("recipient", recipient);
            formData.append("title", title);
            formData.append("letterNumber", letterNumber);
            formData.append("letterType", "Instruction");
            formData.append("description", description);
            formData.append("start", startDate);
            formData.append("end", endDate);
            formData.append("file", file);
            const res = await axios.post("/letters", formData);
            console.log(res.data);
            //this.props.history.push("/letters");
            setUser("");
            setRecipient("");
            setTitle("");
            setLetterNumber("");
            setDescription("");
            setStartDate('')
            setEndDate('')
            setFile("");
            navigate('/dash/instructions')
        } catch (err) {
            console.log(err);
        }
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
                This is a form which allows you to send an instruction to a fellow academic staff member. You must provide all the details required by the fields below, including the letter itself which must be in the form of a PDF file that is less than 16MB in size.
            </div>

            <header className="my-4">
                <h4 className="mono-text">Send an Instruction</h4>
            </header>

            <div className="d-flex gap-1">
                <Link className="btn btn-sm btn-secondary me-5" to="/dash/instructions">
                    <i class="bi bi-arrow-left"></i> Instructions List
                </Link>
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
                    value={recipient}
                    onChange={onRecipientChanged}
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
                    Letter Number
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

                <label className="form-label mt-3 text-secondary" htmlFor="description">
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
                Starting Date of Instruction</label>
                <DatePicker 
                    selected={startDate} 
                    onChange={(date) => setStartDate(date)} 
                />

                <label className="form-label mt-3 text-secondary" htmlFor="endDate">
                Ending Date of Instruction</label>
                <DatePicker 
                    selected={endDate} 
                    onChange={(date) => setEndDate(date)} 
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

export default CreateInstruction;
