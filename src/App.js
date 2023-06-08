import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import LettersList from './features/letters/LettersList'
import UsersList from './features/users/UsersList'
import CreateLetter from './features/letters/CreateLetter'
import ViewLetter from './features/letters/ViewLetter'
import SubmissionsList from './features/submissions/SubmissionsList'
import ViewSubmission from './features/submissions/ViewSubmission'
import CreateSubmission from './features/submissions/CreateSubmission'
import InstructionsList from './features/instructions/InstructionsList'
import ViewInstruction from './features/instructions/ViewInstruction'
import CreateInstruction from './features/instructions/CreateInstruction'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import EditLetter from './features/letters/EditLetter'
import EditSubmission from './features/submissions/EditSubmission'
import EditInstruction from './features/instructions/EditInstruction'
import AddImage2 from './features/submissions/AddImage2'
import ManageSignature from './features/signature/ManageSignature'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="dash" element={<DashLayout />}>

          <Route index element={<Welcome />} />

          <Route path="signature">
            <Route index element={<ManageSignature />} />
          </Route>

          <Route path="letters">
            <Route index element={<LettersList />} />
            <Route path="new" element={<CreateLetter/>}/>
            <Route path="view/:id" element={<ViewLetter/>}/>
            <Route path="edit/:id" element={<EditLetter/>}/>
          </Route>

          <Route path="submissions">
            <Route index element={<SubmissionsList />} />
            <Route path="new" element={<CreateSubmission/>}/>
            <Route path="view/:id" element={<ViewSubmission/>}/>
            <Route path="edit/:id" element={<EditSubmission/>}/>
            <Route path="addImage" element={<AddImage2/>}/>
          </Route>

          <Route path="instructions">
            <Route index element={<InstructionsList />} />
            <Route path="new" element={<CreateInstruction/>}/>
            <Route path="view/:id" element={<ViewInstruction/>}/>
            <Route path="edit/:id" element={<EditInstruction/>}/>
          </Route>

          <Route path="users">
            <Route index element={<UsersList />} />
          </Route>

        </Route>{/* End Dash */}

      </Route>
    </Routes>
  );
}

export default App;