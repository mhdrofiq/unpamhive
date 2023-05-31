import axios from "axios"
import { Component } from "react";

export default class UsersList extends Component {

    state = {
        users: []
    }

    componentDidMount(){
        axios.get(`http://localhost:3500/users`)
          .then(res => {
            const users = res.data;
            this.setState({ users });
          })
    }

    render(){
        return (
            <>
            <h1>UsersList</h1>
            <ul>
            {
              this.state.users
                .map(user =>
                  <li key={user.id}>{user.username}</li>
                )
            }
            </ul>
            </>        
        )
    }
   
}