// import axios from "axios";
import axios from "../../api/axios";
import LettersListRows from "./LettersListRows";
import useAuth from '../../hooks/useAuth';
import useTitle from "../../hooks/useTitle";

import { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Link } from "react-router-dom";

const LettersList = () => {

  useTitle("Letter Archive");
  const [RegularLetters, setRegularLetters] = useState([]);
  const [users, setUsers] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    axios.get(`/letters`).then((res) => {
      setRegularLetters(
        res.data.filter((letter) => letter.letterType === "Letter")
      );
    }).catch(function (err){
      setRegularLetters(['empty'])
    });
    axios.get(`/users`).then((res) => {
      setUsers(res.data);
    });
  }, []);

  let inboundLetters = RegularLetters.filter((letter) => letter.recipient === auth?.userId)

  let outboundLetters = RegularLetters.filter((letter) => letter.user === auth?.userId)

  let inboundTable = null;
  let outboundTable = null;
  let emptyMsgIn = null;
  let emptyMsgOut = null;

  if(inboundLetters.length !== 0) {
    inboundTable = inboundLetters.map((letter) => {
      return <LettersListRows letter={letter} users={users} type={0} key={letter._id} />; //0 for inbound letters
    }).reverse()
  } else {
    emptyMsgIn = <div className="ps-2 text-secondary">
      <p>You haven't recieved any letters yet.</p>
      </div>
  }

  if(outboundLetters.length !== 0) {
    outboundTable = outboundLetters.map((letter) => {
      return <LettersListRows letter={letter} users={users} type={1} key={letter._id} />; //1 for outbound letters
    }).reverse()
  } else {
    emptyMsgOut = <div className="ps-2 text-secondary">
    <p>You haven't sent any letters yet.</p>
    </div>
  }

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
            <tbody>{inboundTable}</tbody>
          </table>
          {emptyMsgIn}
        </TabPanel>

        <TabPanel>
          <table className="table table-sm table-bordered table-hover table-fixed mt-2">
            <thead className="table-thead">
              <tr>
                <th scope="col" className="table-th" style={{ width: "10%" }}>
                  Sent
                </th>
                <th scope="col" className="table-th" style={{ width: "10%" }}>
                  To
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
            <tbody>{outboundTable}</tbody>
          </table>
          {emptyMsgOut}
        </TabPanel>
      </Tabs>

    </div>
  );
};

export default LettersList;
