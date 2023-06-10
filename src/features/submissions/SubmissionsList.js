// import axios from "axios";
import axios from '../../api/axios'
import SubmissionsListRows from "./SubmissionsListRows";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SubmissionsList = () => {

  useTitle("Submissions List");
  const { auth } = useAuth();
  const isStaff = auth?.role === 'Staff'

  const [RegularLetters, setRegularLetters] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`/letters`).then((res) => {
      setRegularLetters(
        res.data.filter((letter) => letter.letterType === "Submission")
      );
    });
    axios.get(`/users`).then((res) => {
      setUsers(res.data);
    });
  }, []);

  let inboundSubmissions = RegularLetters.filter((letter) => letter.recipient === auth.userId)

  let outboundSubmissions = RegularLetters.filter((letter) => letter.user === auth.userId)

  let inboundTable = null;
  let outboundTable = null;
  let emptyMsgIn = null;
  let emptyMsgOut = null;
  
  if(inboundSubmissions.length !== 0) {
    inboundTable = inboundSubmissions.map((letter) => {
      return <SubmissionsListRows letter={letter} users={users} type={0} key={letter._id} />; //0 for inbound letters
  }).reverse()
  } else {
    emptyMsgIn = <div className="ps-2 text-secondary">
    <p>You haven't recieved any student submissions yet.</p>
    </div>
  }

  if(outboundSubmissions.length !== 0) {
    outboundTable = outboundSubmissions.map((letter) => {
      return <SubmissionsListRows letter={letter} users={users} type={1} key={letter._id} />; //1 for outbound letters
    }).reverse()
  } else {
    emptyMsgOut = <div className="ps-2 text-secondary">
    <p>You haven't sent any submissions yet.</p>
    </div>
  }

  return (
    <div className="p-3 rounded bg-white shadow-sm">
      <div className="card text-bg-light d-flex flex-row gap-2 p-3 text-secondary">
      <i className="bi bi-info-circle text-secondary"></i>
        {
          isStaff 
          ?
          'This is a list of all student submissions addressed to you. You can view each submission by clicking on the view button in the controls column of the table.'
          :
          "This is a list of all the submissions you've made to academic staff. You can view each submission by clicking on the view button in the controls column of the table."
        }       
      </div>
      
      <div className="d-flex mt-4">
        <h4 className="mono-text">List of Student Submissions</h4>
        {
          isStaff 
          ?
          null
          :
          <Link className="ms-auto btn btn-primary" to="/dash/submissions/new">
          <i className="bi bi-envelope-plus"></i> Make a new submission
          </Link>
        }
      </div>

      <table className="table table-sm table-bordered table-hover table-fixed mt-4">
        <thead className="table-thead">
          <tr>
            <th scope="col" className="table-th" style={{ width: "10%" }}>
              Sent
            </th>
            <th scope="col" className="table-th" style={{ width: "10%" }}>
              {isStaff ? "Student" : "To"}
            </th>
            <th scope="col" className="table-th" style={{ width: "30%" }}>
              Title
            </th>
            <th scope="col" className="table-th" style={{ width: "20%" }}>
              Category
            </th>
            <th scope="col" className="table-th" style={{ width: "10%" }}>
              Status
            </th>
            <th scope="col" className="table-th" style={{ width: "10%" }}>
              Controls
            </th>
          </tr>
        </thead>
        <tbody>{isStaff ? inboundTable : outboundTable}</tbody>
      </table>
      {isStaff ? emptyMsgIn : emptyMsgOut}
    </div>
  );
};

export default SubmissionsList;
