import { useNavigate } from "react-router-dom";

const InstructionsListRows = ({ letter, users, type }) => {

    const navigate = useNavigate()

    function getUsernameFromId(targetId) {
        let senderName = null;
        for (let i = 0; i < users.length; i++) {
            if (users[i]._id === targetId) {
                senderName = users[i].username;
                break;
            }
        }
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

    let nameShown;
    let editButtonShown;
    switch(type){
        case 0:
            nameShown = getUsernameFromId(letter.user)
            editButtonShown = null
            break;
        case 1:
            nameShown = getUsernameFromId(letter.recipient)
            editButtonShown = 
                <button className="btn btn-sm btn-outline-warning" onClick={handleEdit}>
                <i className="bi bi-pencil-square"></i> Edit
                </button>
            break
        default:
            nameShown = "No name error"
    } 

    return (
        <tr>
        <td>{created}</td>
        <td>{nameShown}</td>
        <td>{letter.title}</td>
        <td>{startDate}</td>
        <td>{endDate}</td>
        <td  className="d-flex flex-row gap-1">
            <button className="btn btn-sm btn-outline-primary" onClick={handleView}>
            <i className="bi bi-envelope-open"></i> View
            </button>
            {editButtonShown}
        </td>
        </tr>
    );
};

export default InstructionsListRows;
