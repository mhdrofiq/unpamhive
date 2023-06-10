import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    //NOTE: this stores a boolean in localStorage which is used to determine whether or not the system can trust this device -- allows us to persist the login
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    // console.log('auth: ', auth);

    return (
        //here we are passsing things to the value prop which lets us use them all over the app by accessing the context
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;