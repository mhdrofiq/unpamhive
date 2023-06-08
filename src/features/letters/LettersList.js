import axios from "axios";
import { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Link } from "react-router-dom";
import LettersListRows from "./LettersListRows";

const LettersList = () => {
  // const [allLetters, setAllLetters] = useState([])
  const [RegularLetters, setRegularLetters] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3500/letters`).then((res) => {
      setRegularLetters(
        res.data.filter((letter) => letter.letterType === "Letter")
      );
    });
    axios.get(`http://localhost:3500/users`).then((res) => {
      setUsers(res.data);
    });
  }, []);

  //TODO: divide table data into inbound and outbound letters here

  const tableData = RegularLetters.map((letter) => {
    return <LettersListRows letter={letter} users={users} key={letter._id} />;
  }).reverse()

  return (
    <div className="p-3 rounded bg-white shadow-sm">
      <div className="card text-bg-light d-flex flex-row gap-2 p-3 text-secondary">
        <i className="bi bi-info-circle text-secondary"></i>
        This is a list of all letters addressed to you and the letters you've sent, divided into inbound and outbound letters respectively. You can view each letter by clicking on the view button in the controls column of the table.
      </div>

      <div className="d-flex mt-4">
        <h4 className="mono-text">List of Letters</h4>
        <Link className="ms-auto btn btn-primary" to="/dash/letters/new">
        <i className="bi bi-envelope-plus"></i> Send a new letter
        </Link>
      </div>
        
      <Tabs className="mt-4">
        <TabList>
          <Tab>Inbound Letters</Tab>
          <Tab>Outbound Letters</Tab>
        </TabList>

        <TabPanel>
          <table className="table table-sm table-bordered table-hover table-fixed mt-2">
            <thead className="table-thead">
              <tr>
                <th scope="col" className="table-th" style={{ width: "10%" }}>
                  Sent
                </th>
                <th scope="col" className="table-th" style={{ width: "10%" }}>
                  From
                </th>
                <th scope="col" className="table-th" style={{ width: "40%" }}>
                  Title
                </th>
                <th scope="col" className="table-th" style={{ width: "20%" }}>
                  Category
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

export default LettersList;
