import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
//import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
//import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import "@react-pdf-viewer/core/lib/styles/index.css";

const ViewSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [senderId, setSenderId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [letterStatus, setLetterStatus] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState('');
  const [previewState, setPreviewState] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [rejectMessage, setRejectMessage] = useState("");

  function getUsernameFromId(targetId) {
    let senderName = null;
    for (let i = 0; i < users.length; i++) {
      if (users[i]._id === targetId) {
        senderName = users[i].username;
      }
    }
    return senderName;
  }

  function getFilename(str){
    return str.replace("uploads\\", "")
  }

  useEffect(() => {
    axios.get(`http://localhost:3500/users`).then((res) => {
      setUsers(res.data);
    });
    axios.get(`http://localhost:3500/letters`).then((res) => {
      //setTargetLetter(res.data.filter((letter) => letter._id === id))
      const letter = res.data.filter((letter) => letter._id === id);
      //console.log(letter[0].title)
      setSenderId(letter[0].user);
      setRecipient(letter[0].recipient);
      setTitle(letter[0].title);
      setDescription(letter[0].description);
      setLetterStatus(letter[0].letterStatus);
      setCategory(letter[0].category);
      setFile(letter[0].file);
      setCreatedDate(letter[0].createdAt);
      setFilename(getFilename(letter[0].file));
      setRejectMessage(letter[0].rejectMessage);
    });
    axios
      .get(`http://localhost:3500/letters/download/${id}`, {
        responseType: "blob",
      })
      .then((res) => {
        const blob = new Blob([res.data], { type: res.data.type });
        const pdfurl = window.URL.createObjectURL(blob);
        setPdfUrl(pdfurl);
      });
  }, []);

  const onRejectMessageChanged = (e) => {
    setRejectMessage(e.target.value)
    setLetterStatus('Rejected')
  };

  const setApprove = (e) => {
    setLetterStatus('Approved')
  }

  const onLetterStatusChanged = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("user", senderId);
      formData.append("recipient", recipient);
      formData.append("category", category);
      formData.append("title", title);
      formData.append("letterType", "Submission");
      formData.append("letterStatus", letterStatus);
      formData.append("description", description);
      formData.append("rejectMessage", rejectMessage);
      formData.append("file", file);

      const res = await axios.patch("http://localhost:3500/letters", formData);
      
      console.log(res.data);
      setSenderId("");
      setRecipient("");
      setCategory("");
      setTitle("");
      setDescription("");
      setLetterStatus("");
      file("");
    } catch (err) {
      console.log(err);
    }
    navigate("/dash/submissions");
  }

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

  function downloadFile() {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "dlass-letter-download.pdf";
    link.click();
  }

  function previewBlock() {
    return (
      <div
        style={{
          border: "1px solid rgba(0, 0, 0, 0.3)",
          height: "500px",
        }}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer fileUrl={pdfUrl} />
        </Worker>
      </div>
    );
  }

  function statusStyle() {
    if (letterStatus === "Open") {
      return "text-warning";
    } else if (letterStatus === "Approved") {
      return "text-success";
    } else if (letterStatus === "Rejected") {
      return "text-danger";
    }
  }

  function togglePreview() {
    setPreviewState(!previewState);
  }

  //console.log(file)

  const created = new Date(createdDate).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  let rejectBlock;
  if (letterStatus === "Rejected") {
    rejectBlock = 
    <div className="mt-4">
      <h6>Cause of Rejection</h6>
      <span className='text-secondary'>{rejectMessage}</span>
    </div>
  } else {
    rejectBlock = null;
  }

  let buttonCollection;
  if(letterStatus === "Open") {
    buttonCollection =  
    <>
    <button className="btn btn-sm btn-success" data-bs-toggle="modal"
    data-bs-target="#approveModal">
      <i className="bi bi-vector-pen"></i> Approve and Sign
    </button>
    <button className="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#rejectModal">
      <i className="bi bi-x-lg"></i> Reject Submission
    </button>
    </>
  } else {
    buttonCollection = 
    <>
    <button className="btn btn-sm btn-success" data-bs-toggle="modal"
    data-bs-target="#approveModal" disabled>
      <i className="bi bi-vector-pen"></i> Approve and Sign
    </button>
    <button className="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#rejectModal" disabled>
      <i className="bi bi-x-lg"></i> Reject Submission
    </button>
    </>
  }

  return (
    <div className="p-3 rounded bg-white shadow-sm mb-5">
      <div className="card text-bg-light d-flex flex-row gap-2 p-3 text-secondary">
        <i className="bi bi-info-circle text-secondary"></i>
        This is a view of the information contained within the submission and
        the information that helps identify it. You can download the PDF file
        (letter) attached by the student by clicking the 'Download Submission'
        button or toggle a preview of the PDF file by clicking the 'Toggle
        Preview' button. You can approve this student's submission by clicking
        the 'Approve and Sign' button. This will prompt you to digitally sign
        the letter after which will be available for the student to download the
        signed copy. You can also reject this submission by clicking the 'Reject
        Submission' button. This will prompt you to enter a reason for rejection
        which will be sent to the student. If the 'Submissson Status' shows
        'Open' on the Content Information card, it means that this submission
        hasn't been approved or rejected yet.
      </div>

      <header className="my-4">
        <h4 className="mono-text">Submission Details</h4>
      </header>

      <div className="d-flex gap-1">
        <Link className="btn btn-sm btn-secondary me-5" to="/dash/submissions">
          <i className="bi bi-arrow-left"></i> Student Submissions
        </Link>

        <button className="btn btn-sm btn-primary" onClick={downloadFile}>
          <i className="bi bi-file-earmark-arrow-down"></i> Download Submission
        </button>
        <button className="btn btn-sm btn-primary" onClick={togglePreview}>
          <i className="bi bi-file-pdf"></i> Toggle Preview
        </button>
        {buttonCollection}
       
      </div>

      <div className="modal fade" id="approveModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">
                TBA Modal Title
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
                <button onClick={setApprove}>
                  Click to change letter status to approved
                </button>
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
                data-bs-dismiss="modal"
                className="btn btn-success"
                onClick={onLetterStatusChanged}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="rejectModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog modal-lg">
        <div className="modal-content">
        <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">Please enter the reason for rejection</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
        <div className="card text-bg-light d-flex flex-row gap-2 p-3 text-secondary">
        <i className="bi bi-info-circle text-secondary"></i>
        In order to complete the rejection of this submission, you must provide the student with the reason for rejection. Some common reasons for rejection include: formatting issues, missing information, incorrect information, etc. The more specific the reason is, the better it will help the student understand what they need to fix, or why their submission cannot ever be approved by you.
        </div>
            <form>
            <div className="mb-3">
                <label htmlFor="rejectMessage" className="col-form-label">Reason:</label>
                <textarea className="form-control" id="rejectMessage" value={rejectMessage} onChange={onRejectMessageChanged} required></textarea>
            </div>
            </form>
        </div>
        <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onLetterStatusChanged}>Send</button>
        </div>
        </div>
    </div>
    </div>

      <div className="d-flex mt-3 gap-2">
        <div className="card w-25">
          <div className="card-header text-secondary">Content Information</div>
          <div className="card-body">
            <div className="">
              <h6>Title</h6>
              <span className="text-secondary">{title}</span>
            </div>

            <div className="mt-4">
              <h6>Category</h6>
              <span className="text-secondary">{category}</span>
            </div>

            <div className="mt-4">
              <h6>Sender</h6>
              <span className="text-secondary">
                {getUsernameFromId(senderId)}
              </span>
            </div>

            <div className="mt-4">
              <h6>Description</h6>
              <span className="text-secondary">{description}</span>
            </div>

            <div className="mt-4">
              <h6>Submitted at</h6>
              <span className="text-secondary">{created}</span>
            </div>

            <div className="mt-4">
              <h6>Submission Status</h6>
              <span className={statusStyle()}>{letterStatus}</span>
            </div>

            {rejectBlock}

          </div>
        </div>

        <div className="card w-75">
          <div className="card-header text-secondary">Letter Preview Pane</div>
          <div className="card-body">
            {previewState ? (
              previewBlock()
            ) : (
              <i className="text-secondary">Preview Not Toggled</i>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSubmission;