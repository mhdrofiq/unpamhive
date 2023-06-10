import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useRefreshToken from "../../hooks/useRefreshToken";
// import axios from "../../api/axios";

const UsersList = () => {
    const [users, setUsers] = useState();
    const refresh = useRefreshToken();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController(); //cancel any pending reqs if the component unmounts

    const getUsers = async () => {
        try {
            const response = await axiosPrivate.get('/users', {
                signal: controller.signal
            });
            console.log(response.data);
            isMounted && setUsers(response.data);
        } catch (err) {
            console.error(err);
            navigate('/login', { state: { from: location }, replace: true }); //send the user back to the location they were from
        }
    }
    getUsers();

    return () => {
        isMounted = false;

        //NOTE: previous version was just 'controller?.abort();'. This didnt work because useEffect was being run twice due to new react version. https://stackoverflow.com/questions/73140563/axios-throwing-cancelederror-with-abort-controller-in-react
        isMounted && controller.abort();
    }
  }, []);

  return (
    <article>
      <h1>UsersList</h1>
      {users?.length
      ? (
        <ul>
          {users.map((user, i) => <li key={i}>{user?.username}</li>)}
        </ul>
      ) :
      <p>No users to display</p>
      }
      <button onClick={() => refresh()}>
        Refresh me
      </button>
    </article>
  );
};

export default UsersList;
