import React, { useContext } from 'react';
import { MainContext } from '../Auth/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginRouteProtected = ({children}) => {
    const { user, load } = useContext(MainContext);
    if (load) return
    if (user) return <Navigate to='/' />
    return children
};

export default LoginRouteProtected;