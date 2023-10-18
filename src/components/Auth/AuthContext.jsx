import { createContext, useEffect, useState } from "react";
import { baseURL } from "../../App";
import io from 'socket.io-client';
import { useLocation } from "react-router-dom";
const socket = io.connect('https://chat-backend-4iff.onrender.com');


export const MainContext = createContext(null);

const AuthContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [load, setLoad] = useState(true);
    const [chatList, setChatList] = useState([]);
    const [chatList2, setChatList2] = useState([]);
    const [chatListLoad, setChatListLoad] = useState(true);


    useEffect(() => {
        if (!user) return;
        setChatListLoad(true);
        fetch(`${baseURL}/chatList`, {
            headers: {
                'Authorization': `${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setChatList(data.chatList);
                    setChatList2(data.chatList);
                    setChatListLoad(false);
                }
                else {
                    setChatList([]);
                    setChatList2([]);
                    setChatListLoad(false);
                }
            })
            .catch(err => {
                setChatList([]);
                setChatList2([]);
                setChatListLoad(false);
            })
    }, [user]);

    useEffect(() => {
        setLoad(true);
        const token = localStorage.getItem('token');
        if (!token || user) {
            setLoad(false);
            return;
        }
        fetch(`${baseURL}/account`, {
            headers: { 'Authorization': `${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUser(data.userInfo);
                    setLoad(false);
                }
                else {
                    localStorage.removeItem('token');
                    setUser(null);
                    setLoad(false);
                }
            })
            .catch(err => {
                localStorage.removeItem('token');
                setUser(null);
                setLoad(false);
            })

    }, []);





    const value = {
        user,
        setUser,
        load,
        setLoad,
        chatList,
        setChatList,
        chatListLoad,
        setChatListLoad,
        socket,
        chatList2,
        setChatList2
    }
    return (
        <MainContext.Provider value={value}>
            {children}
        </MainContext.Provider>
    );
};

export default AuthContext;