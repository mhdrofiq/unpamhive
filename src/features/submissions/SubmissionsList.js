import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SubmissionsListRows from "./SubmissionsListRows";

const SubmissionsList = () => {
  // const [allLetters, setAllLetters] = useState([])
  const [RegularLetters, setRegularLetters] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3500/letters`).then((res) => {
      setRegularLetters(
        res.data.filter((letter) => letter.letterType === "Submission")
      );
    });
    axios.get(`http://localhost:3500/users`).then((res) => {
      setUsers(res.data);
    });
  }, []);

  //TODO: divide table data into inbound and outbound letters here

  const tableData = RegularLetters.map((letter) => {
    return (
      <SubmissionsListRows letter={letter} users={users} key={letter._id} />
    );
  });

  return (
    <div className="p-3 rounded bg-white shadow-sm">
      <div className="card text-bg-light d-flex flex-row gap-2 p-3 text-secondary">
        <i className="bi bi-info-circle text-secondary"></i>
        This is a list of all student submissions addressed to you. You can view
        each submission by clicking on the view button in the controls column of
        the table.
        {/* add conditional for staff and student */}
        {/* This is a list of all the submissions you've made to academic staff. You can view each submission by clicking on the view button in the controls column of
        the table. */}
      </div>
      
      <div className="d-flex mt-4">
        <h4 className="mono-text">List of Student Submissions</h4>
        {/* <Link className="ms-auto btn btn-primary" to="/dash/submissions/new">
        <i class="bi bi-envelope-plus"></i> Make a new submission
        </Link> */}
      </div>

      <table className="table table-sm table-bordered table-hover table-fixed mt-4">
        <thead className="table-thead">
          <tr>
            <th scope="col" className="table-th" style={{ width: "10%" }}>
              Sent
            </th>
            <th scope="col" className="table-th" style={{ width: "10%" }}>
              Student
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
        <tbody>{tableData}</tbody>
      </table>
    </div>
  );
};

export default SubmissionsList;
