// import { Link } from "react-router-dom";
import useAuth from '../../hooks/useAuth';

const Welcome = () => {

  const { auth } = useAuth();

  const content = (
    <div className="p-3 rounded bg-white shadow-sm">
      <h2 className="mono-text mb-4">Welcome {auth.username}</h2>

      <div className="d-flex gap-2">

        <div className="card" style={{ width: '20%' }}>
            <div className="card-header text-secondary">Your Notifications (TBA)</div>
            <div className="card-body">
            </div>
        </div>

        <div className="card" style={{ width: "70%" }}>
            <div className="card-body p-4">
            <h4 className="">About the Digital Letter Archive and Signing System</h4>
                <p>This system was designed to provide these features:</p>
                <ul>
                    <li>
                    Allow students to send letters to academic staff to gain approval
                    through signature
                    </li>
                    <li>
                    Allow academic staff to approve student submitted letters via
                    digital signature or reject them
                    </li>
                    <li>
                    Allow academic staff to reliably send letters between each other
                    </li>
                    <li>
                    Allow academic staff to issue instructions via letters between
                    each other
                    </li>
                </ul>
                <h6>What is a letter?</h6>
                <p>Letters in this system represent the digital versions of paper letters of importance in the context of academia and administration, these letters are PDF files stored in our system, accessible (downloadable) by students and academic staff.</p>

                <h6>What is a submission?</h6>
                <p>Submissions in this system represent student submitted letters that require the signature of a particular academic staff, such as the case of a student needing the signature of a professor on a recommendation letter to apply for an academic program.</p>

                <h6>What is an instruction?</h6>
                <p>Instructions in this system represent letters of instruction which contain details for a specific formal assignment to be conducted by an academic staff pertaining to academic or administrative matters, issued by another academic staff.</p>

                <h6>How does letter transmission work?</h6>
                <p>Academic staff are only able to send letters to one other academic staff per letter. Academic staff cannot send letters to students, but students are able to send letters (in the form of submissions) to academic staff. Students aare unable to send letters to other students.</p>
            </div>
          
        </div>
      </div>

      
    </div>
  );

  return content;
};
export default Welcome;
