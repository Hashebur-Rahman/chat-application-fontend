import React, { useContext, useEffect } from 'react';
import { MainContext } from '../Auth/AuthContext';
import { useLocation } from 'react-router-dom';
import sound from '../../assets/audio/out-of-nowhere-message-tone.mp3'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Wrap = ({ children }) => {
    const { user, setUser, load, socket, setLoad, chatList, setChatList, chatListLoad, setChatListLoad } = useContext(MainContext);

    const path = useLocation().pathname;
    const chatIdPath = path?.split('/')[path?.split('/').length - 1]
  


    return (
        <>
           
        </>
    );
};

export default Wrap;