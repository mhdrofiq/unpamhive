// import axios from "axios";
import axios from '../../api/axios'
import addSign from "../../img/addsign.png";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import packageJson from "../../../package.json";

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { PDFDocument } from "pdf-lib";

import "@react-pdf-viewer/core/lib/styles/index.css";

const ViewSubmission = () => {

  useTitle("View Submission");
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const isStaff = auth?.role === 'Staff'
  const pdfjsVersion = packageJson.dependencies['pdfjs-dist'];

  const [users, setUsers] = useState([]);
  const [senderId, setSenderId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [letterStatus, setLetterStatus] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [file, setFile] = useState("");
  const [previewState, setPreviewState] = useState(false);
  const [pdfUrl, setPdfUrl] = useState([]);
  const [rejectMessage, setRejectMessage] = useState("");
  const [hasSignature, setHasSignature] = useState(false);

  function getUsernameFromId(targetId) {
    let senderName = null;
    for (let i = 0; i < users.length; i++) {
      if (users[i]._id === targetId) {
        senderName = users[i].username;
      }
    }
    return senderName;
  }

  useEffect(() => {

    axios.get(`/users`).then((res) => {
      setUsers(res.data);
    });

    axios.get(`/letters`).then((res) => {
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
      setRejectMessage(letter[0].rejectMessage);
    });

    axios.get(`/letters/${id}`, {
      responseType: "arraybuffer",
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
      }
    })
    .then((res) => {
      //console.log(res.data)
      const url = window.URL.createObjectURL(new Blob([res.data]));
      //console.log(url);
      setPdfUrl(url);
    });

    axios.get(`/signature/${auth?.userId}`, {
      responseType: "arraybuffer",
      headers: {
          'Content-Type': 'image/png',
      }
    })
    .then((res) => {
      if(res.data.maxByteLength > 33) {
        setHasSignature(true)
      }else{
        setHasSignature(false)
      }
    });

  }, []);

  const onRejectMessageChanged = (e) => {
    setRejectMessage(e.target.value);
  };

  const onLetterReject = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("user", senderId);
      formData.append("recipient", recipient);
      formData.append("category", category);
      formData.append("title", title);
      formData.append("letterType", "Submission");
      formData.append("letterStatus", "Rejected");
      formData.append("description", description);
      formData.append("rejectMessage", rejectMessage);

      const res = await axios.patch("/letters", formData);

      console.log(res.data);
      setSenderId("");
      setRecipient("");
      setCategory("");
      setTitle("");
      setDescription("");
      setLetterStatus("");
      setFile("");
    } catch (err) {
      console.log(err);
    }
    navigate("/dash/submissions");
  };

  const onLetterApprove = async (e) => {
    e.preventDefault();
    //TODO: update the base url after deployment
    // const existingPdfBytes = await axios(`/letters/${id}`, {
    //   responseType: "arraybuffer"
    // })
    const existingPdfBytes = await fetch(
      `https://unpamhive-api.onrender.com/letters/${id}`
    ).then((res) => res.arrayBuffer());
    // const existingPdfBytes = await fetch(
    //   `https://unpamhive-api.onrender.com/letters/download/${id}`
    // ).then((res) => res.arrayBuffer());
    // console.log(existingPdfBytes)

    //TODO: update the base url after deployment
    // const pngImageBytes = await axios(`/signature/${auth?.userId}`, {
    //   responseType: "arraybuffer"
    // })
    const pngImageBytes = await fetch(
      `https://unpamhive-api.onrender.com/signature/${auth?.userId}`
    ).then((res) => res.arrayBuffer());
    // const pngImageBytes = await fetch(
    //   `https://unpamhive-api.onrender.com/signature/${auth?.userId}`
    // ).then((res) => res.arrayBuffer());
    // console.log(pngImageBytes)

    //load pdf file
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pngImage = await pdfDoc.embedPng(pngImageBytes);
    const pngDims = pngImage.scaleToFit(100, 300);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    firstPage.drawImage(pngImage, {
      // x: firstPage.getWidth() / 5.5 - pngDims.width / 2,
      x: firstPage.getWidth() / 5.5 - pngDims.width / 2,
      y: firstPage.getHeight() / 6 - pngDims.height / 2,
      width: pngDims.width,
      height: pngDims.height,
    });

    const pdfBytes = await pdfDoc.save();
    // console.log(pdfBytes)
    const bytes = new Uint8Array(pdfBytes);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const newfile = new File([blob], 'signed-letter.pdf', { type: "application/pdf" });
    //console.log(newfile)
    //setFile(blob);
    // const url = URL.createObjectURL( blob );
    // setPdfUrl(url);
    //console.log(file)
    //onLetterEditSubmit("Approved")(e);
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("user", senderId);
      formData.append("recipient", recipient);
      formData.append("category", category);
      formData.append("title", title);
      formData.append("letterType", "Submission");
      formData.append("letterStatus", "Approved");
      formData.append("description", description);
      formData.append("rejectMessage", rejectMessage);
      formData.append("file", newfile);

      const res = await axios.patch("/letters", formData);

      console.log(res.data);
      setSenderId("");
      setRecipient("");
      setCategory("");
      setTitle("");
      setDescription("");
      setLetterStatus("");
      setFile("");
    } catch (err) {
      console.log(err);
    }
    navigate("/dash/submissions");
  };

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
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.7.107/build/pdf.worker.min.js`}>
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
    rejectBlock = (
      <div className="mt-4">
        <h6>Cause of Rejection</h6>
        <span className="text-secondary">{rejectMessage}</span>
      </div>
    );
  } else {
    rejectBlock = null;
  }

  let buttonCollection;
  if (letterStatus === "Open" && isStaff ) {
    buttonCollection = (
      <>
        <button
          className="btn btn-sm btn-success"
          data-bs-toggle="modal"
          data-bs-target="#approveModal"
        >
          <i className="bi bi-vector-pen"></i> Approve and Sign
        </button>
        <button
          className="btn btn-sm btn-danger"
          data-bs-toggle="modal"
          data-bs-target="#rejectModal"
        >
          <i className="bi bi-x-lg"></i> Reject Submission
        </button>
      </>
    );
  } else {
    buttonCollection = null
  }

  let modalFooter;
  if(hasSignature){
    modalFooter = (
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
        className="btn btn-success"
        onClick={onLetterApprove}
      >
        Confirm
      </button>
    </div>
    )
  } else {
    modalFooter = (
      <div className="modal-footer">
      <div className="card d-flex flex-row gap-2 p-3 text-danger" style={{ backgroundColor: "#ffcad4" }}>
        <i className="bi bi-exclamation-triangle"></i>
        You can't approve this submission because you haven't uploaded your signature into the system. Click the 'My Signature' tab in the navbar and upload your signature, then return to this submission and click the 'Approve and Sign' button once again.
      </div>

      <button
        type="button"
        className="btn btn-secondary mt-3"
        data-bs-dismiss="modal"
      >
        Close
      </button>
      </div>
    )
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

      <div
        className="modal fade"
        id="approveModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Sign and approve this letter</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* <button onClick={setApprove}>
                  Click to change letter status to approved
                </button> */}
              <div className="card text-bg-light d-flex flex-row gap-2 p-3 text-secondary">
                <i className="bi bi-info-circle text-secondary"></i>
                In order to approve this student's submission, you must sign
                their attatched PDF document. This will automatically embed your
                signature into a pre determined area of the document. Therefore,
                to complete this process you must first upload a PNG image of
                your signature through the 'My Signature' tab in the navbar.
              </div>
              <div className="d-flex justify-content-center">
                <img className="border mt-3" src={addSign} width={400}></img>
              </div>
            </div>

            {modalFooter}
            
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="rejectModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Please enter the reason for rejection
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="card text-bg-light d-flex flex-row gap-2 p-3 text-secondary">
                <i className="bi bi-info-circle text-secondary"></i>
                In order to complete the rejection of this submission, you must
                provide the student with the reason for rejection. Some common
                reasons for rejection include: formatting issues, missing
                information, incorrect information, etc. The more specific the
                reason is, the better it will help the student understand what
                they need to fix, or why their submission cannot ever be
                approved by you.
              </div>
              <form>
                <div className="mb-3">
                  <label htmlFor="rejectMessage" className="col-form-label">
                    Reason:
                  </label>
                  <textarea
                    className="form-control"
                    id="rejectMessage"
                    value={rejectMessage}
                    onChange={onRejectMessageChanged}
                    required
                  ></textarea>
                </div>
              </form>
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
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={onLetterReject}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex mt-3 gap-2">
        <div className="card w-25">
          <div className="card-header text-secondary">Content Information</div>
          <div className="card-body">

            <div className="">
              <h6>Submission Status</h6>
              <span className={statusStyle()}>{letterStatus}</span>
            </div>

            <div className="mt-4">
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
              <h6>Recipient</h6>
              <span className="text-secondary">
                {getUsernameFromId(recipient)}
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
