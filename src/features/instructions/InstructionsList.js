import axios from "axios";
import { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Link } from "react-router-dom";
import InstructionsListRows from "./InstructionsListRows";

const InstructionsList = () => {
  // const [allLetters, setAllLetters] = useState([])
  const [RegularLetters, setRegularLetters] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3500/letters`).then((res) => {
      setRegularLetters(
        res.data.filter((letter) => letter.letterType === "Instruction")
      );
    });
    axios.get(`http://localhost:3500/users`).then((res) => {
      setUsers(res.data);
    });
  }, []);

  //TODO: divide table data into inbound and outbound letters here

  const tableData = RegularLetters.map((letter) => {
    return <InstructionsListRows letter={letter} users={users} key={letter._id} />;
  });

  return (
    <div className="p-3 rounded bg-white shadow-sm">
      <div className="card text-bg-light d-flex flex-row gap-2 p-3 text-secondary">
        <i className="bi bi-info-circle text-secondary"></i>
        This is a list of all instructions addressed to you and the instructions you've sent, divided into inbound and outbound instructions respectively. You can view each instruction by clicking on the view button in the controls column of the table.
      </div>

      <div className="d-flex mt-4">
        <h4 className="mono-text">List of Instructions</h4>
        <Link className="ms-auto btn btn-primary" to="/dash/instructions/new">
        <i class="bi bi-envelope-plus"></i> Issue a new instruction
        </Link>
      </div>
        
      <Tabs className="mt-4">
        <TabList>
          <Tab>Inbound Instructions</Tab>
          <Tab>Outbound Instructions</Tab>
        </TabList>

        <TabPanel>
          <table className="table table-sm table-bordered table-hover table-fixed mt-2">
            <thead className="table-thead">
              <tr>
                <th scope="col" className="table-th" style={{ width: "10%" }}>
                  Date Issued
                </th>
                <th scope="col" className="table-th" style={{ width: "20%" }}>
                  Issued By
                </th>
                <th scope="col" className="table-th" style={{ width: "40%" }}>
                  Title
                </th>
                <th scope="col" className="table-th" style={{ width: "10%" }}>
                  Starting Date
                </th>
                <th scope="col" className="table-th" style={{ width: "10%" }}>
                  Ending Date
                </th>
                <th scope="col" className="table-th" style={{ width: "10%" }}>
                  Controls
                </th>
              </tr>
            </thead>
            <tbody>{tableData}</tbody>
          </table>
        </TabPanel>
        <TabPanel>
          <h3>outbound content here</h3>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default InstructionsList;
