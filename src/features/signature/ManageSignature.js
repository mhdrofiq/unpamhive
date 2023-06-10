// import axios from "axios";
import axios from '../../api/axios'
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const ManageSignature = () => {

    useTitle("Manage Signature");
    const navigate = useNavigate();
    const { auth } = useAuth();

    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [userId, setUserId] = useState(auth?.userId);
    const [buttonAccess, setButtonAccess] = useState(false);

    useEffect(() => {
        axios
          .get(`/signature/${userId}`, {
            responseType: "blob",
        })
          .then((res) => {
            if(res.data.type === "image/png") {
                const url = window.URL.createObjectURL(res.data)
                setFileUrl(url)
                setButtonAccess(false)
            }else{
                setFileUrl(null)
                setButtonAccess(true)
            }                
          })
      }, [])

    const onFileChanged = (e) => setFile(e.target.files[0]);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
          const formData = new FormData();
          formData.append("user", userId);
          formData.append("file", file);
          const res = await axios.post("/signature", formData);
          console.log(res.data);
          setUserId("");
          setFile("");
          navigate(0);  //to refresh page
        } catch (err) {
          console.log(err);
        }
    }

    const onDelete = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.delete("/signature", {
            data: { id: userId },
          });
          console.log(res.data);
        } catch (err) {
          console.log(err);
        }
        navigate(0);    //to refresh page
      };

    let imgContent = null;
    if (fileUrl) {
        imgContent = <img src={fileUrl} alt="signature" height="200" />;
    } else {
        imgContent = <span className="text-secondary"><i>You have not uploaded your signature yet.</i></span>
    }

    let buttonContent;
    if (buttonAccess) { //no existing signature
        buttonContent =
        <>
        <button className="btn btn-sm btn-success"
        data-bs-toggle="modal" data-bs-target="#uploadModal">
            <i className="bi bi-plus-lg"></i> Upload New Signature
        </button>
                    
        <button className="btn btn-sm btn-danger" disabled>
            <i className="bi bi-trash"></i> Delete Current Signature
        </button>
        </>
    } else {    //has signature
        buttonContent =
        <>
        <button className="btn btn-sm btn-success" disabled>
            <i className="bi bi-plus-lg"></i> Upload New Signature
        </button>
                    
        <button className="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">
            <i className="bi bi-trash"></i> Delete Current Signature
        </button>
        </>
    }


    return (
        <>
            <div className="p-3 rounded bg-white shadow-sm">
            <div className="card text-bg-light d-flex flex-row gap-2 p-3 text-secondary">
                <i className="bi bi-info-circle text-secondary"></i>
                This is where you can manage your digital signature. You can upload a new signature in the form of an image, or delete your current signature. Should you need to change your signature for whatever reason, you can delete your current signature and upload the updated one.
            </div>

            <div className="d-flex mt-4">
                <h4 className="mono-text">Manage My Signature</h4>
            </div>
            
            <div>
                <div className="d-flex gap-1 my-3">
                    {buttonContent}

                    <div className="modal fade" id="uploadModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Upload a new signature</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="card text-bg-light d-flex flex-row gap-2 p-3 text-secondary">
                                        <i className="bi bi-info-circle text-secondary"></i>
                                        Please upload an image of your signature. It must be a PNG file with a transparent background. The file must not be larger than 16MB.
                                    </div>
                  
                                        <input 
                                            type="file" 
                                            name="file"
                                            className="form-control mt-3" 
                                            aria-describedby="inputGroupFileAddon04"
                                            aria-label="Upload"
                                            onChange={onFileChanged}
                                            required>
                                        </input>
                       
                                </div>
                                <div className="modal-footer">
                                    <button 
                                    type="button" 
                                    className="btn btn-secondary" data-bs-dismiss="modal">
                                        Close
                                    </button>
                                    <button 
                                    type="button" 
                                    className="btn btn-success" data-bs-dismiss="modal"
                                    onClick={onSubmit}>
                                        Upload
                                    </button>
                                </div>
                                </div>
                            </div>
                        </div>

                    <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Are you sure you want to delete your current signature?</h1>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onDelete}>Yes</button>
                            </div>
                            </div>
                        </div>
                    </div>

                </div>
                <p>Your current signature:</p>
                <div className="border p-3 mb-4">
                    {imgContent}
                </div>
            </div>

            </div>
        </>
    )
}

export default ManageSignature;
