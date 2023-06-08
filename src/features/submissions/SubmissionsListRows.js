import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SubmissionsListRows = ({ letter, users }) => {

    const navigate = useNavigate()

    function getUsernameFromId(targetId) {
        let senderName = null;
        // console.log(this.state.users)
        for (let i = 0; i < users.length; i++) {
        //console.log(this.state.users[i]._id)
        if (users[i]._id === targetId) {
            senderName = users[i].username;
        }
        }
        //console.log(senderName)
        return senderName;
    }

    const created = new Date(letter.createdAt).toLocaleString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    
    function statusStyle() {
        if(letter.letterStatus === "Open") {
            return ('text-warning')
        }else if(letter.letterStatus === "Approved") {
            return ('text-success')
        }else if(letter.letterStatus === "Rejected") {
            return ('text-danger')
        }
    }

    const handleView = () => navigate(`/dash/submissions/view/${letter._id}`)
    const handleEdit = () => navigate(`/dash/submissions/edit/${letter._id}`)

    let editButton;
    if(letter.letterStatus === "Open") {
        editButton = (
            <>
                <button className="btn btn-sm btn-outline-warning" onClick={handleEdit}>
                <i className="bi bi-pencil-square"></i> Edit
                </button>
            </>
        )
    } else {
        editButton = null
    }

    return (
        <tr>
        <td>{created}</td>
        <td>{getUsernameFromId(letter.user)}</td>
        <td>{letter.title}</td>
        <td>{letter.category}</td>
        <td className={statusStyle()}>{letter.letterStatus}</td>
        <td className="d-flex flex-row gap-1">
            <button className="btn btn-sm btn-outline-primary" onClick={handleView}>
                <i className="bi bi-envelope-open"></i> View
            </button>
            {editButton}
        </td>
        </tr>
    );
};

export default SubmissionsListRows;
