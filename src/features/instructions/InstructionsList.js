// import axios from "axios";
import axios from '../../api/axios'
import InstructionsListRows from "./InstructionsListRows";
import useAuth from '../../hooks/useAuth';
import useTitle from "../../hooks/useTitle";

import { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Link } from "react-router-dom";

const InstructionsList = () => {

  useTitle("Instruction Letters");
  const [RegularLetters, setRegularLetters] = useState([]);
  const [users, setUsers] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    axios.get(`/letters`).then((res) => {
      setRegularLetters(
        res.data.filter((letter) => letter.letterType === "Instruction")
      );
    }).catch(function (err){
      setRegularLetters(['empty'])
    });
    axios.get(`/users`).then((res) => {
      setUsers(res.data);
    });
  }, []);

  let inboundInstructions = RegularLetters.filter((letter) => letter.recipient === auth?.userId)

  let outboundInstructions = RegularLetters.filter((letter) => letter.user === auth?.userId)

  let inboundTable = null;
  let outboundTable = null;
  let emptyMsgIn = null;
  let emptyMsgOut = null;

  if(inboundInstructions.length !== 0) {
    inboundTable = inboundInstructions.map((letter) => {
      return <InstructionsListRows letter={letter} users={users} type={0} key={letter._id} />; //0 for inbound letters
    }).reverse()
  } else {
    emptyMsgIn = <div className="ps-2 text-secondary">
      <p>You haven't recieved any instructions yet.</p>
      </div>
  }

 
  if(outboundInstructions.length !== 0) {
    outboundTable = outboundInstructions.map((letter) => {
      return <InstructionsListRows letter={letter} users={users} type={1} key={letter._id} />; //1 for outbound letters
    }).reverse()
  } else {
    emptyMsgOut = <div className="ps-2 text-secondary">
      <p>You haven't issued any instructions yet.</p>
      </div>
  }

  return (
    <div className="p-3 rounded bg-white shadow-sm">
      <div className="card text-bg-light d-flex flex-row gap-2 p-3 text-secondary">
        <i className="bi bi-info-circle text-secondary"></i>
        This is a list of all instructions addressed to you and the instructions you've sent, divided into inbound and outbound instructions respectively. You can view each instruction by clicking on the view button in the controls column of the table.
      </div>

      <div className="d-flex mt-4">
        <h4 className="mono-text">List of Instructions</h4>
        <Link className="ms-auto btn btn-primary" to="/dash/instructions/new">
        <i className="bi bi-envelope-plus"></i> Issue a new instruction
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
            <tbody>{inboundTable}</tbody>
          </table>
          {emptyMsgIn}
        </TabPanel>

        <TabPanel>
          <table className="table table-sm table-bordered table-hover table-fixed mt-2">
            <thead className="table-thead">
              <tr>
                <th scope="col" className="table-th" style={{ width: "10%" }}>
                  Date Issued
                </th>
                <th scope="col" className="table-th" style={{ width: "20%" }}>
                  Issued To
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
            <tbody>{outboundTable}</tbody>
          </table>
          {emptyMsgOut}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default InstructionsList;
