import { useContext } from "react";
import { MainContext } from "../Auth/AuthContext";
import { Navigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const Protected = ({ children }) => {
    const { user, load } = useContext(MainContext);
    if (load) {
        return <div className="h-screen flex justify-center items-center">
            <FaSpinner className='text-5xl animate-spin'></FaSpinner>
        </div>
    }
    if (user) {
        return children
    }
    else {
        return <Navigate to='/login' />
    }
};

export default Protected;