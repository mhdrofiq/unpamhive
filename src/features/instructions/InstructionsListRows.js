import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const InstructionsListRows = ({ letter, users }) => {

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
    })
    const startDate = new Date(letter.start).toLocaleString('en-US', { 
        day:'numeric', 
        month:'long',
        year: "numeric",
    })
    const endDate = new Date(letter.end).toLocaleString('en-US', { 
        day:'numeric', 
        month:'long',
        year: "numeric",
    })

    const handleView = () => navigate(`/dash/instructions/view/${letter._id}`)
    const handleEdit = () => navigate(`/dash/instructions/edit/${letter._id}`)

    return (
        <tr>
        <td>{created}</td>
        <td>{getUsernameFromId(letter.user)}</td>
        <td>{letter.title}</td>
        <td>{startDate}</td>
        <td>{endDate}</td>
        <td  className="d-flex flex-row gap-1">
            <button className="btn btn-sm btn-outline-primary" onClick={handleView}>
            <i className="bi bi-envelope-open"></i> View
            </button>
            <button className="btn btn-sm btn-outline-warning" onClick={handleEdit}>
            <i className="bi bi-pencil-square"></i> Edit
            </button>
        </td>
        </tr>
    );
};

export default InstructionsListRows;
