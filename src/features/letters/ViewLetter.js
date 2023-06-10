// import axios from "axios";
import axios from "../../api/axios";
import useTitle from "../../hooks/useTitle";
import packageJson from "../../../package.json";

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";

const ViewLetter = () => {

    useTitle("View Letter");
    const { id } = useParams();
    const pdfjsVersion = packageJson.dependencies['pdfjs-dist'];

    const [users, setUsers] = useState([]);
    const [senderId, setSenderId] = useState("");
    const [recipientId, setRecipientId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [letterNumber, setLetterNumber] = useState("");
    const [category, setCategory] = useState("");
    const [createdDate, setCreatedDate] = useState("");
    const [file, setFile] = useState("");
    const [previewState, setPreviewState] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");

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
            setRecipientId(letter[0].recipient);
            setTitle(letter[0].title);
            setDescription(letter[0].description);
            setLetterNumber(letter[0].letterNumber);
            setCategory(letter[0].category);
            setFile(letter[0].file);
            setCreatedDate(letter[0].createdAt);
        });
        axios.get(`/letters/download/${id}`, {
            responseType: "blob",
        }).then((res) => {
            const blob = new Blob([res.data], { type: res.data.type });
            const pdfurl = window.URL.createObjectURL(blob);
            setPdfUrl(pdfurl);
        });
    }, []);

    function downloadFile() {
        //console.log(file);
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
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
                    <Viewer fileUrl={pdfUrl} />
                </Worker>
            </div>
        );
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

    return (
        <div className="p-3 rounded bg-white shadow-sm mb-5">

            <div className="card text-bg-light d-flex flex-row gap-2 p-3 text-secondary">
                <i className="bi bi-info-circle text-secondary"></i>
                This is a view of the information contained within the letter and the information that help identify it. You can download the PDF file attached to the letter by clicking the 'Download Letter' button or toggle a preview of the PDF file by clicking the 'Toggle Preview' button. You cannot edit the details of this letter because you are not the author.
            </div>

            <header className="my-4">
                <h4 className="mono-text">Letter Details</h4>
            </header>

            <div className="d-flex gap-1">
                <Link 
                    className='btn btn-sm btn-secondary me-5' 
                    to="/dash/letters">
                    <i className="bi bi-arrow-left"></i> Letter Archive
                </Link>

                <button 
                    className="btn btn-sm btn-primary"
                    onClick={downloadFile}>
                    <i className="bi bi-file-earmark-arrow-down"></i> Download Letter
                </button>
                <button
                    className='btn btn-sm btn-primary' 
                    onClick={togglePreview}>
                    <i className="bi bi-file-pdf"></i> Toggle Preview
                </button>
            </div>

            <div className="d-flex mt-3 gap-2">

                <div className="card w-25">
                    <div className="card-header text-secondary">
                        Content Information
                    </div>
                    <div className="card-body">
                    <div className="">
                        <h6>Title</h6>
                        <span className="text-secondary">{title}</span>
                    </div>

                    <div className="mt-4">
                        <h6>Number</h6>
                        <span className="text-secondary">{letterNumber}</span>
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
                            {getUsernameFromId(recipientId)}
                        </span>
                    </div>

                    <div className="mt-4">
                        <h6>Description</h6>
                        <span className="text-secondary">{description}</span>
                    </div>

                    <div className="mt-4">
                        <h6>Sent at</h6>
                        <span className="text-secondary">{created}</span>
                    </div>
                    </div>
                    
                </div>

                <div className="card w-75">
                    <div className="card-header text-secondary">
                        Letter Preview Pane
                    </div>
                    <div className="card-body">
                    {previewState ? previewBlock() : <i className="text-secondary">Preview Not Toggled</i>}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ViewLetter;
